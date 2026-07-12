import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useAppData } from "../context/AppDataContext";
import { getFleetUtilization, currency, number } from "../utils/calculations";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";
import { StatCard } from "../components/ui/StatCard";
import { StatusBadge } from "../components/ui/StatusBadge";

export default function DashboardPage() {
  const { user } = useAuth();
  const { vehicles, trips, drivers, maintenanceLogs, fuelLogs, expenses, loading } = useAppData();
  const [filters, setFilters] = useState({ type: "ALL", status: "ALL", region: "ALL" });

  const filteredTrips = useMemo(() => {
    const own = user.role === "DRIVER" ? trips.filter((trip) => trip.driverId === user.id) : trips;
    return own.filter((trip) => {
      const matchesType = filters.type === "ALL" || vehicles.find((vehicle) => vehicle.id === trip.vehicleId)?.type === filters.type;
      const matchesStatus = filters.status === "ALL" || trip.status === filters.status;
      const matchesRegion = filters.region === "ALL" || trip.destination.includes(filters.region) || trip.source.includes(filters.region);
      return matchesType && matchesStatus && matchesRegion;
    });
  }, [filters.region, filters.status, filters.type, trips, user.id, user.role, vehicles]);

  const statusBreakdown = [
    { name: "Available", value: vehicles.filter((item) => item.status === "AVAILABLE").length, color: "#22c55e" },
    { name: "On Trip", value: vehicles.filter((item) => item.status === "ON_TRIP").length, color: "#38bdf8" },
    { name: "In Shop", value: vehicles.filter((item) => item.status === "IN_SHOP").length, color: "#f59e0b" },
    { name: "Retired", value: vehicles.filter((item) => item.status === "RETIRED").length, color: "#ef4444" },
  ];

  const tripTrend = Array.from({ length: 6 }).map((_, index) => {
    const label = `M${index + 1}`;
    const count = trips.filter((trip, tripIndex) => tripIndex % 6 === index).length;
    return { label, trips: count + index };
  });

  const utilizationTrend = vehicles.map((vehicle, index) => ({
    label: vehicle.nameModel.split(" ")[0],
    utilization: Math.max(18, Math.min(96, 45 + index * 6 + (vehicle.status === "ON_TRIP" ? 10 : 0))),
  }));

  const costBreakdown = [
    { name: "Fuel", value: fuelLogs.reduce((sum, item) => sum + item.cost, 0), color: "#f59e0b" },
    { name: "Maintenance", value: maintenanceLogs.reduce((sum, item) => sum + item.cost, 0), color: "#fb7185" },
    { name: "Other", value: expenses.reduce((sum, item) => sum + item.amount, 0), color: "#38bdf8" },
  ];

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-36" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Operations Overview" title="Dashboard" description="Watch live fleet status, recent dispatch activity, and the metrics that matter most to operations." />
      <Card className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        <select className="input-base" value={filters.type} onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}>
          <option value="ALL">All vehicle types</option>
          {[...new Set(vehicles.map((vehicle) => vehicle.type))].map((type) => <option key={type}>{type}</option>)}
        </select>
        <select className="input-base" value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}>
          <option value="ALL">All trip statuses</option>
          {["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"].map((status) => <option key={status}>{status}</option>)}
        </select>
        <select className="input-base" value={filters.region} onChange={(event) => setFilters((prev) => ({ ...prev, region: event.target.value }))}>
          <option value="ALL">All regions</option>
          {["Dallas", "Seattle", "Miami", "Houston", "Boston"].map((region) => <option key={region}>{region}</option>)}
        </select>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <StatCard label="Active Vehicles" value={number(vehicles.filter((item) => item.status !== "RETIRED").length)} />
        <StatCard label="Available Vehicles" value={number(vehicles.filter((item) => item.status === "AVAILABLE").length)} accent="text-emerald-600" />
        <StatCard label="Vehicles in Maintenance" value={number(vehicles.filter((item) => item.status === "IN_SHOP").length)} accent="text-amber-600" />
        <StatCard label="Active Trips" value={number(filteredTrips.filter((item) => item.status === "DISPATCHED").length)} accent="text-sky-600" />
        <StatCard label="Pending Trips" value={number(filteredTrips.filter((item) => item.status === "DRAFT").length)} />
        <StatCard label="Drivers On Duty" value={number(drivers.filter((item) => item.status === "ON_TRIP").length)} />
        <StatCard label="Fleet Utilization" value={`${number(getFleetUtilization(vehicles, trips), 1)}%`} accent="text-amber-600" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Recent Trips</h2>
            <p className="text-sm text-slate-500">{filteredTrips.length} visible</p>
          </div>
          {filteredTrips.length ? (
            <div className="space-y-3">
              {filteredTrips.slice(0, 8).map((trip) => (
                <div key={trip.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-slate-950">{trip.source} to {trip.destination}</p>
                    <p className="text-sm text-slate-500">{number(trip.cargoWeight)} kg cargo | {number(trip.plannedDistance)} km</p>
                  </div>
                  <StatusBadge value={trip.status} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No trips match the current filters" description="Adjust the dashboard filter bar to bring trips back into view." />
          )}
        </Card>
        <Card>
          <h2 className="mb-5 text-lg font-semibold text-slate-950">Vehicle Status</h2>
          <div className="overflow-hidden rounded-full bg-slate-100">
            <div className="flex h-5">
              {statusBreakdown.map((segment) => (
                <div key={segment.name} style={{ width: `${(segment.value / Math.max(vehicles.length, 1)) * 100}%`, backgroundColor: segment.color }} />
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {statusBreakdown.map((segment) => (
              <div key={segment.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />{segment.name}</div>
                <span className="text-slate-600">{segment.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="h-80">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Trips Over Time</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tripTrend}>
              <CartesianGrid stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey="trips" stroke="#f59e0b" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-80">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Utilization Trend</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={utilizationTrend}>
              <CartesianGrid stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="utilization" fill="#38bdf8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-80">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Cost Breakdown</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={costBreakdown} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
                {costBreakdown.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(value) => currency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
