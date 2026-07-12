import { zodResolver } from "@hookform/resolvers/zod";
import { Truck, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { ROLE_LABELS } from "../constants/roles";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

const schema = z.object({
  fullName: z.string().min(2, "Full name required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Min 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"]),
  organization: z.string().min(2, "Organization name required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "Contains a number", test: (v) => /\d/.test(v) },
  { label: "Contains a letter", test: (v) => /[a-zA-Z]/.test(v) },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: "FLEET_MANAGER" },
  });

  const passwordValue = watch("password") ?? "";

  async function onSubmit() {
    // In mock mode — just simulate success
    await new Promise((r) => setTimeout(r, 800));
    setDone(true);
  }

  if (done) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-ink-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center panel p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/40">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Account created!</h2>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Your TransitOps account is ready. Sign in to access your fleet dashboard.
          </p>
          <Button className="mt-8 w-full justify-center" onClick={() => navigate("/login")}>
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950 flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[40%] flex-col bg-slate-950 p-10 text-white relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative flex items-center gap-3 mb-16">
          <div className="rounded-xl bg-amber-400 p-2.5 text-slate-950"><Truck className="h-5 w-5" /></div>
          <div>
            <p className="font-semibold leading-none">TransitOps</p>
            <p className="text-xs text-slate-400 mt-0.5">Fleet command center</p>
          </div>
        </div>
        <div className="relative mt-auto space-y-4">
          <h2 className="text-3xl font-bold leading-tight">Get your fleet<br />under control<br /><span className="text-amber-400">in minutes.</span></h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Set up your depot, add your vehicles and drivers, and start dispatching — all from one platform.
          </p>
          <div className="pt-4 grid gap-2.5">
            {["No spreadsheets, no chaos", "Live trip tracking & status", "Fuel & maintenance costs in one view", "Role-based team access"].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5 text-sm text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                {feat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="rounded-xl bg-amber-400 p-2 text-slate-950"><Truck className="h-4 w-4" /></div>
            <span className="font-semibold text-slate-900 dark:text-white">TransitOps</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2">Get started</p>
          <h1 className="text-3xl font-bold text-slate-950 dark:text-white">Create account</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-amber-600 hover:underline dark:text-amber-400">Sign in</Link>
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Full Name" placeholder="Ravi Kumar" error={errors.fullName?.message} {...register("fullName")} />
              <Input label="Organization" placeholder="ABC Logistics Pvt Ltd" error={errors.organization?.message} {...register("organization")} />
            </div>
            <Input label="Email address" type="email" placeholder="you@company.com" error={errors.email?.message} {...register("email")} />
            <Select label="Your Role" error={errors.role?.message} {...register("role")}>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
            <div>
              <label className="block">
                <span className="label-base">Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-base pr-10"
                    placeholder="Min 8 characters"
                    {...register("password")}
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword((v) => !v)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <span className="mt-2 block text-sm text-red-600">{errors.password.message}</span>}
              </label>
              {/* Password strength indicators */}
              {passwordValue.length > 0 && (
                <div className="mt-2 flex gap-3">
                  {PASSWORD_RULES.map((rule) => (
                    <div key={rule.label} className={`flex items-center gap-1 text-xs ${rule.test(passwordValue) ? "text-emerald-600" : "text-slate-400"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${rule.test(passwordValue) ? "bg-emerald-500" : "bg-slate-300"}`} />
                      {rule.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <Button className="w-full justify-center" type="submit" loading={isSubmitting}>
              Create Account
            </Button>
            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              By signing up you agree to our{" "}
              <span className="text-amber-600 cursor-pointer hover:underline">Terms of Service</span> and{" "}
              <span className="text-amber-600 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
