import client from "./client";
import { mockAuthApi } from "./mocks/service";

const useMocks = import.meta.env.VITE_USE_MOCKS !== "false";

export function login(credentials) {
  return useMocks ? mockAuthApi.login(credentials) : client.post("/auth/login", credentials);
}

export function logout() {
  return useMocks ? mockAuthApi.logout() : client.post("/auth/logout");
}
