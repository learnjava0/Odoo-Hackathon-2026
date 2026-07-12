import { mockApi, request } from "./adapter";

export function login(payload) {
  return request(() => mockApi.login(payload), {
    method: "post",
    url: "/api/auth/login",
    data: payload,
  });
}
