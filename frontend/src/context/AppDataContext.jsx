import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import * as driversApi from "../api/drivers";
import * as fuelExpensesApi from "../api/fuelExpenses";
import * as maintenanceApi from "../api/maintenance";
import * as tripsApi from "../api/trips";
import * as vehiclesApi from "../api/vehicles";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refreshAll() {
    setLoading(true);
    try {
      const [vehiclesData, driversData, tripsData, maintenanceData, fuelData, expenseData] = await Promise.all([
        vehiclesApi.getVehicles(),
        driversApi.getDrivers(),
        tripsApi.getTrips(),
        maintenanceApi.getMaintenanceLogs(),
        fuelExpensesApi.getFuelLogs(),
        fuelExpensesApi.getExpenses(),
      ]);
      setVehicles(vehiclesData);
      setDrivers(driversData);
      setTrips(tripsData);
      setMaintenanceLogs(maintenanceData);
      setFuelLogs(fuelData);
      setExpenses(expenseData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshAll();
  }, []);

  const value = useMemo(
    () => ({
      vehicles,
      drivers,
      trips,
      maintenanceLogs,
      fuelLogs,
      expenses,
      loading,
      refreshAll,
      async saveVehicle(payload, currentId) {
        const result = currentId
          ? await vehiclesApi.updateVehicle(currentId, payload)
          : await vehiclesApi.createVehicle(payload);
        toast.success(currentId ? "Vehicle updated." : "Vehicle created.");
        await refreshAll();
        return result;
      },
      async saveDriver(payload, currentId) {
        const result = currentId ? await driversApi.updateDriver(currentId, payload) : await driversApi.createDriver(payload);
        toast.success(currentId ? "Driver updated." : "Driver added.");
        await refreshAll();
        return result;
      },
      async saveTrip(payload) {
        const result = await tripsApi.createTrip(payload);
        toast.success("Trip draft created.");
        await refreshAll();
        return result;
      },
      async dispatchTrip(id) {
        await tripsApi.dispatchTrip(id);
        toast.success("Trip dispatched.");
        await refreshAll();
      },
      async completeTrip(id, payload) {
        await tripsApi.completeTrip(id, payload);
        toast.success("Trip completed.");
        await refreshAll();
      },
      async cancelTrip(id) {
        await tripsApi.cancelTrip(id);
        toast.success("Trip cancelled.");
        await refreshAll();
      },
      async saveMaintenanceLog(payload) {
        await maintenanceApi.createMaintenanceLog(payload);
        toast.success("Maintenance logged.");
        await refreshAll();
      },
      async closeMaintenanceLog(id) {
        await maintenanceApi.closeMaintenanceLog(id);
        toast.success("Maintenance closed.");
        await refreshAll();
      },
      async saveFuelLog(payload) {
        await fuelExpensesApi.createFuelLog(payload);
        toast.success("Fuel log saved.");
        await refreshAll();
      },
      async saveExpense(payload) {
        await fuelExpensesApi.createExpense(payload);
        toast.success("Expense added.");
        await refreshAll();
      },
    }),
    [drivers, expenses, fuelLogs, loading, maintenanceLogs, trips, vehicles],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return context;
}
