import client from "./client";
import { mockDriversApi } from "./mocks/service";

const useMocks = import.meta.env.VITE_USE_MOCKS !== "false";

export function getDrivers() {
  return useMocks ? mockDriversApi.listDrivers() : client.get("/drivers");
}
