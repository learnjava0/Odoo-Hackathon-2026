const now = new Date();
const iso = (daysAgo = 0) => new Date(now.getTime() - daysAgo * 86400000).toISOString();
const date = (daysOffset = 0) => new Date(now.getTime() + daysOffset * 86400000).toISOString().slice(0, 10);

export const mockState = {
  users: [
    { id: 1, email: "maya@transitops.io", role: "FLEET_MANAGER" },
    { id: 2, email: "bruno@transitops.io", role: "DRIVER" },
    { id: 3, email: "serena@transitops.io", role: "SAFETY_OFFICER" },
    { id: 4, email: "omar@transitops.io", role: "FINANCIAL_ANALYST" },
  ],
  vehicles: [
    { id: 1, registrationNumber: "KA-01-TR-1001", nameModel: "Atlas Van 05", type: "Van", maxLoadCapacity: 500, odometer: 24000, acquisitionCost: 32000, status: "AVAILABLE" },
    { id: 2, registrationNumber: "KA-01-TR-1002", nameModel: "Falcon Truck 11", type: "Truck", maxLoadCapacity: 2200, odometer: 56200, acquisitionCost: 74000, status: "ON_TRIP" },
    { id: 3, registrationNumber: "KA-01-TR-1003", nameModel: "Metro Mini 02", type: "Mini Truck", maxLoadCapacity: 800, odometer: 18350, acquisitionCost: 41000, status: "IN_SHOP" },
    { id: 4, registrationNumber: "KA-01-TR-1004", nameModel: "Terra Haul 08", type: "Truck", maxLoadCapacity: 3000, odometer: 88200, acquisitionCost: 92000, status: "AVAILABLE" },
    { id: 5, registrationNumber: "KA-01-TR-1005", nameModel: "City Swift 01", type: "Van", maxLoadCapacity: 650, odometer: 14800, acquisitionCost: 28000, status: "AVAILABLE" },
    { id: 6, registrationNumber: "KA-01-TR-1006", nameModel: "Cargo Lift 03", type: "Truck", maxLoadCapacity: 2500, odometer: 63200, acquisitionCost: 86000, status: "RETIRED" },
    { id: 7, registrationNumber: "KA-01-TR-1007", nameModel: "Night Rover 06", type: "Van", maxLoadCapacity: 700, odometer: 41110, acquisitionCost: 35000, status: "ON_TRIP" },
    { id: 8, registrationNumber: "KA-01-TR-1008", nameModel: "Rapid Transit 04", type: "Mini Truck", maxLoadCapacity: 950, odometer: 27900, acquisitionCost: 45000, status: "AVAILABLE" },
  ],
  drivers: [
    { id: 1, name: "Bruno R", licenseNumber: "DL-9821", licenseCategory: "LMV", licenseExpiryDate: date(45), contactNumber: "+1 212 555 0101", safetyScore: 94, status: "ON_TRIP" },
    { id: 2, name: "Asha N", licenseNumber: "DL-9822", licenseCategory: "HMV", licenseExpiryDate: date(120), contactNumber: "+1 212 555 0102", safetyScore: 91, status: "AVAILABLE" },
    { id: 3, name: "Victor P", licenseNumber: "DL-9823", licenseCategory: "Transport", licenseExpiryDate: date(18), contactNumber: "+1 212 555 0103", safetyScore: 88, status: "AVAILABLE" },
    { id: 4, name: "Nina T", licenseNumber: "DL-9824", licenseCategory: "LMV", licenseExpiryDate: date(-6), contactNumber: "+1 212 555 0104", safetyScore: 72, status: "OFF_DUTY" },
    { id: 5, name: "Leo S", licenseNumber: "DL-9825", licenseCategory: "HMV", licenseExpiryDate: date(78), contactNumber: "+1 212 555 0105", safetyScore: 97, status: "AVAILABLE" },
    { id: 6, name: "Hana M", licenseNumber: "DL-9826", licenseCategory: "Transport", licenseExpiryDate: date(200), contactNumber: "+1 212 555 0106", safetyScore: 86, status: "SUSPENDED" },
    { id: 7, name: "Moe J", licenseNumber: "DL-9827", licenseCategory: "LMV", licenseExpiryDate: date(32), contactNumber: "+1 212 555 0107", safetyScore: 83, status: "AVAILABLE" },
  ],
  trips: [
    { id: 1, source: "Dallas Hub", destination: "Austin DC", vehicleId: 2, driverId: 1, cargoWeight: 1400, plannedDistance: 310, status: "DISPATCHED", finalOdometer: null, fuelConsumed: null, createdAt: iso(1), completedAt: null, revenue: 5200 },
    { id: 2, source: "Phoenix Yard", destination: "Tucson Store", vehicleId: 4, driverId: 2, cargoWeight: 900, plannedDistance: 210, status: "DRAFT", finalOdometer: null, fuelConsumed: null, createdAt: iso(0), completedAt: null, revenue: 3100 },
    { id: 3, source: "Seattle Port", destination: "Tacoma Depot", vehicleId: 5, driverId: 5, cargoWeight: 400, plannedDistance: 84, status: "COMPLETED", finalOdometer: 14910, fuelConsumed: 19, createdAt: iso(10), completedAt: iso(9), revenue: 1800 },
    { id: 4, source: "Denver Hub", destination: "Boulder Clinic", vehicleId: 8, driverId: 7, cargoWeight: 500, plannedDistance: 62, status: "CANCELLED", finalOdometer: null, fuelConsumed: null, createdAt: iso(11), completedAt: null, revenue: 1100 },
    { id: 5, source: "Miami Port", destination: "Orlando Retail", vehicleId: 7, driverId: 3, cargoWeight: 650, plannedDistance: 255, status: "DISPATCHED", finalOdometer: null, fuelConsumed: null, createdAt: iso(2), completedAt: null, revenue: 4200 },
    { id: 6, source: "Chicago Hub", destination: "Naperville Node", vehicleId: 1, driverId: 2, cargoWeight: 450, plannedDistance: 71, status: "COMPLETED", finalOdometer: 23910, fuelConsumed: 12, createdAt: iso(20), completedAt: iso(19), revenue: 1650 },
    { id: 7, source: "Portland DC", destination: "Salem Crossdock", vehicleId: 8, driverId: 7, cargoWeight: 530, plannedDistance: 96, status: "DRAFT", finalOdometer: null, fuelConsumed: null, createdAt: iso(4), completedAt: null, revenue: 1900 },
    { id: 8, source: "Atlanta Hub", destination: "Savannah Lane", vehicleId: 4, driverId: 5, cargoWeight: 1200, plannedDistance: 402, status: "COMPLETED", finalOdometer: 87920, fuelConsumed: 44, createdAt: iso(27), completedAt: iso(26), revenue: 6900 },
    { id: 9, source: "San Jose Depot", destination: "Fresno Yard", vehicleId: 5, driverId: 3, cargoWeight: 510, plannedDistance: 185, status: "COMPLETED", finalOdometer: 14580, fuelConsumed: 24, createdAt: iso(17), completedAt: iso(16), revenue: 3050 },
    { id: 10, source: "Raleigh Hub", destination: "Durham Lab", vehicleId: 1, driverId: 7, cargoWeight: 380, plannedDistance: 44, status: "CANCELLED", finalOdometer: null, fuelConsumed: null, createdAt: iso(13), completedAt: null, revenue: 900 },
    { id: 11, source: "Boston Port", destination: "Worcester Med", vehicleId: 4, driverId: 2, cargoWeight: 980, plannedDistance: 70, status: "COMPLETED", finalOdometer: 87430, fuelConsumed: 14, createdAt: iso(6), completedAt: iso(5), revenue: 2600 },
    { id: 12, source: "Detroit Yard", destination: "Lansing Plant", vehicleId: 8, driverId: 5, cargoWeight: 780, plannedDistance: 132, status: "DRAFT", finalOdometer: null, fuelConsumed: null, createdAt: iso(1), completedAt: null, revenue: 2200 },
    { id: 13, source: "Houston Hub", destination: "Galveston Crossdock", vehicleId: 5, driverId: 3, cargoWeight: 420, plannedDistance: 118, status: "COMPLETED", finalOdometer: 14320, fuelConsumed: 17, createdAt: iso(33), completedAt: iso(32), revenue: 2400 },
    { id: 14, source: "Nashville Depot", destination: "Memphis Yard", vehicleId: 4, driverId: 5, cargoWeight: 1500, plannedDistance: 346, status: "COMPLETED", finalOdometer: 86100, fuelConsumed: 39, createdAt: iso(39), completedAt: iso(38), revenue: 6100 },
    { id: 15, source: "LA West", destination: "San Diego South", vehicleId: 1, driverId: 7, cargoWeight: 300, plannedDistance: 198, status: "COMPLETED", finalOdometer: 23700, fuelConsumed: 22, createdAt: iso(24), completedAt: iso(23), revenue: 3300 },
  ],
  maintenanceLogs: [
    { id: 1, vehicleId: 3, description: "Brake line inspection and rotor swap", cost: 1800, startDate: date(-3), endDate: null, active: true },
    { id: 2, vehicleId: 4, description: "Quarterly preventive maintenance", cost: 950, startDate: date(-18), endDate: date(-17), active: false },
    { id: 3, vehicleId: 6, description: "Engine rebuild before retirement", cost: 5600, startDate: date(-60), endDate: date(-54), active: false },
  ],
  fuelLogs: [
    { id: 1, vehicleId: 1, liters: 12, cost: 58, logDate: date(-19), tripId: 6 },
    { id: 2, vehicleId: 4, liters: 44, cost: 214, logDate: date(-26), tripId: 8 },
    { id: 3, vehicleId: 5, liters: 24, cost: 114, logDate: date(-16), tripId: 9 },
    { id: 4, vehicleId: 4, liters: 14, cost: 69, logDate: date(-5), tripId: 11 },
    { id: 5, vehicleId: 1, liters: 22, cost: 103, logDate: date(-23), tripId: 15 },
  ],
  expenses: [
    { id: 1, vehicleId: 4, description: "Highway toll pass", amount: 42, expenseDate: date(-26), tripId: 8 },
    { id: 2, vehicleId: 1, description: "Parking and unloading", amount: 26, expenseDate: date(-19), tripId: 6 },
    { id: 3, vehicleId: 3, description: "Hydraulic parts", amount: 310, expenseDate: date(-2), tripId: null },
    { id: 4, vehicleId: 5, description: "Wash and sanitation", amount: 55, expenseDate: date(-12), tripId: null },
  ],
};
