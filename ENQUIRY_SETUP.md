# Enquiry System Setup Guide

Your enquiry system is ready! Here's how to complete the setup:

## ✅ What's Already Done

- **Database table created** for storing enquiries
- **API endpoint** at `/api/enquiry` to receive submissions
- **Admin page** at `/admin/enquiries` to view and manage enquiries
- **Email notifications** integrated with Resend
- **Chatbot** automatically submits enquiries after all fields are filled

## 🚀 Setup Steps

### 1. Run Database Migration

Run this command in your terminal:

```bash
npx supabase migration up
```

Or apply the migration manually in Supabase Dashboard:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/20240604_create_enquiries.sql`

### 2. Set Up Email Notifications (Resend)

#### Step 1: Get Your Resend API Key

1. Go to [resend.com](https://resend.com) and sign up (free account)
2. Navigate to **API Keys** section
3. Click **Create API Key**
4. Copy your API key (starts with `re_...`)

#### Step 2: Add to Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Resend API key and email settings:
   ```bash
   RESEND_API_KEY=re_your_actual_api_key_here
   ENQUIRY_EMAIL_FROM=noreply@yourdomain.com
   ENQUIRY_EMAIL_TO=your-email@example.com
   ```

   **Note:** 
   - For `ENQUIRY_EMAIL_FROM`: Use `onboarding@resend.dev` for testing, or add your domain in Resend dashboard
   - For `ENQUIRY_EMAIL_TO`: Use your actual email where you want to receive enquiries

#### Step 3: (Optional) Add Your Domain

To send from your own domain (e.g., `noreply@anjaliworldtourism.com`):





1. Go to Resend Dashboard → **Domains**
2. Click **Add Domain**
3. Follow the DNS setup instructions
4. Update `ENQUIRY_EMAIL_FROM` in `.env.local`

### 3. Restart Your Development Server

```bash
npm run dev
```

## 📊 How It Works

### User Flow:
1. User opens chatbot
2. User answers all questions (name, email, phone, destination, etc.)
3. Chatbot **automatically submits** the enquiry
4. Success message shown with option to "Book a Meeting"

### Backend Flow:
1. **Saves to Database** - All enquiries stored in Supabase `enquiries` table
2. **Sends Email** - Notification sent to your email via Resend
3. **Returns Success** - Confirms to user that enquiry was received

### Admin Flow:
1. Go to `/admin/enquiries`
2. View all enquiries in a dashboard
3. Filter by status (New, Contacted, Converted, Cancelled)
4. Update status by clicking the dropdown
5. Click email/phone to contact customer directly

## 📧 Email Notification Features

The email you receive includes:
- Beautiful HTML formatting
- Customer name, email, phone
- Trip details (destination, passengers, duration, budget)
- Timestamp in IST
- Direct mailto/tel links for quick contact

## 🔒 Security

- **RLS (Row Level Security)** enabled on enquiries table
- Public can only INSERT (submit enquiries)
- Only authenticated users (admin) can VIEW and UPDATE
- Service role key used in API route (server-side only)

## 📱 Admin Dashboard Features

Visit `/admin/enquiries` to:
- ✅ View all enquiries in chronological order
- ✅ Filter by status (All, New, Contacted, Converted, Cancelled)
- ✅ See stats dashboard (total, new, contacted, converted)
- ✅ Update enquiry status with dropdown
- ✅ Quick contact via email/phone links
- ✅ Real-time refresh

## 🎨 Customization

### Change Email Template

Edit the `buildEmailHtml()` function in `/app/api/enquiry/route.js`

### Add More Enquiry Fields

1. Update chatbot questions in `/components/enquiry-chatbot.jsx`
2. Add columns to database migration
3. Update email template to include new fields

### Change Status Options

Edit the status ENUM in the migration file and admin page

## ⚠️ Troubleshooting

### "Email not configured" in console
- Check that `RESEND_API_KEY` and `ENQUIRY_EMAIL_TO` are set in `.env.local`
- Restart your dev server after adding env variables

### "Failed to save enquiry" error
- Run the database migration: `npx supabase migration up`
- Check Supabase console for errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`

### Emails not sending
- Verify your Resend API key is correct
- Check you haven't exceeded free tier limits (3,000/month)
- Look at Resend dashboard logs for delivery status

### Can't view enquiries in admin
- Make sure you're logged in as an authenticated user
- Check browser console for errors
- Verify RLS policies were created in migration

## 🎉 You're All Set!

Your enquiry system is now:
- ✅ Storing all enquiries in database
- ✅ Sending email notifications
- ✅ Providing admin dashboard for management
- ✅ Automatically submitting after chatbot completion

Test it by:
1. Opening the chatbot on your site
2. Filling out all fields
3. Check your email for notification
4. View in `/admin/enquiries`

Need help? Check the console logs for detailed error messages.
