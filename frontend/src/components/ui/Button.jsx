import { LoaderCircle } from "lucide-react";
import { cn } from "../../utils/classNames";

const variants = {
  primary: "bg-slate-950 text-white shadow-sm shadow-slate-300 hover:bg-slate-800",
  secondary: "border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  danger: "bg-red-600 text-white shadow-sm shadow-red-200 hover:bg-red-500",
};

export function Button({
  children,
  className,
  variant = "primary",
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60",
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
