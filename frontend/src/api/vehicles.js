import { mockApi, request } from "./adapter";

export const getVehicles = () => request(() => mockApi.getVehicles(), { method: "get", url: "/api/vehicles" });
export const getVehicle = (id) => request(() => mockApi.getVehicle(id), { method: "get", url: `/api/vehicles/${id}` });
export const createVehicle = (payload) =>
  request(() => mockApi.createVehicle(payload), { method: "post", url: "/api/vehicles", data: payload });
export const updateVehicle = (id, payload) =>
  request(() => mockApi.updateVehicle(id, payload), { method: "put", url: `/api/vehicles/${id}`, data: payload });
