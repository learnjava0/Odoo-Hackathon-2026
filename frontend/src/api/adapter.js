import { apiClient } from "./client";
import { mockApi } from "./mocks/service";

const useMocks = import.meta.env.VITE_USE_MOCKS !== "false";

export async function request(mockHandler, config) {
  if (useMocks) {
    return mockHandler();
  }
  const response = await apiClient(config);
  return response.data;
}

export { mockApi, useMocks };
