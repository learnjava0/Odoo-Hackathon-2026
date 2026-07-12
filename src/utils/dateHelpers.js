import { format, parseISO } from "date-fns";

export function formatDate(value, pattern = "MMM d, yyyy") {
  return format(parseISO(value), pattern);
}
