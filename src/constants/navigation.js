import {
  BarChart3,
  ClipboardList,
  Fuel,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { hasPageAccess } from "./roles";

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/", pageKey: "dashboard", icon: LayoutDashboard },
  { label: "Fleet", path: "/fleet", pageKey: "fleet", icon: Truck },
  { label: "Drivers", path: "/drivers", pageKey: "drivers", icon: Users },
  { label: "Trips", path: "/trips", pageKey: "trips", icon: ClipboardList },
  { label: "Maintenance", path: "/maintenance", pageKey: "maintenance", icon: ShieldCheck },
  { label: "Fuel & Expenses", path: "/fuel-expenses", pageKey: "fuelExpenses", icon: Fuel },
  { label: "Analytics", path: "/analytics", pageKey: "analytics", icon: BarChart3 },
  { label: "Settings", path: "/settings", pageKey: "settings", icon: Settings },
];

export const navigationItems = NAV_ITEMS;

export function getVisibleNavItems(role) {
  return NAV_ITEMS.filter((item) => hasPageAccess(role, item.pageKey));
}
