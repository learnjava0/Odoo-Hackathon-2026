import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getDrivers } from "../api/drivers";
import { getFuelExpenses } from "../api/fuelExpenses";
import { getMaintenanceJobs } from "../api/maintenance";
import { getTrips } from "../api/trips";
import { getVehicles } from "../api/vehicles";

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [state, setState] = useState({
    vehicles: [],
    drivers: [],
    trips: [],
    maintenance: [],
    fuelExpenses: [],
    isLoading: true
  });

  useEffect(() => {
    async function load() {
      const [vehicles, drivers, trips, maintenance, fuelExpenses] = await Promise.all([
        getVehicles(),
        getDrivers(),
        getTrips(),
        getMaintenanceJobs(),
        getFuelExpenses()
      ]);

      setState({
        vehicles: vehicles.data,
        drivers: drivers.data,
        trips: trips.data,
        maintenance: maintenance.data,
        fuelExpenses: fuelExpenses.data,
        isLoading: false
      });
    }

    load();
  }, []);

  const value = useMemo(
    () => ({
      ...state
    }),
    [state]
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
