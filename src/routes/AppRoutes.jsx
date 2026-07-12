import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
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

const protectedPages = [
  { path: "/dashboard", pageKey: "dashboard", element: <DashboardPage /> },
  { path: "/fleet", pageKey: "fleet", element: <FleetPage /> },
  { path: "/drivers", pageKey: "drivers", element: <DriversPage /> },
  { path: "/trips", pageKey: "trips", element: <TripsPage /> },
  { path: "/maintenance", pageKey: "maintenance", element: <MaintenancePage /> },
  { path: "/fuel-expenses", pageKey: "fuelExpenses", element: <FuelExpensesPage /> },
  { path: "/analytics", pageKey: "analytics", element: <AnalyticsPage /> },
  { path: "/settings", pageKey: "settings", element: <SettingsPage /> }
];

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
        {protectedPages.map(({ path, pageKey, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute pageKey={pageKey}>{element}</ProtectedRoute>}
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
