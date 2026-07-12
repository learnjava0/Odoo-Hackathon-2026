import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppData } from "../context/AppDataContext";
import { useAccess } from "../hooks/useAccess";
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
import { Table } from "../components/ui/Table";

const schema = z.object({
  vehicleId: z.coerce.number().positive(),
  description: z.string().min(3),
  cost: z.coerce.number().positive(),
  startDate: z.string().min(10),
});

export default function MaintenancePage() {
  const access = useAccess("maintenance");
  const { vehicles, maintenanceLogs, saveMaintenanceLog, closeMaintenanceLog, loading } = useAppData();
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { startDate: new Date().toISOString().slice(0, 10) } });
  const eligibleVehicles = vehicles.filter((vehicle) => vehicle.status !== "RETIRED");

  async function onSubmit(values) {
    await saveMaintenanceLog(values);
    form.reset({ vehicleId: "", description: "", cost: "", startDate: new Date().toISOString().slice(0, 10) });
  }

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Service Control" title="Maintenance" description="Log active service work, keep in-shop assets out of dispatch pools, and close records back to availability." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="mb-5 text-xl font-semibold text-slate-100">Log Service Record</h2>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <Select label="Vehicle" error={form.formState.errors.vehicleId?.message} {...form.register("vehicleId")}>
              <option value="">Select vehicle</option>
              {eligibleVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.nameModel}</option>)}
            </Select>
            <label className="block">
              <span className="label-base">Description</span>
              <textarea className="input-base min-h-28" {...form.register("description")} />
            </label>
            <Input label="Cost" type="number" error={form.formState.errors.cost?.message} {...form.register("cost")} />
            <Input label="Start Date" type="date" error={form.formState.errors.startDate?.message} {...form.register("startDate")} />
            <p className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-400">
              Active → In Shop. In Shop → Available when maintenance closes, unless the vehicle is retired.
            </p>
            {access === "full" ? <Button type="submit" loading={form.formState.isSubmitting}>Save</Button> : null}
          </form>
        </Card>
        <Card>
          <h2 className="mb-5 text-xl font-semibold text-slate-100">Service Log</h2>
          {maintenanceLogs.length ? (
            <Table
              columns={[
                { key: "vehicle", label: "Vehicle" },
                { key: "description", label: "Description" },
                { key: "cost", label: "Cost" },
                { key: "status", label: "Status" },
                { key: "action", label: "Action" },
              ]}
              rows={maintenanceLogs}
              renderRow={(log) => {
                const vehicle = vehicles.find((item) => item.id === log.vehicleId);
                return (
                  <tr key={log.id}>
                    <td className="px-4 py-3">{vehicle?.nameModel}</td>
                    <td className="px-4 py-3">{log.description}</td>
                    <td className="px-4 py-3">{currency(log.cost)}</td>
                    <td className="px-4 py-3"><StatusBadge value={log.active ? "IN_SHOP" : "COMPLETED"} /></td>
                    <td className="px-4 py-3">
                      {log.active && access === "full" ? (
                        vehicle?.status === "RETIRED" ? (
                          <span className="text-xs text-slate-500">Retired vehicles stay retired.</span>
                        ) : (
                          <Button variant="secondary" className="px-3 py-2" onClick={() => closeMaintenanceLog(log.id)}>
                            Close Maintenance
                          </Button>
                        )
                      ) : (
                        <span className="text-xs text-slate-500">{formatDate(log.endDate)}</span>
                      )}
                    </td>
                  </tr>
                );
              }}
            />
          ) : (
            <EmptyState title="No service records yet" description="Log a new maintenance event to start tracking in-shop assets." />
          )}
        </Card>
      </div>
    </div>
  );
}
