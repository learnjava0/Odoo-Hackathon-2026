import { mockApi } from "./adapter";

export const getFuelLogs = () => mockApi.getFuelLogs();
export const createFuelLog = (payload) => mockApi.createFuelLog(payload);
export const getExpenses = () => mockApi.getExpenses();
export const createExpense = (payload) => mockApi.createExpense(payload);
