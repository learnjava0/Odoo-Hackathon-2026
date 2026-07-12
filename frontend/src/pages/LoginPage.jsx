import { zodResolver } from "@hookform/resolvers/zod";
import { Truck, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ROLE_LABELS } from "../constants/roles";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(4, "Min 4 characters"),
  role: z.enum(["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"]),
});

const DEMO_ACCOUNTS = [
  { role: "FLEET_MANAGER",      label: "Fleet Manager",     email: "ravi.kumar@transitops.in",  desc: "Full access — fleet, drivers, trips, analytics" },
  { role: "DRIVER",             label: "Dispatcher",        email: "ajay.singh@transitops.in",  desc: "Create & dispatch trips for assigned vehicles" },
  { role: "SAFETY_OFFICER",     label: "Safety Officer",    email: "priya.nair@transitops.in",  desc: "View drivers, compliance & trip history" },
  { role: "FINANCIAL_ANALYST",  label: "Financial Analyst", email: "deepa.shah@transitops.in",  desc: "Fleet costs, fuel logs, and analytics" },
];

export default function LoginPage() {
  const { isAuthenticated, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "ravi.kumar@transitops.in", password: "admin123", role: "FLEET_MANAGER" },
  });

  const currentRole = watch("role");

  // Auto-update email when role changes
  useEffect(() => {
    const account = DEMO_ACCOUNTS.find((acc) => acc.role === currentRole);
    if (account) {
      setValue("email", account.email);
    }
  }, [currentRole, setValue]);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function onSubmit(values) {
    try {
      setServerError("");
      await login({ email: values.email, password: values.password, role: values.role });
      navigate(from, { replace: true });
    } catch {
      setServerError("Invalid credentials. Try any demo account below.");
    }
  }

  function quickLogin(account) {
    setValue("email", account.email);
    setValue("role", account.role);
    setValue("password", "admin123");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[44%] flex-col bg-slate-950 dark:bg-ink-950 p-10 text-white relative overflow-hidden">
        {/* subtle grid bg */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="rounded-xl bg-amber-400 p-2.5 text-slate-950">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-white leading-none">TransitOps</p>
              <p className="text-xs text-slate-400 mt-0.5">Fleet command center</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Replace fleet<br />spreadsheets with a<br />
            <span className="text-amber-400">live operations</span><br />console.
          </h2>
          <p className="mt-5 text-slate-400 text-sm leading-relaxed max-w-xs">
            Dispatch trips, monitor service windows, track fuel costs, and keep compliance visible from one control room.
          </p>
          <div className="mt-10 grid gap-2.5">
            {[
              "Real-time vehicle & driver status",
              "Role-based access for 4 team roles",
              "Trip lifecycle — Draft → Dispatch → Complete",
              "Fuel, maintenance & expense tracking",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-sm text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>
        {/* Quick-login demo cards */}
        <div className="relative mt-auto">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Demo accounts — click to fill</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => quickLogin(acc)}
                className={`text-left rounded-xl border p-3 transition hover:border-amber-400 hover:bg-white/5 ${
                  watch("role") === acc.role ? "border-amber-400 bg-white/5" : "border-slate-800"
                }`}
              >
                <p className="text-xs font-semibold text-white">{acc.label}</p>
                <p className="mt-0.5 text-xs text-slate-500 leading-tight">{acc.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="rounded-xl bg-amber-400 p-2 text-slate-950"><Truck className="h-4 w-4" /></div>
            <span className="font-semibold text-slate-900 dark:text-white">TransitOps</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2">Welcome back</p>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            New here?{" "}
            <Link to="/signup" className="font-medium text-amber-600 hover:underline dark:text-amber-400">
              Create an account
            </Link>
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <div>
              <label className="block">
                <span className="label-base">Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="input-base pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <span className="mt-2 block text-sm text-red-600">{errors.password.message}</span>}
              </label>
            </div>
            <Select label="Demo role" error={errors.role?.message} {...register("role")}>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-amber-600 hover:underline dark:text-amber-400 text-xs font-medium">
                Forgot password?
              </Link>
            </div>
            {serverError && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                {serverError}
              </p>
            )}
            <Button className="w-full justify-center" type="submit" loading={loading}>
              Sign In
            </Button>
          </form>

          {/* Mobile demo cards */}
          <div className="mt-8 lg:hidden">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Demo accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => quickLogin(acc)}
                  className="text-left rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-amber-400 transition"
                >
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{acc.label}</p>
                  <p className="mt-0.5 text-xs text-slate-400 leading-tight">{acc.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
