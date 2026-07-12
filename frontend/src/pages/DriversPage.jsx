import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { z } from "zod";
import { useAppData } from "../context/AppDataContext";
import { useAccess } from "../hooks/useAccess";
import { formatDate, getLicenseState } from "../utils/dateHelpers";
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
  name: z.string().min(2),
  licenseNumber: z.string().min(3),
  licenseCategory: z.string().min(2),
  licenseExpiryDate: z.string().min(10),
  contactNumber: z.string().min(5),
  safetyScore: z.coerce.number().min(0).max(100),
  status: z.enum(["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"]),
});

export default function DriversPage() {
  const access = useAccess("drivers");
  const { drivers, trips, saveDriver, loading } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [filters, setFilters] = useState({ search: "", status: "ALL" });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { safetyScore: 90, status: "AVAILABLE" },
  });

  const rows = useMemo(
    () =>
      drivers.filter((driver) => {
        const query = filters.search.toLowerCase();
        return (
          (!query || driver.name.toLowerCase().includes(query) || driver.licenseNumber.toLowerCase().includes(query)) &&
          (filters.status === "ALL" || driver.status === filters.status)
        );
      }),
    [drivers, filters.search, filters.status],
  );

  function openCreate() {
    setEditing(null);
    reset({ name: "", licenseNumber: "", licenseCategory: "LMV", licenseExpiryDate: "", contactNumber: "", safetyScore: 90, status: "AVAILABLE" });
    setModalOpen(true);
  }

  function openEdit(driver) {
    setEditing(driver);
    reset(driver);
    setModalOpen(true);
  }

  async function onSubmit(values) {
    await saveDriver(values, editing?.id);
    setModalOpen(false);
  }

  if (loading) return <Skeleton className="h-96" />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Compliance and People"
        title="Drivers"
        description="Keep driver records, license validity, and safety scores visible for fleet managers and safety reviewers."
        actions={access === "full" ? <Button onClick={openCreate}>+ Add Driver</Button> : null}
      />
      <Card className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          <Input placeholder="Search by name or license no." value={filters.search} onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))} />
          <Select value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}>
            <option value="ALL">All statuses</option>
            {["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"].map((status) => <option key={status}>{status}</option>)}
          </Select>
        </div>
        {rows.length ? (
          <Table
            columns={[
              { key: "name", label: "Name" },
              { key: "licenseNumber", label: "License Number" },
              { key: "licenseCategory", label: "License Category" },
              { key: "licenseExpiryDate", label: "License Expiry Date" },
              { key: "contactNumber", label: "Contact Number" },
              { key: "safetyScore", label: "Safety Score" },
              { key: "status", label: "Status" },
              { key: "actions", label: "Actions" },
            ]}
            rows={rows}
            renderRow={(driver) => {
              const license = getLicenseState(driver.licenseExpiryDate);
              return (
                <tr key={driver.id}>
                  <td className="px-4 py-3">{driver.name}</td>
                  <td className="px-4 py-3">{driver.licenseNumber}</td>
                  <td className="px-4 py-3">{driver.licenseCategory}</td>
                  <td className={`px-4 py-3 ${license.tone === "red" ? "text-red-600" : license.tone === "amber" ? "text-amber-600" : "text-slate-700"}`}>
                    {formatDate(driver.licenseExpiryDate)}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{driver.contactNumber}</td>
                  <td className="px-4 py-3">{driver.safetyScore}</td>
                  <td className="px-4 py-3"><StatusBadge value={driver.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" className="px-3 py-2" onClick={() => setDetail(driver)}>View</Button>
                      {access === "full" ? <Button variant="secondary" className="px-3 py-2" onClick={() => openEdit(driver)}>Edit</Button> : null}
                    </div>
                  </td>
                </tr>
              );
            }}
          />
        ) : (
          <EmptyState title="No drivers found" description="Adjust the table filters or add a new driver profile." />
        )}
      </Card>
      <Modal open={modalOpen} title={editing ? "Edit Driver" : "Add Driver"} onClose={() => setModalOpen(false)}>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Name" error={errors.name?.message} {...register("name")} />
          <Input label="License Number" error={errors.licenseNumber?.message} {...register("licenseNumber")} />
          <Input label="License Category" error={errors.licenseCategory?.message} {...register("licenseCategory")} />
          <Input label="License Expiry Date" type="date" error={errors.licenseExpiryDate?.message} {...register("licenseExpiryDate")} />
          <Input label="Contact Number" error={errors.contactNumber?.message} {...register("contactNumber")} />
          <Input label="Safety Score" type="number" error={errors.safetyScore?.message} {...register("safetyScore")} />
          <Select label="Status" error={errors.status?.message} {...register("status")}>
            {["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"].map((status) => <option key={status}>{status}</option>)}
          </Select>
          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Save Driver</Button>
          </div>
        </form>
      </Modal>
      <Modal open={Boolean(detail)} title="Driver Profile" onClose={() => setDetail(null)}>
        {detail ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <p className="text-sm text-slate-600">Driver</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{detail.name}</p>
                <p className="mt-1 text-sm text-slate-500">{detail.licenseNumber} | Safety Score {detail.safetyScore}</p>
              </Card>
              <Card className="h-52">
                <h3 className="mb-4 text-lg font-semibold text-slate-950">Safety Score Trend</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[0, 1, 2, 3, 4].map((index) => ({ label: `P${index + 1}`, value: Math.max(65, detail.safetyScore - 4 + index) }))}>
                    <XAxis dataKey="label" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
            <Card>
              <h3 className="mb-4 text-lg font-semibold text-slate-950">Trip History</h3>
              <div className="space-y-3">
                {trips.filter((trip) => trip.driverId === detail.id).slice(0, 6).map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <span>{trip.source} to {trip.destination}</span>
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
