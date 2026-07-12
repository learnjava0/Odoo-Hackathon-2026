import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginRequest } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("transitops-session");
    if (stored) {
      const parsed = JSON.parse(stored);
      setToken(parsed.token);
      setUser(parsed.user);
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      async login(credentials) {
        setLoading(true);
        try {
          const data = await loginRequest(credentials);
          setToken(data.token);
          setUser(data.user);
          sessionStorage.setItem("transitops-session", JSON.stringify(data));
          return data;
        } finally {
          setLoading(false);
        }
      },
      logout() {
        setToken(null);
        setUser(null);
        sessionStorage.removeItem("transitops-session");
      },
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
