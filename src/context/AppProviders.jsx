import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AppDataProvider } from "./AppDataContext";
import { AuthProvider } from "./AuthContext";

export default function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
