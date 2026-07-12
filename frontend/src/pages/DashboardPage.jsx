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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-500">Operations Overview</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">FILTERS</span>
          <select className="input-base w-auto" value={filters.type} onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}>
            <option value="ALL">Vehicle Type: All</option>
            {[...new Set(vehicles.map((vehicle) => vehicle.type))].map((type) => <option key={type}>{type}</option>)}
          </select>
          <select className="input-base w-auto" value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}>
            <option value="ALL">Status: All</option>
            {["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"].map((status) => <option key={status}>{status}</option>)}
          </select>
          <select className="input-base w-auto" value={filters.region} onChange={(event) => setFilters((prev) => ({ ...prev, region: event.target.value }))}>
            <option value="ALL">Region: All</option>
            {["Dallas", "Seattle", "Miami", "Houston", "Boston"].map((region) => <option key={region}>{region}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Active Vehicles" value={number(vehicles.filter((item) => item.status !== "RETIRED").length)} accent="text-slate-950 dark:text-slate-100" />
        <StatCard label="Available Vehicles" value={number(vehicles.filter((item) => item.status === "AVAILABLE").length)} accent="text-emerald-600" />
        <StatCard label="Vehicles in Maintenance" value={number(vehicles.filter((item) => item.status === "IN_SHOP").length)} accent="text-amber-600" />
        <StatCard label="Active Trips" value={number(filteredTrips.filter((item) => item.status === "DISPATCHED").length)} accent="text-sky-600" />
        <StatCard label="Pending Trips" value={number(filteredTrips.filter((item) => item.status === "DRAFT").length)} accent="text-slate-950 dark:text-slate-100" />
        <StatCard label="Drivers On Duty" value={number(drivers.filter((item) => item.status === "ON_TRIP").length)} accent="text-slate-950 dark:text-slate-100" />
        <StatCard label="Fleet Utilization" value={`${number(getFleetUtilization(vehicles, trips), 1)}%`} accent="text-amber-600" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-950 dark:text-slate-100">Recent Trips</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{filteredTrips.length} visible</p>
          </div>
          {filteredTrips.length ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 dark:bg-ink-950">
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trip</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vehicle</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Driver</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-ink-900">
                  {filteredTrips.slice(0, 8).map((trip) => {
                    const tripVehicle = vehicles.find((v) => v.id === trip.vehicleId);
                    const tripDriver = drivers.find((d) => d.id === trip.driverId);
                    return (
                      <tr key={trip.id} className="hover:bg-slate-50 dark:hover:bg-ink-850">
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{trip.source} → {trip.destination}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{tripVehicle?.nameModel ?? "—"}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{tripDriver?.name ?? "—"}</td>
                        <td className="px-4 py-3"><StatusBadge value={trip.status} /></td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{trip.status === "DISPATCHED" ? `${trip.plannedDistance} km` : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No trips match the current filters" description="Adjust the dashboard filter bar to bring trips back into view." />
          )}
        </Card>
        <Card>
          <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-slate-100">Vehicle Status</h2>
          <div className="space-y-3">
            {statusBreakdown.map((segment) => (
              <div key={segment.name}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: segment.color }} />
                    <span className="text-slate-700 dark:text-slate-300">{segment.name}</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400">{segment.value}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(segment.value / Math.max(vehicles.length, 1)) * 100}%`, backgroundColor: segment.color }}
                  />
                </div>
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
