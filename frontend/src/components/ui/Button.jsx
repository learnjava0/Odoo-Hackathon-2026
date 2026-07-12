import { LoaderCircle } from "lucide-react";
import { cn } from "../../utils/classNames";

const variants = {
  primary: "bg-amber-500 text-slate-950 hover:bg-amber-400",
  secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700",
  ghost: "bg-transparent text-slate-300 hover:bg-slate-800",
  danger: "bg-red-500/90 text-white hover:bg-red-500",
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
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
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
