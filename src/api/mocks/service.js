import {
  mockDrivers,
  mockFuelExpenses,
  mockMaintenanceJobs,
  mockTrips,
  mockUsers,
  mockVehicles
} from "./data";

const delay = (value) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve({ data: value }), 150);
  });

export const mockAuthApi = {
  async login({ email }) {
    const normalizedEmail = email?.trim().toLowerCase();
    const user = mockUsers.find((item) => item.email === normalizedEmail) ?? mockUsers[0];
    return delay({ user, token: `mock-token-${user.id}` });
  },
  async logout() {
    return delay({ success: true });
  }
};

export const mockFleetApi = {
  listVehicles: async () => delay(mockVehicles)
};

export const mockDriversApi = {
  listDrivers: async () => delay(mockDrivers)
};

export const mockTripsApi = {
  listTrips: async () => delay(mockTrips)
};

export const mockMaintenanceApi = {
  listJobs: async () => delay(mockMaintenanceJobs)
};

export const mockFuelExpensesApi = {
  listExpenses: async () => delay(mockFuelExpenses)
};
