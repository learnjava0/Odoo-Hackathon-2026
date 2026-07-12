import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { AppDataProvider } from "./context/AppDataContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AnalyticsPage from "./pages/AnalyticsPage";
import DashboardPage from "./pages/DashboardPage";
import DriversPage from "./pages/DriversPage";
import FleetPage from "./pages/FleetPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import FuelExpensesPage from "./pages/FuelExpensesPage";
import LoginPage from "./pages/LoginPage";
import MaintenancePage from "./pages/MaintenancePage";
import SettingsPage from "./pages/SettingsPage";
import TripsPage from "./pages/TripsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<ForbiddenPage />} />
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <AppDataProvider>
              <AppShell />
            </AppDataProvider>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route element={<ProtectedRoute pageKey="dashboard" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
          <Route element={<ProtectedRoute pageKey="fleet" />}>
            <Route path="/fleet" element={<FleetPage />} />
          </Route>
          <Route element={<ProtectedRoute pageKey="drivers" />}>
            <Route path="/drivers" element={<DriversPage />} />
          </Route>
          <Route element={<ProtectedRoute pageKey="trips" />}>
            <Route path="/trips" element={<TripsPage />} />
          </Route>
          <Route element={<ProtectedRoute pageKey="maintenance" />}>
            <Route path="/maintenance" element={<MaintenancePage />} />
          </Route>
          <Route element={<ProtectedRoute pageKey="fuelExpenses" />}>
            <Route path="/fuel-expenses" element={<FuelExpensesPage />} />
          </Route>
          <Route element={<ProtectedRoute pageKey="analytics" />}>
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>
          <Route element={<ProtectedRoute pageKey="settings" />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
