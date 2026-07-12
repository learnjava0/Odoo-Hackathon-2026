import { zodResolver } from "@hookform/resolvers/zod";
import { Truck, ArrowLeft, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    await new Promise((r) => setTimeout(r, 700));
    setSentTo(values.email);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="rounded-xl bg-amber-400 p-2 text-slate-950"><Truck className="h-4 w-4" /></div>
          <span className="font-semibold text-slate-900 dark:text-white">TransitOps</span>
        </div>

        {!sent ? (
          <div className="panel p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-2">Account recovery</p>
              <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Forgot password?</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                No worries. Enter your email and we'll send you a reset link.
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Email address"
                type="email"
                placeholder="you@company.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Button className="w-full justify-center" type="submit" loading={isSubmitting}>
                Send Reset Link
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
              </Link>
            </div>
          </div>
        ) : (
          <div className="panel p-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/30">
              <MailCheck className="h-7 w-7 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">Check your inbox</h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              We sent a password reset link to
            </p>
            <p className="mt-1 font-semibold text-slate-800 dark:text-slate-200">{sentTo}</p>
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
              Didn't receive it? Check your spam folder or{" "}
              <button type="button" className="text-amber-600 hover:underline dark:text-amber-400" onClick={() => setSent(false)}>
                try again
              </button>.
            </p>
            <div className="mt-8">
              <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
