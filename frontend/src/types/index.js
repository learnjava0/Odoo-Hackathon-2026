/**
 * @typedef {"FLEET_MANAGER" | "DRIVER" | "SAFETY_OFFICER" | "FINANCIAL_ANALYST"} Role
 * @typedef {"AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED"} VehicleStatus
 * @typedef {"AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED"} DriverStatus
 * @typedef {"DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED"} TripStatus
 *
 * @typedef {Object} User
 * @property {number} id
 * @property {string} email
 * @property {Role} role
 *
 * @typedef {Object} Vehicle
 * @property {number} id
 * @property {string} registrationNumber
 * @property {string} nameModel
 * @property {string} type
 * @property {number} maxLoadCapacity
 * @property {number} odometer
 * @property {number} acquisitionCost
 * @property {VehicleStatus} status
 *
 * @typedef {Object} Driver
 * @property {number} id
 * @property {string} name
 * @property {string} licenseNumber
 * @property {string} licenseCategory
 * @property {string} licenseExpiryDate
 * @property {string} contactNumber
 * @property {number} safetyScore
 * @property {DriverStatus} status
 *
 * @typedef {Object} Trip
 * @property {number} id
 * @property {string} source
 * @property {string} destination
 * @property {number} vehicleId
 * @property {number} driverId
 * @property {number} cargoWeight
 * @property {number} plannedDistance
 * @property {TripStatus} status
 * @property {number | null} finalOdometer
 * @property {number | null} fuelConsumed
 * @property {string} createdAt
 * @property {string | null} completedAt
 * @property {number | undefined} revenue
 *
 * @typedef {Object} MaintenanceLog
 * @property {number} id
 * @property {number} vehicleId
 * @property {string} description
 * @property {number} cost
 * @property {string} startDate
 * @property {string | null} endDate
 * @property {boolean} active
 *
 * @typedef {Object} FuelLog
 * @property {number} id
 * @property {number} vehicleId
 * @property {number} liters
 * @property {number} cost
 * @property {string} logDate
 * @property {number | null} tripId
 *
 * @typedef {Object} Expense
 * @property {number} id
 * @property {number} vehicleId
 * @property {string} description
 * @property {number} amount
 * @property {string} expenseDate
 * @property {number | null} tripId
 */

export {};
