import { cn } from "../../utils/classNames";

const toneMap = {
  green: "border-green-500/30 bg-green-500/10 text-green-300",
  blue: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  red: "border-red-500/30 bg-red-500/10 text-red-300",
  slate: "border-slate-600 bg-slate-800 text-slate-300",
};

export function Badge({ children, tone = "slate", className }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-xs font-medium", toneMap[tone], className)}>
      {children}
    </span>
  );
}
