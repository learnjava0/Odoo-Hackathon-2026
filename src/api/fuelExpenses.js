import client from "./client";
import { mockFuelExpensesApi } from "./mocks/service";

const useMocks = import.meta.env.VITE_USE_MOCKS !== "false";

export function getFuelExpenses() {
  return useMocks ? mockFuelExpensesApi.listExpenses() : client.get("/fuel-expenses");
}
