import { mockApi, request } from "./adapter";

export const getFuelLogs = () => request(() => mockApi.getFuelLogs(), { method: "get", url: "/api/fuel-logs" });
export const createFuelLog = (payload) =>
  request(() => mockApi.createFuelLog(payload), { method: "post", url: "/api/fuel-logs", data: payload });
export const getExpenses = () => request(() => mockApi.getExpenses(), { method: "get", url: "/api/expenses" });
export const createExpense = (payload) =>
  request(() => mockApi.createExpense(payload), { method: "post", url: "/api/expenses", data: payload });
