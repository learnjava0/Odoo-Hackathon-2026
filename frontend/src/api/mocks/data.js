const now = new Date();
const iso = (daysAgo = 0) => new Date(now.getTime() - daysAgo * 86400000).toISOString();
const date = (daysOffset = 0) => new Date(now.getTime() + daysOffset * 86400000).toISOString().slice(0, 10);

export const mockState = {
  users: [
    { id: 1, email: "ravi.kumar@transitops.in", role: "FLEET_MANAGER" },
    { id: 2, email: "ajay.singh@transitops.in", role: "DRIVER" },
    { id: 3, email: "priya.nair@transitops.in", role: "SAFETY_OFFICER" },
    { id: 4, email: "deepa.shah@transitops.in", role: "FINANCIAL_ANALYST" },
  ],

  vehicles: [
    { id: 1,  registrationNumber: "KA-01-AB-1001", nameModel: "Tata Ace Gold",      type: "Mini Truck",  maxLoadCapacity: 750,  odometer: 31200,  acquisitionCost: 680000,  status: "AVAILABLE" },
    { id: 2,  registrationNumber: "KA-01-AB-1002", nameModel: "Ashok Leyland 2518", type: "Truck",        maxLoadCapacity: 9000, odometer: 142600, acquisitionCost: 2800000, status: "ON_TRIP" },
    { id: 3,  registrationNumber: "KA-01-AB-1003", nameModel: "Mahindra Bolero Pik", type: "Pickup",      maxLoadCapacity: 1000, odometer: 54800,  acquisitionCost: 920000,  status: "IN_SHOP" },
    { id: 4,  registrationNumber: "KA-01-AB-1004", nameModel: "Eicher Pro 2049",    type: "Truck",        maxLoadCapacity: 5000, odometer: 88400,  acquisitionCost: 1650000, status: "AVAILABLE" },
    { id: 5,  registrationNumber: "KA-01-AB-1005", nameModel: "Tata 407 SFC",       type: "Mini Truck",  maxLoadCapacity: 2200, odometer: 61300,  acquisitionCost: 850000,  status: "AVAILABLE" },
    { id: 6,  registrationNumber: "MH-12-CD-2201", nameModel: "BharatBenz 1015R",   type: "Truck",        maxLoadCapacity: 6000, odometer: 204000, acquisitionCost: 2200000, status: "RETIRED" },
    { id: 7,  registrationNumber: "MH-12-CD-2202", nameModel: "Force Traveller 3700", type: "Van",         maxLoadCapacity: 1200, odometer: 39700,  acquisitionCost: 1150000, status: "ON_TRIP" },
    { id: 8,  registrationNumber: "MH-12-CD-2203", nameModel: "Tata LPT 1109",      type: "Truck",        maxLoadCapacity: 6500, odometer: 112900, acquisitionCost: 1900000, status: "AVAILABLE" },
    { id: 9,  registrationNumber: "DL-01-EF-3301", nameModel: "Mahindra Supro Van", type: "Van",          maxLoadCapacity: 700,  odometer: 22400,  acquisitionCost: 740000,  status: "AVAILABLE" },
    { id: 10, registrationNumber: "DL-01-EF-3302", nameModel: "Ashok Leyland Dost+", type: "Mini Truck", maxLoadCapacity: 1500, odometer: 47200,  acquisitionCost: 990000,  status: "IN_SHOP" },
    { id: 11, registrationNumber: "TN-09-GH-4401", nameModel: "Tata Intra V30",     type: "Pickup",       maxLoadCapacity: 1200, odometer: 18600,  acquisitionCost: 870000,  status: "AVAILABLE" },
    { id: 12, registrationNumber: "TN-09-GH-4402", nameModel: "Eicher Pro 3015",    type: "Truck",        maxLoadCapacity: 7000, odometer: 93200,  acquisitionCost: 2100000, status: "AVAILABLE" },
  ],

  drivers: [
    { id: 1, name: "Ajay Singh",    licenseNumber: "KA-0119980012345", licenseCategory: "HMV", licenseExpiryDate: date(180), contactNumber: "9880011234", safetyScore: 94, status: "ON_TRIP" },
    { id: 2, name: "Ramesh Yadav",  licenseNumber: "KA-0120010056789", licenseCategory: "LMV", licenseExpiryDate: date(240), contactNumber: "9880022345", safetyScore: 88, status: "AVAILABLE" },
    { id: 3, name: "Suresh Patil",  licenseNumber: "MH-1420030098765", licenseCategory: "HMV", licenseExpiryDate: date(22),  contactNumber: "9765033456", safetyScore: 91, status: "AVAILABLE" },
    { id: 4, name: "Kavitha Devi",  licenseNumber: "DL-0420021143210", licenseCategory: "LMV", licenseExpiryDate: date(-8),  contactNumber: "9654044567", safetyScore: 76, status: "OFF_DUTY" },
    { id: 5, name: "Mohammed Irfan",licenseNumber: "TN-0920001254321", licenseCategory: "HMV", licenseExpiryDate: date(95),  contactNumber: "9543055678", safetyScore: 97, status: "AVAILABLE" },
    { id: 6, name: "Pradeep Kumar", licenseNumber: "KA-0320191365432", licenseCategory: "Transport", licenseExpiryDate: date(310), contactNumber: "9432066789", safetyScore: 85, status: "SUSPENDED" },
    { id: 7, name: "Anita Sharma",  licenseNumber: "MH-0220051476543", licenseCategory: "LMV", licenseExpiryDate: date(65),  contactNumber: "9321077890", safetyScore: 82, status: "AVAILABLE" },
    { id: 8, name: "Vijay Nair",    licenseNumber: "TN-0120031587654", licenseCategory: "HMV", licenseExpiryDate: date(420), contactNumber: "9210088901", safetyScore: 93, status: "ON_TRIP" },
    { id: 9, name: "Sanjay Mehta",  licenseNumber: "DL-0620021698765", licenseCategory: "Transport", licenseExpiryDate: date(155), contactNumber: "9109099012", safetyScore: 89, status: "AVAILABLE" },
    { id: 10, name: "Lakshmi Bai",  licenseNumber: "KA-0820031709876", licenseCategory: "LMV", licenseExpiryDate: date(50),  contactNumber: "9001100123", safetyScore: 78, status: "AVAILABLE" },
  ],

  trips: [
    // Active / recent
    { id: 1,  source: "Bengaluru Hub",      destination: "Mysuru Depot",       vehicleId: 2,  driverId: 1,  cargoWeight: 4200, plannedDistance: 148, status: "DISPATCHED", finalOdometer: null,   fuelConsumed: null, createdAt: iso(1),  completedAt: null,    revenue: 18400 },
    { id: 2,  source: "Pune Yard",          destination: "Nashik Warehouse",   vehicleId: 4,  driverId: 3,  cargoWeight: 2800, plannedDistance: 212, status: "DRAFT",      finalOdometer: null,   fuelConsumed: null, createdAt: iso(0),  completedAt: null,    revenue: 11200 },
    { id: 3,  source: "Mumbai Port",        destination: "Surat Crossdock",    vehicleId: 7,  driverId: 8,  cargoWeight: 900,  plannedDistance: 280, status: "DISPATCHED", finalOdometer: null,   fuelConsumed: null, createdAt: iso(2),  completedAt: null,    revenue: 14600 },
    { id: 4,  source: "Delhi NCR Hub",      destination: "Agra Depot",         vehicleId: 8,  driverId: 9,  cargoWeight: 5100, plannedDistance: 234, status: "DRAFT",      finalOdometer: null,   fuelConsumed: null, createdAt: iso(0),  completedAt: null,    revenue: 19800 },
    { id: 5,  source: "Chennai Port",       destination: "Coimbatore Plant",   vehicleId: 12, driverId: 5,  cargoWeight: 3400, plannedDistance: 498, status: "DRAFT",      finalOdometer: null,   fuelConsumed: null, createdAt: iso(1),  completedAt: null,    revenue: 26400 },
    // Completed
    { id: 6,  source: "Hyderabad Hub",      destination: "Vijayawada DC",      vehicleId: 4,  driverId: 2,  cargoWeight: 3200, plannedDistance: 274, status: "COMPLETED", finalOdometer: 88820,  fuelConsumed: 58, createdAt: iso(14), completedAt: iso(13), revenue: 22000 },
    { id: 7,  source: "Ahmedabad Depot",    destination: "Rajkot Node",        vehicleId: 5,  driverId: 3,  cargoWeight: 1800, plannedDistance: 218, status: "COMPLETED", finalOdometer: 61620,  fuelConsumed: 41, createdAt: iso(12), completedAt: iso(11), revenue: 13800 },
    { id: 8,  source: "Bengaluru Hub",      destination: "Hubli Crossdock",    vehicleId: 1,  driverId: 7,  cargoWeight: 620,  plannedDistance: 420, status: "COMPLETED", finalOdometer: 31820,  fuelConsumed: 38, createdAt: iso(20), completedAt: iso(19), revenue: 12400 },
    { id: 9,  source: "Mumbai Port",        destination: "Pune Yard",          vehicleId: 8,  driverId: 9,  cargoWeight: 5800, plannedDistance: 148, status: "COMPLETED", finalOdometer: 113210, fuelConsumed: 32, createdAt: iso(9),  completedAt: iso(8),  revenue: 17500 },
    { id: 10, source: "Delhi NCR Hub",      destination: "Jaipur Depot",       vehicleId: 9,  driverId: 10, cargoWeight: 550,  plannedDistance: 282, status: "COMPLETED", finalOdometer: 22810,  fuelConsumed: 28, createdAt: iso(18), completedAt: iso(17), revenue: 11000 },
    { id: 11, source: "Chennai Port",       destination: "Madurai DC",         vehicleId: 12, driverId: 5,  cargoWeight: 4600, plannedDistance: 460, status: "COMPLETED", finalOdometer: 93730,  fuelConsumed: 72, createdAt: iso(28), completedAt: iso(27), revenue: 32200 },
    { id: 12, source: "Pune Yard",          destination: "Kolhapur Node",      vehicleId: 4,  driverId: 2,  cargoWeight: 2200, plannedDistance: 226, status: "COMPLETED", finalOdometer: 88200,  fuelConsumed: 46, createdAt: iso(35), completedAt: iso(34), revenue: 16800 },
    { id: 13, source: "Hyderabad Hub",      destination: "Bengaluru Hub",      vehicleId: 5,  driverId: 7,  cargoWeight: 1600, plannedDistance: 560, status: "COMPLETED", finalOdometer: 61050,  fuelConsumed: 65, createdAt: iso(42), completedAt: iso(41), revenue: 28000 },
    { id: 14, source: "Ahmedabad Depot",    destination: "Surat Crossdock",    vehicleId: 1,  driverId: 3,  cargoWeight: 680,  plannedDistance: 266, status: "COMPLETED", finalOdometer: 30780,  fuelConsumed: 30, createdAt: iso(50), completedAt: iso(49), revenue: 10800 },
    { id: 15, source: "Delhi NCR Hub",      destination: "Lucknow Depot",      vehicleId: 8,  driverId: 9,  cargoWeight: 4900, plannedDistance: 558, status: "COMPLETED", finalOdometer: 112720, fuelConsumed: 88, createdAt: iso(38), completedAt: iso(37), revenue: 42200 },
    // Cancelled
    { id: 16, source: "Bengaluru Hub",      destination: "Mangaluru DC",       vehicleId: 11, driverId: 2,  cargoWeight: 850,  plannedDistance: 352, status: "CANCELLED", finalOdometer: null,   fuelConsumed: null, createdAt: iso(7),  completedAt: null,    revenue: 14400 },
    { id: 17, source: "Mumbai Port",        destination: "Aurangabad Plant",   vehicleId: 9,  driverId: 10, cargoWeight: 600,  plannedDistance: 336, status: "CANCELLED", finalOdometer: null,   fuelConsumed: null, createdAt: iso(15), completedAt: null,    revenue: 13200 },
  ],

  maintenanceLogs: [
    { id: 1, vehicleId: 3,  description: "Brake pad replacement & wheel alignment", cost: 8400,  startDate: date(-4),  endDate: null,        active: true },
    { id: 2, vehicleId: 10, description: "Engine oil flush and filter change",       cost: 3200,  startDate: date(-2),  endDate: null,        active: true },
    { id: 3, vehicleId: 4,  description: "Quarterly preventive maintenance",         cost: 6500,  startDate: date(-30), endDate: date(-28),   active: false },
    { id: 4, vehicleId: 2,  description: "Tyre replacement (all 6 tyres)",           cost: 42000, startDate: date(-60), endDate: date(-56),   active: false },
    { id: 5, vehicleId: 6,  description: "Engine overhaul before retirement",        cost: 85000, startDate: date(-90), endDate: date(-82),   active: false },
    { id: 6, vehicleId: 8,  description: "Suspension repair and greasing",           cost: 11200, startDate: date(-22), endDate: date(-20),   active: false },
    { id: 7, vehicleId: 1,  description: "AC service and battery replacement",       cost: 5800,  startDate: date(-45), endDate: date(-44),   active: false },
    { id: 8, vehicleId: 5,  description: "Clutch plate replacement",                 cost: 14500, startDate: date(-15), endDate: date(-13),   active: false },
  ],

  fuelLogs: [
    { id: 1,  vehicleId: 2,  liters: 58, cost: 6148,  logDate: date(-13), tripId: 6  },
    { id: 2,  vehicleId: 5,  liters: 41, cost: 4346,  logDate: date(-11), tripId: 7  },
    { id: 3,  vehicleId: 1,  liters: 38, cost: 4028,  logDate: date(-19), tripId: 8  },
    { id: 4,  vehicleId: 8,  liters: 32, cost: 3392,  logDate: date(-8),  tripId: 9  },
    { id: 5,  vehicleId: 9,  liters: 28, cost: 2968,  logDate: date(-17), tripId: 10 },
    { id: 6,  vehicleId: 12, liters: 72, cost: 7632,  logDate: date(-27), tripId: 11 },
    { id: 7,  vehicleId: 4,  liters: 46, cost: 4876,  logDate: date(-34), tripId: 12 },
    { id: 8,  vehicleId: 5,  liters: 65, cost: 6890,  logDate: date(-41), tripId: 13 },
    { id: 9,  vehicleId: 1,  liters: 30, cost: 3180,  logDate: date(-49), tripId: 14 },
    { id: 10, vehicleId: 8,  liters: 88, cost: 9328,  logDate: date(-37), tripId: 15 },
    { id: 11, vehicleId: 2,  liters: 44, cost: 4664,  logDate: date(-55), tripId: null },
    { id: 12, vehicleId: 7,  liters: 36, cost: 3816,  logDate: date(-25), tripId: null },
    { id: 13, vehicleId: 4,  liters: 52, cost: 5512,  logDate: date(-68), tripId: null },
    { id: 14, vehicleId: 12, liters: 60, cost: 6360,  logDate: date(-72), tripId: null },
    { id: 15, vehicleId: 9,  liters: 24, cost: 2544,  logDate: date(-80), tripId: null },
  ],

  expenses: [
    { id: 1,  vehicleId: 2,  description: "NH-48 toll charges",             amount: 840,   expenseDate: date(-13), tripId: 6  },
    { id: 2,  vehicleId: 5,  description: "State highway toll",             amount: 560,   expenseDate: date(-11), tripId: 7  },
    { id: 3,  vehicleId: 8,  description: "Mumbai-Pune expressway toll",    amount: 1260,  expenseDate: date(-8),  tripId: 9  },
    { id: 4,  vehicleId: 12, description: "Loading/unloading charges",      amount: 2400,  expenseDate: date(-27), tripId: 11 },
    { id: 5,  vehicleId: 3,  description: "Hydraulic lift parts",           amount: 4200,  expenseDate: date(-3),  tripId: null },
    { id: 6,  vehicleId: 1,  description: "Driver allowance - Hubli trip",  amount: 1800,  expenseDate: date(-19), tripId: 8  },
    { id: 7,  vehicleId: 4,  description: "Overnight parking Kolhapur",     amount: 350,   expenseDate: date(-34), tripId: 12 },
    { id: 8,  vehicleId: 9,  description: "Wash and sanitization",          amount: 600,   expenseDate: date(-10), tripId: null },
    { id: 9,  vehicleId: 5,  description: "Entry permit - Gujarat",         amount: 2100,  expenseDate: date(-41), tripId: 13 },
    { id: 10, vehicleId: 8,  description: "Overloading fine waiver docs",   amount: 3500,  expenseDate: date(-37), tripId: 15 },
    { id: 11, vehicleId: 7,  description: "Driver food allowance",          amount: 950,   expenseDate: date(-2),  tripId: null },
    { id: 12, vehicleId: 11, description: "Tyre puncture repair",           amount: 480,   expenseDate: date(-6),  tripId: null },
  ],
};
