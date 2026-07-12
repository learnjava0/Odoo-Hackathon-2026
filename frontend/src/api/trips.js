import { mockApi, request } from "./adapter";

export const getTrips = () => request(() => mockApi.getTrips(), { method: "get", url: "/api/trips" });
export const getTrip = (id) => request(() => mockApi.getTrip(id), { method: "get", url: `/api/trips/${id}` });
export const createTrip = (payload) =>
  request(() => mockApi.createTrip(payload), { method: "post", url: "/api/trips", data: payload });
export const dispatchTrip = (id) =>
  request(() => mockApi.dispatchTrip(id), { method: "post", url: `/api/trips/${id}/dispatch` });
export const completeTrip = (id, payload) =>
  request(() => mockApi.completeTrip(id, payload), {
    method: "post",
    url: `/api/trips/${id}/complete`,
    data: payload,
  });
export const cancelTrip = (id) =>
  request(() => mockApi.cancelTrip(id), { method: "post", url: `/api/trips/${id}/cancel` });
