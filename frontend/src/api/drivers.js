import { mockApi, request } from "./adapter";

export const getDrivers = () => request(() => mockApi.getDrivers(), { method: "get", url: "/api/drivers" });
export const getDriver = (id) => request(() => mockApi.getDriver(id), { method: "get", url: `/api/drivers/${id}` });
export const createDriver = (payload) =>
  request(() => mockApi.createDriver(payload), { method: "post", url: "/api/drivers", data: payload });
export const updateDriver = (id, payload) =>
  request(() => mockApi.updateDriver(id, payload), { method: "put", url: `/api/drivers/${id}`, data: payload });
