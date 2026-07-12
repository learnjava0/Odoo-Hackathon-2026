import { differenceInCalendarDays, format, isAfter, parseISO } from "date-fns";

export function formatDate(value, pattern = "dd MMM yyyy") {
  if (!value) return "—";
  return format(typeof value === "string" ? parseISO(value) : value, pattern);
}

export function getLicenseState(expiryDate) {
  const today = new Date();
  const expiry = parseISO(expiryDate);
  if (isAfter(today, expiry)) {
    return { tone: "red", label: "Expired", days: differenceInCalendarDays(today, expiry) };
  }
  const days = differenceInCalendarDays(expiry, today);
  if (days <= 30) {
    return { tone: "amber", label: "Expiring soon", days };
  }
  return { tone: "slate", label: "Valid", days };
}

export function isExpired(dateString) {
  return parseISO(dateString) < new Date(new Date().toDateString());
}
