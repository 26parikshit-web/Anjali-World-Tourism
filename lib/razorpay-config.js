import Razorpay from "razorpay";

/**
 * Razorpay Key ID always starts with rzp_test_ or rzp_live_.
 * Key secret is a separate string and must NOT start with rzp_.
 */
export function getRazorpayConfigError() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    return "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local (local dev) or your hosting env (production), then restart the server.";
  }

  const keyIdValid = keyId.startsWith("rzp_test_") || keyId.startsWith("rzp_live_");
  const secretLooksLikeKeyId =
    keySecret.startsWith("rzp_test_") || keySecret.startsWith("rzp_live_");
  const keyIdLooksLikeSecret = keyIdValid === false && !keyId.includes("your_key");

  if (secretLooksLikeKeyId && keyIdLooksLikeSecret) {
    return "Razorpay KEY_ID and KEY_SECRET appear swapped. KEY_ID must start with rzp_test_ or rzp_live_; KEY_SECRET is the other value from the Razorpay dashboard.";
  }

  if (!keyIdValid) {
    return "RAZORPAY_KEY_ID must start with rzp_test_ or rzp_live_. Check your Razorpay dashboard → API Keys.";
  }

  if (secretLooksLikeKeyId) {
    return "RAZORPAY_KEY_SECRET looks like a Key ID (starts with rzp_). Use the secret key from Razorpay dashboard, not the Key ID.";
  }

  return null;
}

export function createRazorpayClient() {
  const configError = getRazorpayConfigError();
  if (configError) return { client: null, error: configError };

  const keyId = process.env.RAZORPAY_KEY_ID.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET.trim();

  return {
    client: new Razorpay({ key_id: keyId, key_secret: keySecret }),
    error: null,
  };
}

export function getRazorpayKeyIdForCheckout() {
  return (
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() ||
    process.env.RAZORPAY_KEY_ID?.trim() ||
    null
  );
}

export function formatRazorpayError(error) {
  const description =
    error?.error?.description ||
    error?.description ||
    error?.message ||
    "Failed to create Razorpay order.";

  if (/authentication failed|invalid.*key|unauthorized/i.test(description)) {
    return `${description} — verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local and restart npm run dev.`;
  }

  return description;
}
