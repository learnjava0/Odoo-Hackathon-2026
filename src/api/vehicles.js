import client from "./client";
import { mockFleetApi } from "./mocks/service";

const useMocks = import.meta.env.VITE_USE_MOCKS !== "false";

export function getVehicles() {
  return useMocks ? mockFleetApi.listVehicles() : client.get("/vehicles");
}
