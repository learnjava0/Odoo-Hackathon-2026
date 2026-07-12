import client from "./client";
import { mockMaintenanceApi } from "./mocks/service";

const useMocks = import.meta.env.VITE_USE_MOCKS !== "false";

export function getMaintenanceJobs() {
  return useMocks ? mockMaintenanceApi.listJobs() : client.get("/maintenance");
}
