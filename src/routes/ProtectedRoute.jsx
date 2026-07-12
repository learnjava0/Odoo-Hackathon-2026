import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAccess } from "../hooks/useAccess";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const canAccess = useAccess(allowedRoles);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!canAccess) {
    return <Navigate to="/forbidden" replace />;
  }

  return children ?? <Outlet />;
}

export default ProtectedRoute;
