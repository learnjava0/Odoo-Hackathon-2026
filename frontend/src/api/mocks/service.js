import { isExpired } from "../../utils/dateHelpers";
import { mockState } from "./data";

const wait = (data, delay = 180) => new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), delay));

function nextId(collection) {
  return Math.max(0, ...collection.map((item) => item.id)) + 1;
}

function findVehicle(id) {
  return mockState.vehicles.find((vehicle) => vehicle.id === Number(id));
}

function findDriver(id) {
  return mockState.drivers.find((driver) => driver.id === Number(id));
}

function syncAvailabilityFromTripsAndMaintenance() {
  mockState.vehicles.forEach((vehicle) => {
    if (vehicle.status === "RETIRED") return;
    const onTrip = mockState.trips.some((trip) => trip.vehicleId === vehicle.id && trip.status === "DISPATCHED");
    const inShop = mockState.maintenanceLogs.some((log) => log.vehicleId === vehicle.id && log.active);
    vehicle.status = inShop ? "IN_SHOP" : onTrip ? "ON_TRIP" : "AVAILABLE";
  });

  mockState.drivers.forEach((driver) => {
    if (driver.status === "SUSPENDED") return;
    const onTrip = mockState.trips.some((trip) => trip.driverId === driver.id && trip.status === "DISPATCHED");
    driver.status = onTrip ? "ON_TRIP" : driver.status === "OFF_DUTY" ? "OFF_DUTY" : "AVAILABLE";
  });
}

