import { mockApi, request } from "./adapter";

export const getMaintenanceLogs = () =>
  request(() => mockApi.getMaintenanceLogs(), { method: "get", url: "/api/maintenance" });
export const createMaintenanceLog = (payload) =>
  request(() => mockApi.createMaintenanceLog(payload), {
    method: "post",
    url: "/api/maintenance",
    data: payload,
  });
export const closeMaintenanceLog = (id) =>
  request(() => mockApi.closeMaintenanceLog(id), { method: "post", url: `/api/maintenance/${id}/close` });
