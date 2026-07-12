import { ROLE_ADMIN, ROLE_DISPATCHER, ROLE_MANAGER } from "../../constants/roles";

export const mockUsers = [
  { id: "u1", name: "Alex Morgan", email: "admin@transitops.dev", role: ROLE_ADMIN },
  { id: "u2", name: "Jordan Lee", email: "manager@transitops.dev", role: ROLE_MANAGER },
  { id: "u3", name: "Sam Rivera", email: "dispatch@transitops.dev", role: ROLE_DISPATCHER }
];

export const mockVehicles = [
  { id: "veh-101", name: "City Hopper 12", status: "Active", type: "Bus", utilization: 88 },
  { id: "veh-102", name: "North Shuttle 4", status: "Maintenance", type: "Van", utilization: 57 },
  { id: "veh-103", name: "Metro Link 21", status: "Active", type: "Bus", utilization: 92 }
];

export const mockDrivers = [
  { id: "drv-1", name: "Priya Sharma", status: "On duty", tripsThisWeek: 14 },
  { id: "drv-2", name: "Arjun Patel", status: "Rest day", tripsThisWeek: 9 },
  { id: "drv-3", name: "Neha Rao", status: "On duty", tripsThisWeek: 12 }
];

export const mockTrips = [
  { id: "trip-1", route: "Airport Loop", date: "2026-07-10", completionRate: 96, status: "Completed" },
  { id: "trip-2", route: "Downtown Express", date: "2026-07-11", completionRate: 91, status: "Completed" },
  { id: "trip-3", route: "Night Connector", date: "2026-07-12", completionRate: 85, status: "In progress" }
];

export const mockMaintenanceJobs = [
  { id: "mnt-1", vehicle: "North Shuttle 4", dueDate: "2026-07-16", priority: "High", status: "Scheduled" },
  { id: "mnt-2", vehicle: "City Hopper 12", dueDate: "2026-07-22", priority: "Medium", status: "Pending parts" }
];

export const mockFuelExpenses = [
  { id: "fuel-1", vehicle: "City Hopper 12", amount: 420, liters: 118, date: "2026-07-03" },
  { id: "fuel-2", vehicle: "Metro Link 21", amount: 510, liters: 135, date: "2026-07-08" },
  { id: "fuel-3", vehicle: "North Shuttle 4", amount: 265, liters: 74, date: "2026-07-09" }
];
