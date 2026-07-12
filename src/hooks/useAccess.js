import { useAuth } from "../context/AuthContext";

export function useAccess(allowedRoles) {
  const { user } = useAuth();

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(user?.role);
}
