import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login as loginRequest, logout as logoutRequest } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem("transitops-session");
    return stored ? JSON.parse(stored) : null;
  });

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.token),
      async login(credentials) {
        const response = await loginRequest(credentials);
        setSession(response.data);
        localStorage.setItem("transitops-session", JSON.stringify(response.data));
        toast.success(`Welcome back, ${response.data.user.name}`);
        navigate("/dashboard", { replace: true });
      },
      async logout() {
        await logoutRequest();
        setSession(null);
        localStorage.removeItem("transitops-session");
        toast.success("Signed out");
        navigate("/login", { replace: true });
      }
    }),
    [navigate, session]
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
