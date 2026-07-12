import { Card } from "./Card";

export function StatCard({ label, value, hint, accent }) {
  return (
    <Card className="space-y-3">
      <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
      <div className="flex items-end justify-between gap-3">
        <p className={`text-3xl font-semibold ${accent ?? "text-slate-950 dark:text-slate-100"}`}>{value}</p>
        {hint ? <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p> : null}
      </div>
    </Card>
  );
}
