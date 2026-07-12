export const ROLE_LABELS = {
  FLEET_MANAGER: "Fleet Manager",
  DRIVER: "Dispatcher",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst",
};

export const ROLE_ADMIN = "FLEET_MANAGER";
export const ROLE_MANAGER = "FLEET_MANAGER";
export const ROLE_DISPATCHER = "DRIVER";

export const PAGE_ACCESS = {
  dashboard: {
    FLEET_MANAGER: "full",
    DRIVER: "own",
    SAFETY_OFFICER: "full",
    FINANCIAL_ANALYST: "full",
  },
  fleet: {
    FLEET_MANAGER: "full",
    DRIVER: "none",
    SAFETY_OFFICER: "none",
    FINANCIAL_ANALYST: "view",
  },
  drivers: {
    FLEET_MANAGER: "full",
    DRIVER: "none",
    SAFETY_OFFICER: "view",
    FINANCIAL_ANALYST: "none",
  },
  trips: {
    FLEET_MANAGER: "full",
    DRIVER: "full",
    SAFETY_OFFICER: "view",
    FINANCIAL_ANALYST: "none",
  },
  maintenance: {
    FLEET_MANAGER: "full",
    DRIVER: "none",
    SAFETY_OFFICER: "none",
    FINANCIAL_ANALYST: "view",
  },
  fuelExpenses: {
    FLEET_MANAGER: "full",
    DRIVER: "none",
    SAFETY_OFFICER: "none",
    FINANCIAL_ANALYST: "full",
  },
  analytics: {
    FLEET_MANAGER: "full",
    DRIVER: "none",
    SAFETY_OFFICER: "none",
    FINANCIAL_ANALYST: "full",
  },
  settings: {
    FLEET_MANAGER: "full",
    DRIVER: "none",
    SAFETY_OFFICER: "none",
    FINANCIAL_ANALYST: "none",
  },
};

export function hasPageAccess(role, pageKey) {
  return PAGE_ACCESS[pageKey]?.[role] && PAGE_ACCESS[pageKey][role] !== "none";
}
