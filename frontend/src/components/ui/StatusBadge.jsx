import { Badge } from "./Badge";

const tones = {
  AVAILABLE: "green",
  COMPLETED: "green",
  GOOD: "green",
  ON_TRIP: "blue",
  DISPATCHED: "blue",
  "IN PROGRESS": "blue",
  IN_SHOP: "amber",
  DRAFT: "amber",
  PENDING: "amber",
  RETIRED: "red",
  SUSPENDED: "red",
  CANCELLED: "red",
  EXPIRED: "red",
  OFF_DUTY: "slate",
};

export function StatusBadge({ value }) {
  return <Badge tone={tones[value] ?? "slate"}>{String(value).replaceAll("_", " ")}</Badge>;
}
