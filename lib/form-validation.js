const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_PATTERN = /^[a-zA-Z][a-zA-Z\s.'-]{1,98}$/;
const INDIAN_MOBILE_PATTERN = /^[6-9]\d{9}$/;

/**
 * @returns {{ valid: true } | { valid: false, message: string }}
 */
export function validationError(message) {
  return { valid: false, message };
}

export function validationOk() {
  return { valid: true };
}

export function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function normalizePhone(value) {
  return String(value ?? "").trim();
}

/** Strip to digits; returns 10-digit Indian mobile or null. */
export function parseIndianMobile(value) {
  const raw = String(value ?? "").trim();
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 10 && INDIAN_MOBILE_PATTERN.test(digits)) {
    return digits;
  }

  if (digits.length === 12 && digits.startsWith("91") && INDIAN_MOBILE_PATTERN.test(digits.slice(2))) {
    return digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith("0") && INDIAN_MOBILE_PATTERN.test(digits.slice(1))) {
    return digits.slice(1);
  }

  return null;
}

export function validateName(value, { required = true, label = "Name" } = {}) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return required ? validationError(`Please enter your ${label.toLowerCase()}.`) : validationOk();
  }

  if (trimmed.length < 2) {
    return validationError(`${label} must be at least 2 characters.`);
  }

  if (trimmed.length > 100) {
    return validationError(`${label} must be 100 characters or fewer.`);
  }

  if (!NAME_PATTERN.test(trimmed)) {
    return validationError(`${label} may only contain letters, spaces, dots, hyphens, and apostrophes.`);
  }

  return validationOk();
}

export function validateEmail(value, { required = true } = {}) {
  const trimmed = normalizeEmail(value);

  if (!trimmed) {
    return required ? validationError("Please enter your email address.") : validationOk();
  }

  if (trimmed.length > 254) {
    return validationError("Email address is too long.");
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return validationError("Please enter a valid email address (e.g. you@example.com).");
  }

  return validationOk();
}

export function validatePhone(value, { required = true } = {}) {
  const trimmed = normalizePhone(value);

  if (!trimmed) {
    return required ? validationError("Please enter your phone number.") : validationOk();
  }

  const mobile = parseIndianMobile(trimmed);
  if (!mobile) {
    return validationError("Please enter a valid 10-digit Indian mobile number (e.g. +91 98765 43210).");
  }

  return validationOk();
}

export function validateMessage(value, { required = false, minLength = 10 } = {}) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return required ? validationError("Please enter a message.") : validationOk();
  }

  if (trimmed.length < minLength) {
    return validationError(`Message must be at least ${minLength} characters.`);
  }

  if (trimmed.length > 2000) {
    return validationError("Message must be 2000 characters or fewer.");
  }

  return validationOk();
}

export function validatePassengers(value, { required = true } = {}) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return required ? validationError("Please enter the number of travelers.") : validationOk();
  }

  if (!/^\d+$/.test(trimmed)) {
    return validationError("Number of travelers must be a whole number.");
  }

  const count = Number.parseInt(trimmed, 10);
  if (count < 1) {
    return validationError("Number of travelers must be at least 1.");
  }

  if (count > 50) {
    return validationError("Number of travelers cannot exceed 50.");
  }

  return validationOk();
}

export function validatePlace(value, { required = true, label = "Destination" } = {}) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return required ? validationError(`Please enter a ${label.toLowerCase()}.`) : validationOk();
  }

  if (trimmed.length < 2) {
    return validationError(`${label} must be at least 2 characters.`);
  }

  if (trimmed.length > 120) {
    return validationError(`${label} must be 120 characters or fewer.`);
  }

  return validationOk();
}

export function validateBudget(value, { required = true } = {}) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return required ? validationError("Please enter your budget.") : validationOk();
  }

  if (trimmed.length < 2) {
    return validationError("Budget must be at least 2 characters.");
  }

  if (trimmed.length > 80) {
    return validationError("Budget must be 80 characters or fewer.");
  }

  return validationOk();
}

export function validateRating(value) {
  const rating = Number.parseInt(String(value ?? ""), 10);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return validationError("Please choose a rating from 1 to 5.");
  }

  return validationOk();
}

