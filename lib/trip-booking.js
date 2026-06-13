const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Parse display price like "₹26,000" to integer rupees. */
export function parsePriceToRupees(price) {
  if (!price) return 0;
  const digits = String(price).replace(/[^\d]/g, "");
  return parseInt(digits, 10) || 0;
}

export function formatINR(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function computeTotalWithGst(perPersonRupees, pax, gstPercent = 5) {
  const subtotal = perPersonRupees * pax;
  const gst = Math.round(subtotal * (gstPercent / 100));
  return { subtotal, gst, total: subtotal + gst };
}

export function getDefaultBookingDate() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/** Next N weekly departure dates (Saturdays) from a given month offset. */
export function getDepartureDates({ count = 5, monthOffset = 0 } = {}) {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const base = new Date(today);
  base.setMonth(base.getMonth() + monthOffset);

  // Find next Saturday on or after base
  let cursor = new Date(base);
  const day = cursor.getDay();
  const daysUntilSaturday = (6 - day + 7) % 7;
  if (monthOffset === 0 && daysUntilSaturday === 0 && cursor <= today) {
    cursor.setDate(cursor.getDate() + 7);
  } else {
    cursor.setDate(cursor.getDate() + daysUntilSaturday);
  }

  while (dates.length < count) {
    if (cursor >= today) {
      dates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 7);
  }

  return dates;
}

export function formatDeparturePill(date) {
  return {
    day: date.getDate(),
    month: MONTHS_SHORT[date.getMonth()],
    label: `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`,
  };
}

export function formatFullDate(date) {
  return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()} ${WEEKDAYS[date.getDay()]}`;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getTripEndDate(departureDate, itineraryLength) {
  const nights = Math.max(itineraryLength - 1, 1);
  return addDays(departureDate, nights);
}

export function buildWhatsAppMessage(trip, { departureDate, pax = 1 } = {}) {
  const lines = [
    `Hi! I'm interested in booking:`,
    ``,
    `*${trip.name}*`,
    `Duration: ${trip.duration || "N/A"}`,
    `Price: ${trip.price || "N/A"} / person`,
  ];

  if (departureDate) {
    lines.push(`Departure: ${formatFullDate(departureDate)}`);
  }

  if (trip.category) {
    lines.push(`Category: ${trip.category}`);
  }

  lines.push(`Travelers: ${pax}`);
  lines.push(``);
  lines.push(`Please share availability and next steps.`);

  return lines.join("\n");
}

export function buildWhatsAppUrl(phone, message) {
  const digits = String(phone).replace(/\D/g, "");
  const normalized = digits.startsWith("91") ? digits : `91${digits}`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
