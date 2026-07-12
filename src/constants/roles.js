export const ROLE_ADMIN = "admin";
export const ROLE_MANAGER = "manager";
export const ROLE_DISPATCHER = "dispatcher";

export const ALL_ROLES = [ROLE_ADMIN, ROLE_MANAGER, ROLE_DISPATCHER];

export const PAGE_ACCESS = {
  dashboard: ALL_ROLES,
  fleet: ALL_ROLES,
  drivers: ALL_ROLES,
  trips: ALL_ROLES,
  maintenance: ALL_ROLES,
  analytics: ALL_ROLES,
  fuelExpenses: [ROLE_ADMIN, ROLE_MANAGER],
  settings: [ROLE_ADMIN]
};

export function hasPageAccess(role, pageKey) {
  const allowedRoles = PAGE_ACCESS[pageKey];

  if (!allowedRoles) {
    return true;
  }

  return allowedRoles.includes(role);
}
