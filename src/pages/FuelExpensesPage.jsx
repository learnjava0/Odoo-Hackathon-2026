import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppData } from "../context/AppDataContext";
import { currency } from "../utils/calculations";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Table } from "../components/ui/Table";

const fuelSchema = z.object({
  vehicleId: z.coerce.number().positive(),
  liters: z.coerce.number().positive(),
  cost: z.coerce.number().positive(),
  logDate: z.string().min(10),
  tripId: z.coerce.number().optional().nullable(),
});

const expenseSchema = z.object({
  vehicleId: z.coerce.number().positive(),
  description: z.string().min(3),
  amount: z.coerce.number().positive(),
  expenseDate: z.string().min(10),
  tripId: z.coerce.number().optional().nullable(),
});

export default function FuelExpensesPage() {
  const { vehicles, trips, maintenanceLogs, fuelLogs, expenses, saveFuelLog, saveExpense, loading } = useAppData();
  const [tab, setTab] = useState("fuel");
  const [fuelOpen, setFuelOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const fuelForm = useForm({ resolver: zodResolver(fuelSchema), defaultValues: { logDate: new Date().toISOString().slice(0, 10) } });
  const expenseForm = useForm({ resolver: zodResolver(expenseSchema), defaultValues: { expenseDate: new Date().toISOString().slice(0, 10) } });

  const rollups = useMemo(
    () =>
      vehicles.map((vehicle) => {
        const fuel = fuelLogs.filter((item) => item.vehicleId === vehicle.id).reduce((sum, item) => sum + item.cost, 0);
        const maintenance = maintenanceLogs.filter((item) => item.vehicleId === vehicle.id).reduce((sum, item) => sum + item.cost, 0);
        return { vehicle: vehicle.nameModel, total: fuel + maintenance };
      }),
    [fuelLogs, maintenanceLogs, vehicles],
  );

  async function submitFuel(values) {
    await saveFuelLog({ ...values, tripId: values.tripId || null });
    setFuelOpen(false);
    fuelForm.reset({ vehicleId: "", liters: "", cost: "", logDate: new Date().toISOString().slice(0, 10), tripId: "" });
  }

  async function submitExpense(values) {
    await saveExpense({ ...values, tripId: values.tripId || null });
    setExpenseOpen(false);
    expenseForm.reset({ vehicleId: "", description: "", amount: "", expenseDate: new Date().toISOString().slice(0, 10), tripId: "" });
  }

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operating Spend"
        title="Fuel & Expenses"
        description="Capture fuel costs and non-fuel spend in one place, with per-vehicle operational cost visibility."
        actions={
          <>
            <Button variant={tab === "fuel" ? "primary" : "secondary"} onClick={() => setTab("fuel")}>Fuel Logs</Button>
            <Button variant={tab === "expenses" ? "primary" : "secondary"} onClick={() => setTab("expenses")}>Other Expenses</Button>
          </>
        }
      />
      <Card className="space-y-4">
        <div className="flex justify-end gap-3">
          {tab === "fuel" ? <Button onClick={() => setFuelOpen(true)}>+ Log Fuel</Button> : <Button onClick={() => setExpenseOpen(true)}>+ Add Expense</Button>}
        </div>
        {tab === "fuel" ? (
          fuelLogs.length ? (
            <Table
              columns={[
                { key: "vehicle", label: "Vehicle" },
                { key: "date", label: "Date" },
                { key: "liters", label: "Liters" },
                { key: "cost", label: "Cost" },
              ]}
              rows={fuelLogs}
              renderRow={(log) => (
                <tr key={log.id}>
                  <td className="px-4 py-3">{vehicles.find((vehicle) => vehicle.id === log.vehicleId)?.nameModel}</td>
                  <td className="px-4 py-3 text-slate-400">{log.logDate}</td>
                  <td className="px-4 py-3">{log.liters}</td>
                  <td className="px-4 py-3">{currency(log.cost)}</td>
                </tr>
              )}
            />
          ) : (
            <EmptyState title="No fuel logs yet" description="Start by logging a refuel event for any active vehicle." />
          )
        ) : expenses.length ? (
          <Table
            columns={[
              { key: "vehicle", label: "Vehicle" },
              { key: "description", label: "Description" },
              { key: "amount", label: "Amount" },
              { key: "trip", label: "Linked Trip" },
              { key: "status", label: "Status" },
            ]}
            rows={expenses}
            renderRow={(expense) => (
              <tr key={expense.id}>
                <td className="px-4 py-3">{vehicles.find((vehicle) => vehicle.id === expense.vehicleId)?.nameModel}</td>
                <td className="px-4 py-3">{expense.description}</td>
                <td className="px-4 py-3">{currency(expense.amount)}</td>
                <td className="px-4 py-3 text-slate-400">#{expense.tripId ?? "—"}</td>
                <td className="px-4 py-3"><StatusBadge value={expense.tripId ? "COMPLETED" : "DRAFT"} /></td>
              </tr>
            )}
          />
        ) : (
          <EmptyState title="No expenses yet" description="Start tracking tolls, parking, and other operating spend." />
        )}
        <div className="grid gap-3 md:grid-cols-3">
          {rollups.map((item) => (
            <div key={item.vehicle} className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-sm text-slate-400">{item.vehicle}</p>
              <p className="mt-2 text-lg font-semibold text-amber-400">Total Operational Cost: {currency(item.total)}</p>
            </div>
          ))}
        </div>
      </Card>
      <Modal open={fuelOpen} title="Log Fuel" onClose={() => setFuelOpen(false)}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={fuelForm.handleSubmit(submitFuel)}>
          <Select label="Vehicle" {...fuelForm.register("vehicleId")}>
            <option value="">Select vehicle</option>
            {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.nameModel}</option>)}
          </Select>
          <Input label="Date" type="date" {...fuelForm.register("logDate")} />
          <Input label="Liters" type="number" {...fuelForm.register("liters")} />
          <Input label="Cost" type="number" {...fuelForm.register("cost")} />
          <Select label="Linked Trip" {...fuelForm.register("tripId")}>
            <option value="">Optional trip</option>
            {trips.map((trip) => <option key={trip.id} value={trip.id}>#{trip.id} {trip.source} to {trip.destination}</option>)}
          </Select>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setFuelOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
      <Modal open={expenseOpen} title="Add Expense" onClose={() => setExpenseOpen(false)}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={expenseForm.handleSubmit(submitExpense)}>
          <Select label="Vehicle" {...expenseForm.register("vehicleId")}>
            <option value="">Select vehicle</option>
            {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.nameModel}</option>)}
          </Select>
          <Input label="Description" {...expenseForm.register("description")} />
          <Input label="Amount" type="number" {...expenseForm.register("amount")} />
          <Input label="Date" type="date" {...expenseForm.register("expenseDate")} />
          <Select label="Linked Trip" {...expenseForm.register("tripId")}>
            <option value="">Optional trip</option>
            {trips.map((trip) => <option key={trip.id} value={trip.id}>#{trip.id} {trip.source} to {trip.destination}</option>)}
          </Select>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setExpenseOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
