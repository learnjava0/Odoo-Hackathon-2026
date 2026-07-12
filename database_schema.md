# TransitOps Database Schema (For Frontend Development)

This document outlines the entities and fields that the Backend will expose via REST APIs. Frontend developers can use this to map their models and forms.

---

## 1. User
Used for Authentication and RBAC.

- `id` (Long, PK)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum): `FLEET_MANAGER`, `DRIVER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST`

---

## 2. Vehicle
Master list of vehicles in the fleet.

- `id` (Long, PK)
- `registrationNumber` (String, Unique)
- `nameModel` (String) - e.g., "Van-05"
- `type` (String) - e.g., "Van", "Truck"
- `maxLoadCapacity` (Double) - Maximum weight in kg.
- `odometer` (Double) - Current distance traveled.
- `acquisitionCost` (BigDecimal) - Cost of purchasing the vehicle.
- `status` (Enum): `AVAILABLE`, `ON_TRIP`, `IN_SHOP`, `RETIRED`

---

## 3. Driver
Driver profiles.

- `id` (Long, PK)
- `name` (String)
- `licenseNumber` (String, Unique)
- `licenseCategory` (String)
- `licenseExpiryDate` (Date - YYYY-MM-DD)
- `contactNumber` (String)
- `safetyScore` (Integer)
- `status` (Enum): `AVAILABLE`, `ON_TRIP`, `OFF_DUTY`, `SUSPENDED`

---

## 4. Trip
Manages dispatch and deliveries.

- `id` (Long, PK)
- `source` (String)
- `destination` (String)
- `vehicleId` (Long, FK to Vehicle)
- `driverId` (Long, FK to Driver)
- `cargoWeight` (Double) - Must be <= Vehicle's maxLoadCapacity
- `plannedDistance` (Double)
- `status` (Enum): `DRAFT`, `DISPATCHED`, `COMPLETED`, `CANCELLED`
- `finalOdometer` (Double, nullable) - Set upon completion.
- `fuelConsumed` (Double, nullable) - Set upon completion.
- `createdAt` (Timestamp)
- `completedAt` (Timestamp, nullable)

---

## 5. MaintenanceLog
Records vehicle maintenance. Adding an active log sets Vehicle to `IN_SHOP`.

- `id` (Long, PK)
- `vehicleId` (Long, FK to Vehicle)
- `description` (String)
- `cost` (BigDecimal)
- `startDate` (Date)
- `endDate` (Date, nullable)
- `active` (Boolean) - True means currently in shop.

---

## 6. FuelLog
Tracks fuel expenses.

- `id` (Long, PK)
- `vehicleId` (Long, FK to Vehicle)
- `liters` (Double)
- `cost` (BigDecimal)
- `logDate` (Date)
- `tripId` (Long, FK to Trip, nullable)

---

## 7. Expense
Tracks other operational expenses (tolls, parking, etc.).

- `id` (Long, PK)
- `vehicleId` (Long, FK to Vehicle)
- `description` (String)
- `amount` (BigDecimal)
- `expenseDate` (Date)
- `tripId` (Long, FK to Trip, nullable)
