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
import { Select } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";
import { StatusBadge } from "../components/ui/StatusBadge";

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
  const [fuelOpen, setFuelOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const fuelForm = useForm({ resolver: zodResolver(fuelSchema), defaultValues: { logDate: new Date().toISOString().slice(0, 10) } });
  const expenseForm = useForm({ resolver: zodResolver(expenseSchema), defaultValues: { expenseDate: new Date().toISOString().slice(0, 10) } });

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-500">Operating Spend</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Fuel & Expenses</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setFuelOpen(true)}>+ Log Fuel</Button>
          <Button variant="secondary" onClick={() => setExpenseOpen(true)}>+ Add Expense</Button>
        </div>
      </div>
      <Card className="space-y-6">
        {/* Fuel Logs */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Fuel Logs</h2>
          {fuelLogs.length ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-ink-950">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Vehicle</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Date</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Liters</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-ink-900">
                  {fuelLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-ink-850">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{vehicles.find((v) => v.id === log.vehicleId)?.nameModel ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{log.logDate}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{log.liters} L</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{currency(log.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No fuel logs yet" description="Start by logging a refuel event for any active vehicle." />
          )}
        </div>

        {/* Other Expenses */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Other Expenses (Toll / Misc)</h2>
          {expenses.length ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-ink-950">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Trip</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Vehicle</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Description</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Amount</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-ink-900">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-ink-850">
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">#{expense.tripId ?? "—"}</td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{vehicles.find((v) => v.id === expense.vehicleId)?.nameModel ?? "—"}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{expense.description}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{currency(expense.amount)}</td>
                      <td className="px-4 py-3"><StatusBadge value={expense.tripId ? "COMPLETED" : "DRAFT"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No expenses yet" description="Start tracking tolls, parking, and other operating spend." />
          )}
        </div>

        {/* Total operational cost footer */}
        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Operational Cost (Auto) = Fuel + Maintenance</p>
            <p className="text-base font-semibold text-amber-600">
              {currency(
                fuelLogs.reduce((s, l) => s + l.cost, 0) +
                expenses.reduce((s, e) => s + e.amount, 0)
              )}
            </p>
          </div>
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
