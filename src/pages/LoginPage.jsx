import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4)
});

function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@transitops.dev",
      password: "demo1234"
    }
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900/85 p-8 shadow-2xl shadow-slate-950/40">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">TransitOps</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">Use one of the mock accounts to enter the dashboard scaffold.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(login)}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-cyan-400"
              {...register("email")}
            />
            {errors.email ? <p className="mt-2 text-sm text-rose-400">{errors.email.message}</p> : null}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-cyan-400"
              {...register("password")}
            />
            {errors.password ? <p className="mt-2 text-sm text-rose-400">{errors.password.message}</p> : null}
          </div>

          <Button className="w-full justify-center" type="submit" disabled={isSubmitting}>
            <LogIn size={16} />
            {isSubmitting ? "Signing in..." : "Enter workspace"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
