import {
  BarChart3,
  Fuel,
  LayoutDashboard,
  Settings,
  ShieldAlert,
  Truck,
  UserRound,
  Waypoints,
  Wrench
} from "lucide-react";
import { ALL_ROLES, ROLE_ADMIN, ROLE_MANAGER } from "./roles";

export const navigationItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, roles: ALL_ROLES },
  { label: "Fleet", to: "/fleet", icon: Truck, roles: ALL_ROLES },
  { label: "Drivers", to: "/drivers", icon: UserRound, roles: ALL_ROLES },
  { label: "Trips", to: "/trips", icon: Waypoints, roles: ALL_ROLES },
  { label: "Maintenance", to: "/maintenance", icon: Wrench, roles: ALL_ROLES },
  { label: "Fuel Expenses", to: "/fuel-expenses", icon: Fuel, roles: [ROLE_ADMIN, ROLE_MANAGER] },
  { label: "Analytics", to: "/analytics", icon: BarChart3, roles: ALL_ROLES },
  { label: "Settings", to: "/settings", icon: Settings, roles: [ROLE_ADMIN] },
  { label: "Forbidden", to: "/forbidden", icon: ShieldAlert, roles: ALL_ROLES }
];
