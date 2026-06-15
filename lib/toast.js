import { toast } from "sonner";

const FIELD_SCROLL_HINTS = [
  { pattern: /email/i, selector: '[name="email"], [type="email"], [data-field="email"]' },
  { pattern: /phone|mobile/i, selector: '[name="phone"], [type="tel"], [data-field="phone"]' },
  { pattern: /\bname\b/i, selector: '[name="name"], [data-field="name"]' },
  { pattern: /message|quote|review/i, selector: '[name="message"], [name="quote"], textarea, [data-field="message"]' },
  { pattern: /trip|destination|place/i, selector: '[name="place"], [name="trip_id"], select[name="trip"], [data-field="trip"]' },
  { pattern: /password/i, selector: '[name="password"], [type="password"]' },
  { pattern: /price|package|discount|capacity/i, selector: '[data-error-anchor="pricing"], [data-field="pricing"]' },
  { pattern: /media|photo|video|upload|image/i, selector: '[data-error-anchor="media"], [data-field="media"]' },
  { pattern: /departure|date/i, selector: '[data-error-anchor="date"], [data-field="date"]' },
];

function resolveScrollTarget(target) {
  if (!target) return null;

  if (typeof target === "string") {
    if (/^[.#\[]/.test(target)) {
      return document.querySelector(target);
    }
    return (
      document.querySelector(`[name="${target}"]`) ??
      document.querySelector(`[data-field="${target}"]`) ??
      document.querySelector(`[data-error-anchor="${target}"]`)
    );
  }

  if (target?.current) return target.current;
  if (target instanceof Element) return target;

  return null;
}

export function scrollToErrorTarget(target) {
  if (typeof window === "undefined") return;

  requestAnimationFrame(() => {
    let el = resolveScrollTarget(target);

    if (!el) {
      el = document.querySelector("[data-error-anchor]");
    }

    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });

    if (el instanceof HTMLElement) {
      if (!el.hasAttribute("tabindex")) {
        el.setAttribute("tabindex", "-1");
      }
      el.focus({ preventScroll: true });
    }
  });
}

function inferScrollTargetFromMessage(message) {
  const text = String(message || "");
  for (const hint of FIELD_SCROLL_HINTS) {
    if (hint.pattern.test(text)) {
      const el = document.querySelector(hint.selector);
      if (el) return el;
    }
  }
  return null;
}

/** Show error toast and scroll to the relevant field or `[data-error-anchor]`. */
export function showError(message, scrollTarget) {
  const text = String(message || "Something went wrong.");
  toast.error(text);

  const target =
    scrollTarget !== undefined ? scrollTarget : inferScrollTargetFromMessage(text);
  scrollToErrorTarget(target);
}

export function showSuccess(message) {
  toast.success(String(message));
}

export function showInfo(message) {
  toast.message(String(message));
}
