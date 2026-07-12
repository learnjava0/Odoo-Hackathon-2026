import { zodResolver } from "@hookform/resolvers/zod";
import { Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ROLE_LABELS } from "../constants/roles";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  role: z.enum(["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"]),
  remember: z.boolean().optional(),
});

export default function LoginPage() {
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@transitops.com",
      password: "admin123",
      role: "FLEET_MANAGER",
      remember: true,
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(values) {
    await login({ email: values.email, password: values.password, role: values.role });
    navigate(from, { replace: true });
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden flex-col justify-between bg-white p-10 text-slate-900 lg:flex">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">TransitOps</h1>
              <p className="text-sm text-slate-500">Operational command for modern fleet teams</p>
            </div>
          </div>
          <h2 className="max-w-lg text-4xl font-semibold leading-tight">
            Replace fleet spreadsheets with a live operations console.
          </h2>
          <p className="mt-4 max-w-lg text-base text-slate-600">
            Dispatch trips, monitor service windows, track fuel costs, and keep compliance visible from one control room.
          </p>
        </div>
        <div className="panel-muted bg-slate-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-600">Who can log in</p>
          <div className="mt-4 grid gap-3">
            {Object.values(ROLE_LABELS).map((role) => (
              <div key={role} className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="font-medium">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="panel w-full max-w-lg p-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Welcome back</p>
          <h2 className="text-3xl font-semibold text-slate-950">Sign in to TransitOps</h2>
          <p className="mt-3 text-sm text-slate-600">Use a seeded backend account to explore the role-based flows.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Email" placeholder="admin@transitops.com" error={errors.email?.message} {...register("email")} />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />
            <Select label="Demo role" error={errors.role?.message} {...register("role")}>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300 bg-white" {...register("remember")} />
                Remember me
              </label>
              <button type="button" className="text-slate-500">
                Forgot password?
              </button>
            </div>
            <Button className="w-full" type="submit" loading={loading}>
              Sign In
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
