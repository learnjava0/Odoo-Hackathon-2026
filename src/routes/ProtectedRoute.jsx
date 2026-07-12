import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasPageAccess } from "../constants/roles";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ pageKey, children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (pageKey && !hasPageAccess(user.role, pageKey)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;
