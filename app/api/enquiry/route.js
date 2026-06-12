import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { sanitizeEnquiryPayload, validateEnquiryPayload } from '@/lib/form-validation';

// Initialize Supabase client
// Using service role key for server-side API operations (bypasses RLS)
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Fallback to publishable key if service role not configured
const supabase = supabaseServiceRole || createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  try {
    const formData = await request.json();

    const validation = validateEnquiryPayload(formData);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        message: validation.message,
      }, { status: 400 });
    }

    const sanitized = sanitizeEnquiryPayload(formData);

    // 1. Save to Database
    const { data: enquiry, error: dbError } = await supabase
      .from('enquiries')
      .insert([
        {
          name: sanitized.name,
          email: sanitized.email,
          phone: sanitized.phone,
          passengers: sanitized.passengers ? parseInt(sanitized.passengers, 10) : null,
          duration: sanitized.duration,
          place: sanitized.place,
          budget: sanitized.budget,
          status: 'new'
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to save enquiry: ${dbError.message}`);
    }

    // 2. Send Email Notification
    let emailSent = false;
    if (resend && process.env.ENQUIRY_EMAIL_TO) {
      try {
        const emailHtml = buildEmailHtml(sanitized);
        
        await resend.emails.send({
          from: process.env.ENQUIRY_EMAIL_FROM || 'onboarding@resend.dev',
          to: process.env.ENQUIRY_EMAIL_TO,
          subject: `🌍 New Travel Enquiry from ${sanitized.name}`,
          html: emailHtml,
        });
        
        emailSent = true;
        console.log("Email notification sent successfully");
      } catch (emailError) {
        console.error("Email error:", emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log("Email not configured. Set RESEND_API_KEY and ENQUIRY_EMAIL_TO in .env.local");
    }

    // 3. Log for debugging
    console.log("New enquiry saved:", {
      id: enquiry.id,
      name: sanitized.name,
      place: sanitized.place,
      emailSent,
      timestamp: new Date().toISOString()
    });

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: "Enquiry received successfully",
      enquiryId: enquiry.id,
      emailSent
    }, { status: 200 });

  } catch (error) {
    console.error("Failed to process enquiry:", error);
    return NextResponse.json({ 
      success: false,
      message: "Failed to process enquiry",
      error: error.message 
    }, { status: 500 });
  }
}

// Helper function to build email HTML
function buildEmailHtml(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #18181b 0%, #3f3f46 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #f9fafb;
      padding: 30px;
      border-radius: 0 0 10px 10px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .field {
      margin: 15px 0;
      padding: 12px;
      background: white;
      border-radius: 6px;
      border-left: 3px solid #18181b;
    }
    .field-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .field-value {
      font-size: 16px;
      color: #18181b;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🌍 New Travel Enquiry</h1>
    <p style="margin: 5px 0 0 0; opacity: 0.9;">Anjali World Tourism</p>
  </div>
  
  <div class="content">
    <div class="field">
      <div class="field-label">👤 Name</div>
      <div class="field-value">${data.name}</div>
    </div>
    
    <div class="field">
      <div class="field-label">📧 Email</div>
      <div class="field-value"><a href="mailto:${data.email}" style="color: #18181b;">${data.email}</a></div>
    </div>
    
    <div class="field">
      <div class="field-label">📱 Phone</div>
      <div class="field-value"><a href="tel:${data.phone}" style="color: #18181b;">${data.phone}</a></div>
    </div>
    
    <div class="field">
      <div class="field-label">📍 Destination</div>
      <div class="field-value">${data.place}</div>
    </div>
    
    <div class="field">
      <div class="field-label">👥 Number of Passengers</div>
      <div class="field-value">${data.passengers || 'Not specified'}</div>
    </div>
    
    <div class="field">
      <div class="field-label">📅 Duration</div>
      <div class="field-value">${data.duration || 'Not specified'}</div>
    </div>
    
    <div class="field">
      <div class="field-label">💰 Budget</div>
      <div class="field-value">${data.budget || 'Not specified'}</div>
    </div>
  </div>
  
  <div class="footer">
    <p>This enquiry was submitted via your website chatbot</p>
    <p style="margin: 5px 0 0 0; font-size: 12px;">
      ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
    </p>
  </div>
</body>
</html>
  `;
}