export function validateTravelDate(value, { required = true } = {}) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return required ? validationError("Please select a travel date.") : validationOk();
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return validationError("Please enter a valid travel date.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) {
    return validationError("Travel date cannot be in the past.");
  }

  return validationOk();
}

/** Validates a single enquiry chatbot / form field by id. */
export function validateEnquiryField(fieldId, value) {
  switch (fieldId) {
    case "name":
      return validateName(value);
    case "email":
      return validateEmail(value);
    case "phone":
      return validatePhone(value);
    case "passengers":
      return validatePassengers(value);
    case "duration":
      return validateTravelDate(value);
    case "place":
      return validatePlace(value);
    case "budget":
      return validateBudget(value);
    default:
      return validationOk();
  }
}

export function validateBookingDetails({ name, email, phone }) {
  const nameResult = validateName(name, { label: "Full name" });
  if (!nameResult.valid) return nameResult;

  const emailResult = validateEmail(email);
  if (!emailResult.valid) return emailResult;

  const phoneResult = validatePhone(phone);
  if (!phoneResult.valid) return phoneResult;

  return validationOk();
}

export function validateContactForm({ name, email, phone, message }) {
  const nameResult = validateName(name);
  if (!nameResult.valid) return nameResult;

  const emailResult = validateEmail(email);
  if (!emailResult.valid) return emailResult;

  const phoneResult = validatePhone(phone);
  if (!phoneResult.valid) return phoneResult;

  const messageResult = validateMessage(message, { required: false });
  if (!messageResult.valid) return messageResult;

  return validationOk();
}

export function validateReviewPayload(data) {
  const nameResult = validateName(data?.name);
  if (!nameResult.valid) return nameResult;

  const emailResult = validateEmail(data?.email);
  if (!emailResult.valid) return emailResult;

  const tripResult = validatePlace(data?.trip, {
    required: false,
    label: "Trip name",
  });
  if (!tripResult.valid) return tripResult;

  const ratingResult = validateRating(data?.rating);
  if (!ratingResult.valid) return ratingResult;

  const quoteResult = validateMessage(data?.quote, {
    required: true,
    minLength: 20,
  });
  if (!quoteResult.valid) return quoteResult;

  return validationOk();
}

export function validateEnquiryPayload(data) {
  const nameResult = validateName(data?.name);
  if (!nameResult.valid) return nameResult;

  const emailResult = validateEmail(data?.email);
  if (!emailResult.valid) return emailResult;

  const phoneResult = validatePhone(data?.phone);
  if (!phoneResult.valid) return phoneResult;

  const placeResult = validatePlace(data?.place);
  if (!placeResult.valid) return placeResult;

  if (data?.passengers != null && data.passengers !== "") {
    const passengersResult = validatePassengers(data.passengers);
    if (!passengersResult.valid) return passengersResult;
  }

  if (data?.duration) {
    const dateResult = validateTravelDate(data.duration);
    if (!dateResult.valid) return dateResult;
  }

  if (data?.budget) {
    const budgetResult = validateBudget(data.budget);
    if (!budgetResult.valid) return budgetResult;
  }

  return validationOk();
}

export function sanitizeBookingContact({ name, email, phone }) {
  const mobile = parseIndianMobile(phone);
  return {
    name: String(name ?? "").trim(),
    email: normalizeEmail(email),
    phone: mobile ? `+91${mobile}` : normalizePhone(phone),
  };
}

export function sanitizeEnquiryPayload(data) {
  const mobile = parseIndianMobile(data?.phone);
  return {
    ...data,
    name: String(data?.name ?? "").trim(),
    email: normalizeEmail(data?.email),
    phone: mobile ? `+91${mobile}` : normalizePhone(data?.phone),
    place: String(data?.place ?? "").trim(),
    budget: data?.budget ? String(data.budget).trim() : data?.budget,
  };
}

export function sanitizeReviewPayload(data) {
  return {
    name: String(data?.name ?? "").trim(),
    email: normalizeEmail(data?.email),
    designation: String(data?.designation ?? "").trim(),
    trip: String(data?.trip ?? "").trim(),
    trip_id: data?.trip_id ? String(data.trip_id).trim() : null,
    quote: String(data?.quote ?? "").trim(),
    rating: Number.parseInt(String(data?.rating ?? 5), 10),
  };
}
