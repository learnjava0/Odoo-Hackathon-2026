import { mockApi, request } from "./adapter";

export const getMaintenanceLogs = () =>
  request(() => mockApi.getMaintenanceLogs(), { method: "get", url: "/api/maintenance-logs" });
export const createMaintenanceLog = (payload) =>
  request(() => mockApi.createMaintenanceLog(payload), {
    method: "post",
    url: "/api/maintenance-logs",
    data: payload,
  });
export const closeMaintenanceLog = (id) =>
  request(() => mockApi.closeMaintenanceLog(id), { method: "patch", url: `/api/maintenance-logs/${id}/close` });
