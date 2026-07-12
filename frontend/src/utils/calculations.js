export function getOperationalCost(vehicleId, fuelLogs, maintenanceLogs, expenses) {
  const fuel = fuelLogs.filter((item) => item.vehicleId === vehicleId).reduce((sum, item) => sum + item.cost, 0);
  const maintenance = maintenanceLogs
    .filter((item) => item.vehicleId === vehicleId)
    .reduce((sum, item) => sum + item.cost, 0);
  const other = expenses.filter((item) => item.vehicleId === vehicleId).reduce((sum, item) => sum + item.amount, 0);
  return { fuel, maintenance, other, total: fuel + maintenance + other };
}

export function getVehicleRevenue(vehicleId, trips) {
  return trips
    .filter((trip) => trip.vehicleId === vehicleId && trip.status === "COMPLETED")
    .reduce((sum, trip) => sum + (trip.revenue ?? trip.plannedDistance * 8), 0);
}

export function getFuelEfficiencyForVehicle(vehicleId, trips) {
  const completed = trips.filter((trip) => trip.vehicleId === vehicleId && trip.status === "COMPLETED");
  const distance = completed.reduce((sum, trip) => sum + trip.plannedDistance, 0);
  const liters = completed.reduce((sum, trip) => sum + (trip.fuelConsumed ?? 0), 0);
  return liters ? distance / liters : 0;
}

export function getFleetUtilization(vehicles, trips) {
  if (!vehicles.length) return 0;
  const activeTrips = trips.filter((trip) => trip.status === "DISPATCHED").length;
  return (activeTrips / vehicles.length) * 100;
}

export function getVehicleRoi(vehicle, trips, fuelLogs, maintenanceLogs) {
  const revenue = getVehicleRevenue(vehicle.id, trips);
  const fuel = fuelLogs.filter((item) => item.vehicleId === vehicle.id).reduce((sum, item) => sum + item.cost, 0);
  const maintenance = maintenanceLogs
    .filter((item) => item.vehicleId === vehicle.id)
    .reduce((sum, item) => sum + item.cost, 0);
  return vehicle.acquisitionCost ? ((revenue - (maintenance + fuel)) / vehicle.acquisitionCost) * 100 : 0;
}

export function currency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export const formatCurrency = currency;

export function number(value, digits = 0) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value ?? 0);
}
