import client from "./client";
import { mockTripsApi } from "./mocks/service";

const useMocks = import.meta.env.VITE_USE_MOCKS !== "false";

export function getTrips() {
  return useMocks ? mockTripsApi.listTrips() : client.get("/trips");
}
