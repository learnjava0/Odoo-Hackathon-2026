import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { ROLE_ADMIN, ROLE_DISPATCHER, ROLE_MANAGER } from "../constants/roles";
import AnalyticsPage from "../pages/AnalyticsPage";
import DashboardPage from "../pages/DashboardPage";
import DriversPage from "../pages/DriversPage";
import FleetPage from "../pages/FleetPage";
import ForbiddenPage from "../pages/ForbiddenPage";
import FuelExpensesPage from "../pages/FuelExpensesPage";
import LoginPage from "../pages/LoginPage";
import MaintenancePage from "../pages/MaintenancePage";
import SettingsPage from "../pages/SettingsPage";
import TripsPage from "../pages/TripsPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/fleet" element={<FleetPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route
          path="/fuel-expenses"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_MANAGER]}>
              <FuelExpensesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN, ROLE_MANAGER, ROLE_DISPATCHER]}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={[ROLE_ADMIN]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
