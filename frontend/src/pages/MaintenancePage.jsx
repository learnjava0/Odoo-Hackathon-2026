import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppData } from "../context/AppDataContext";
import { formatDate } from "../utils/dateHelpers";
import { currency } from "../utils/calculations";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useAccess } from "../hooks/useAccess";

const schema = z.object({
  vehicleId: z.coerce.number().positive("Select a vehicle"),
  description: z.string().min(3, "Service type required"),
  cost: z.coerce.number().nonnegative(),
  startDate: z.string().min(10),
  active: z.boolean().optional(),
});

function MaintenancePage() {
  const access = useAccess("maintenance");
  const { vehicles, maintenanceLogs, saveMaintenanceLog, loading } = useAppData();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { startDate: new Date().toISOString().slice(0, 10), active: true },
  });

  async function onSubmit(values) {
    try {
      setServerError("");
      await saveMaintenanceLog({ ...values, active: true });
      reset({ vehicleId: "", description: "", cost: "", startDate: new Date().toISOString().slice(0, 10) });
    } catch {
      setServerError("Failed to save maintenance record.");
    }
  }

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Service Operations"
        title="Maintenance"
        description="Log service records and track maintenance status for fleet vehicles."
      />
      <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        {access === "full" && (
          <Card>
            <h2 className="mb-5 text-base font-semibold text-slate-950 dark:text-slate-100">Log Service Record</h2>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Select label="Vehicle" error={errors.vehicleId?.message} {...register("vehicleId")}>
                <option value="">Select vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.nameModel}</option>
                ))}
              </Select>
              <Input label="Service Type" placeholder="Oil Change, Tyre Replace…" error={errors.description?.message} {...register("description")} />
              <Input label="Cost" type="number" error={errors.cost?.message} {...register("cost")} />
              <Input label="Date" type="date" error={errors.startDate?.message} {...register("startDate")} />
              {serverError && <p className="text-sm text-red-600">{serverError}</p>}
              <Button type="submit" loading={isSubmitting} className="w-full justify-center bg-amber-400 text-slate-950 hover:bg-amber-300">
                Save
              </Button>
            </form>
            <div className="mt-6 space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-medium text-emerald-600">Available</span>
                <span>──────────────────────────→</span>
                <span className="font-medium text-amber-600">In Shop</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-amber-600">In Shop</span>
                <span>──────────────────────────→</span>
                <span className="font-medium text-emerald-600">Available</span>
              </div>
              <p className="mt-1 text-amber-600">Note: In Shop vehicles are removed from the dispatch pool.</p>
            </div>
          </Card>
        )}
        <Card className={access !== "full" ? "xl:col-span-2" : ""}>
          <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-slate-100">Service Log</h2>
          {maintenanceLogs.length ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-ink-950">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vehicle</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Service</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cost</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-ink-900">
                  {maintenanceLogs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-ink-850">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        {vehicles.find((v) => v.id === job.vehicleId)?.nameModel ?? job.vehicleName ?? `#${job.vehicleId}`}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{job.description}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{currency(job.cost)}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDate(job.startDate)}</td>
                      <td className="px-4 py-3"><StatusBadge value={job.active ? "IN_SHOP" : "COMPLETED"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No maintenance records" description="Service history will appear here once maintenance activity is logged." />
          )}
        </Card>
      </div>
    </div>
  );
}

export default MaintenancePage;
