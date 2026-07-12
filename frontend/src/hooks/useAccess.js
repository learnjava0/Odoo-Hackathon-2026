import { PAGE_ACCESS } from "../constants/roles";
import { useAuth } from "../context/AuthContext";

export function useAccess(pageKey) {
  const { user } = useAuth();
  return PAGE_ACCESS[pageKey]?.[user?.role] ?? "none";
}
