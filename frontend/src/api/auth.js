import { mockApi, request } from "./adapter";

export function login(payload) {
  return request(() => mockApi.login(payload), {
    method: "post",
    url: "/api/auth/login",
    data: payload,
  }).then((data) => {
    if (data.user) {
      return data;
    }

    return {
      token: data.token,
      user: {
        email: data.email,
        role: data.role,
      },
    };
  });
}
