import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppData } from "../context/AppDataContext";
import { useAccess } from "../hooks/useAccess";
import { getOperationalCost, currency, number } from "../utils/calculations";
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

const schema = z.object({
  registrationNumber: z.string().min(3),
  nameModel: z.string().min(2),
  type: z.string().min(2),
  maxLoadCapacity: z.coerce.number().positive(),
  odometer: z.coerce.number().nonnegative(),
  acquisitionCost: z.coerce.number().nonnegative(),
  status: z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]),
});

export default function FleetPage() {
  const access = useAccess("fleet");
  const { vehicles, trips, maintenanceLogs, fuelLogs, expenses, saveVehicle, loading } = useAppData();
  const [filters, setFilters] = useState({ search: "", type: "ALL", status: "ALL" });
  const [sort, setSort] = useState({ key: "registrationNumber", direction: "asc" });
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: "AVAILABLE" },
  });

  const rows = useMemo(() => {
    return vehicles
      .filter((vehicle) => {
        const query = filters.search.toLowerCase();
        return (
          (!query ||
            vehicle.registrationNumber.toLowerCase().includes(query) ||
            vehicle.nameModel.toLowerCase().includes(query)) &&
          (filters.type === "ALL" || vehicle.type === filters.type) &&
          (filters.status === "ALL" || vehicle.status === filters.status)
        );
      })
      .sort((a, b) => {
        const aValue = a[sort.key];
        const bValue = b[sort.key];
        const order = sort.direction === "asc" ? 1 : -1;
        return aValue > bValue ? order : -order;
      });
  }, [filters.search, filters.status, filters.type, sort.direction, sort.key, vehicles]);

  function openCreate() {
    setEditing(null);
    setServerError("");
    reset({ registrationNumber: "", nameModel: "", type: "Van", maxLoadCapacity: 500, odometer: 0, acquisitionCost: 0, status: "AVAILABLE" });
    setModalOpen(true);
  }

  function openEdit(vehicle) {
    setEditing(vehicle);
    setServerError("");
    reset(vehicle);
    setModalOpen(true);
  }

  async function onSubmit(values) {
    try {
      await saveVehicle(values, editing?.id);
      setModalOpen(false);
    } catch (error) {
      if (error.status === 409 || error.field === "registrationNumber") {
        setError("registrationNumber", { message: error.message });
      } else {
        setServerError(error.message || "Unable to save vehicle.");
      }
    }
  }

  if (loading) {
    return <Skeleton className="h-96" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Vehicle Registry"
        title="Fleet"
        description="Track core fleet assets, view operating history, and keep dispatch-eligible vehicles cleanly separated from retired or in-shop units."
      />
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={filters.type} onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}>
            <option value="ALL">Type: All</option>
            {[...new Set(vehicles.map((vehicle) => vehicle.type))].map((type) => <option key={type}>{type}</option>)}
          </Select>
          <Select value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}>
            <option value="ALL">Status: All</option>
            {["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"].map((status) => <option key={status}>{status}</option>)}
          </Select>
          <div className="flex-1 min-w-40">
            <Input placeholder="Search by reg no." value={filters.search} onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))} />
          </div>
          {access === "full" && (
            <Button onClick={openCreate} className="ml-auto">+ Add Vehicle</Button>
          )}
        </div>
        {rows.length ? (
          <Table
            columns={[
              { key: "registrationNumber", label: "Reg. No. (Unique)", sortable: true },
              { key: "nameModel", label: "Name/Model", sortable: true },
              { key: "type", label: "Type", sortable: true },
              { key: "maxLoadCapacity", label: "Capacity", sortable: true },
              { key: "odometer", label: "Odometer", sortable: true },
              { key: "acquisitionCost", label: "Acq. Cost", sortable: true },
              { key: "status", label: "Status", sortable: true },
              { key: "actions", label: "" },
            ]}
            rows={rows}
            sort={sort}
            onSort={(key) => setSort((prev) => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" }))}
            renderRow={(vehicle) => (
              <tr key={vehicle.id} className="hover:bg-slate-50 dark:hover:bg-ink-850">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{vehicle.registrationNumber}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{vehicle.nameModel}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{vehicle.type}</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{number(vehicle.maxLoadCapacity)} kg</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{number(vehicle.odometer)} km</td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{currency(vehicle.acquisitionCost)}</td>
                <td className="px-4 py-3"><StatusBadge value={vehicle.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => setDetail(vehicle)}>View</Button>
                    {access === "full" ? <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={() => openEdit(vehicle)}>Edit</Button> : null}
                  </div>
                </td>
              </tr>
            )}
          />
        ) : (
          <EmptyState title="No vehicles found" description="Try widening your search or filters to bring vehicles back into the registry table." />
        )}
        <p className="text-xs text-red-500 dark:text-red-400">
          Note: Registration No. must be unique. Retired/In Shop vehicles are hidden from Trip Dispatcher.
        </p>
      </Card>
      <Modal open={modalOpen} title={editing ? "Edit Vehicle" : "Add Vehicle"} onClose={() => setModalOpen(false)}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Registration Number" error={errors.registrationNumber?.message} {...register("registrationNumber")} />
          <Input label="Name/Model" error={errors.nameModel?.message} {...register("nameModel")} />
          <Input label="Type" error={errors.type?.message} {...register("type")} />
          <Input label="Max Load Capacity (kg)" type="number" error={errors.maxLoadCapacity?.message} {...register("maxLoadCapacity")} />
          <Input label="Odometer" type="number" error={errors.odometer?.message} {...register("odometer")} />
          <Input label="Acquisition Cost" type="number" error={errors.acquisitionCost?.message} {...register("acquisitionCost")} />
          <Select label="Status" error={errors.status?.message} {...register("status")}>
            {["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"].map((status) => <option key={status}>{status}</option>)}
          </Select>
          {serverError ? <p className="text-sm text-red-600 md:col-span-2">{serverError}</p> : null}
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Save Vehicle</Button>
          </div>
        </form>
      </Modal>
      <Modal open={Boolean(detail)} title="Vehicle Details" onClose={() => setDetail(null)}>
        {detail ? (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <p className="text-sm text-slate-600 dark:text-slate-400">Vehicle</p>
                <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-slate-100">{detail.nameModel}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">{detail.registrationNumber} | {detail.type}</p>
              </Card>
              <Card>
                <p className="text-sm text-slate-600 dark:text-slate-400">Operational Cost</p>
                <p className="mt-2 text-xl font-semibold text-amber-600 dark:text-amber-500">
                  {currency(getOperationalCost(detail.id, fuelLogs, maintenanceLogs, expenses).total)}
                </p>
              </Card>
            </div>
            <Card>
              <h3 className="mb-3 text-lg font-semibold text-slate-950 dark:text-slate-100">Linked Trips</h3>
              <div className="space-y-3">
                {trips.filter((trip) => trip.vehicleId === detail.id).slice(0, 5).map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-ink-850">
                    <span className="dark:text-slate-200">{trip.source} to {trip.destination}</span>
                    <StatusBadge value={trip.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