export const mockApi = {
  async login({ email, role }) {
    // Find user by email OR by role (for demo accounts)
    let user = mockState.users.find((item) => item.email === email);
    if (!user && role) {
      user = mockState.users.find((item) => item.role === role);
    }
    user = user ?? mockState.users[0];
    return wait({ token: `mock-token-${user.id}`, user });
  },
  async getVehicles() {
    syncAvailabilityFromTripsAndMaintenance();
    return wait(mockState.vehicles);
  },
  async getVehicle(id) {
    return wait(findVehicle(id));
  },
  async createVehicle(payload) {
    const duplicate = mockState.vehicles.find(
      (vehicle) => vehicle.registrationNumber.toLowerCase() === payload.registrationNumber.toLowerCase(),
    );
    if (duplicate) {
      const error = new Error("Registration number must be unique.");
      error.status = 409;
      error.field = "registrationNumber";
      throw error;
    }
    const vehicle = { id: nextId(mockState.vehicles), ...payload };
    mockState.vehicles.unshift(vehicle);
    return wait(vehicle);
  },
  async updateVehicle(id, payload) {
    const index = mockState.vehicles.findIndex((vehicle) => vehicle.id === Number(id));
    const duplicate = mockState.vehicles.find(
      (vehicle) =>
        vehicle.id !== Number(id) &&
        vehicle.registrationNumber.toLowerCase() === payload.registrationNumber.toLowerCase(),
    );
    if (duplicate) {
      const error = new Error("Registration number must be unique.");
      error.status = 409;
      error.field = "registrationNumber";
      throw error;
    }
    mockState.vehicles[index] = { ...mockState.vehicles[index], ...payload };
    return wait(mockState.vehicles[index]);
  },
  async getDrivers() {
    syncAvailabilityFromTripsAndMaintenance();
    return wait(mockState.drivers);
  },
  async getDriver(id) {
    return wait(findDriver(id));
  },
  async createDriver(payload) {
    const driver = { id: nextId(mockState.drivers), ...payload };
    mockState.drivers.unshift(driver);
    return wait(driver);
  },
  async updateDriver(id, payload) {
    const index = mockState.drivers.findIndex((driver) => driver.id === Number(id));
    mockState.drivers[index] = { ...mockState.drivers[index], ...payload };
    return wait(mockState.drivers[index]);
  },
  async getTrips() {
    syncAvailabilityFromTripsAndMaintenance();
    return wait(mockState.trips);
  },
  async getTrip(id) {
    return wait(mockState.trips.find((trip) => trip.id === Number(id)));
  },
  async createTrip(payload) {
    const vehicle = findVehicle(payload.vehicleId);
    const driver = findDriver(payload.driverId);
    if (!vehicle || !driver) throw new Error("Vehicle and driver are required.");
    if (["IN_SHOP", "RETIRED", "ON_TRIP"].includes(vehicle.status)) throw new Error("Vehicle unavailable.");
    if (["ON_TRIP", "SUSPENDED"].includes(driver.status) || isExpired(driver.licenseExpiryDate)) {
      throw new Error("Driver unavailable.");
    }
    const trip = {
      id: nextId(mockState.trips),
      ...payload,
      status: "DRAFT",
      finalOdometer: null,
      fuelConsumed: null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      revenue: payload.plannedDistance * 8,
    };
    mockState.trips.unshift(trip);
    syncAvailabilityFromTripsAndMaintenance();
    return wait(trip);
  },
  async dispatchTrip(id) {
    const trip = mockState.trips.find((item) => item.id === Number(id));
    trip.status = "DISPATCHED";
    const vehicle = findVehicle(trip.vehicleId);
    const driver = findDriver(trip.driverId);
    vehicle.status = "ON_TRIP";
    driver.status = "ON_TRIP";
    return wait(trip);
  },
  async completeTrip(id, payload) {
    const trip = mockState.trips.find((item) => item.id === Number(id));
    trip.status = "COMPLETED";
    trip.finalOdometer = payload.finalOdometer;
    trip.fuelConsumed = payload.fuelConsumed;
    trip.completedAt = new Date().toISOString();
    const vehicle = findVehicle(trip.vehicleId);
    const driver = findDriver(trip.driverId);
    if (vehicle.status !== "RETIRED") {
      vehicle.status = "AVAILABLE";
    }
    if (driver.status !== "SUSPENDED") {
      driver.status = "AVAILABLE";
    }
    mockState.fuelLogs.unshift({
      id: nextId(mockState.fuelLogs),
      vehicleId: trip.vehicleId,
      liters: payload.fuelConsumed,
      cost: payload.fuelConsumed * 4.8,
      logDate: new Date().toISOString().slice(0, 10),
      tripId: trip.id,
    });
    return wait(trip);
  },
  async cancelTrip(id) {
    const trip = mockState.trips.find((item) => item.id === Number(id));
    const wasDispatched = trip.status === "DISPATCHED";
    trip.status = "CANCELLED";
    if (wasDispatched) {
      const vehicle = findVehicle(trip.vehicleId);
      const driver = findDriver(trip.driverId);
      if (vehicle.status !== "RETIRED") vehicle.status = "AVAILABLE";
      if (driver.status !== "SUSPENDED") driver.status = "AVAILABLE";
    }
    return wait(trip);
  },
  async getMaintenanceLogs() {
    syncAvailabilityFromTripsAndMaintenance();
    return wait(mockState.maintenanceLogs);
  },
  async createMaintenanceLog(payload) {
    const log = { id: nextId(mockState.maintenanceLogs), ...payload, endDate: null, active: true };
    mockState.maintenanceLogs.unshift(log);
    const vehicle = findVehicle(payload.vehicleId);
    if (vehicle.status !== "RETIRED") vehicle.status = "IN_SHOP";
    return wait(log);
  },
  async closeMaintenanceLog(id) {
    const log = mockState.maintenanceLogs.find((item) => item.id === Number(id));
    log.active = false;
    log.endDate = new Date().toISOString().slice(0, 10);
    const vehicle = findVehicle(log.vehicleId);
    if (vehicle.status !== "RETIRED") vehicle.status = "AVAILABLE";
    return wait(log);
  },
  async getFuelLogs() {
    return wait(mockState.fuelLogs);
  },
  async createFuelLog(payload) {
    const log = { id: nextId(mockState.fuelLogs), ...payload };
    mockState.fuelLogs.unshift(log);
    return wait(log);
  },
  async getExpenses() {
    return wait(mockState.expenses);
  },
  async createExpense(payload) {
    const expense = { id: nextId(mockState.expenses), ...payload };
    mockState.expenses.unshift(expense);
    return wait(expense);
  },
};
