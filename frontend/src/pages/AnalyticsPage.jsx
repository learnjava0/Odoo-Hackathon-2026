import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, FileText } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { exportToCsv } from "../utils/csvExport";
import { exportAnalyticsPdf } from "../utils/pdfExport";
import { currency, getFleetUtilization, getFuelEfficiencyForVehicle, getVehicleRoi } from "../utils/calculations";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { StatCard } from "../components/ui/StatCard";

export default function AnalyticsPage() {
  const { vehicles, trips, fuelLogs, maintenanceLogs, expenses, loading } = useAppData();

  if (loading) return <Skeleton className="h-96" />;

  const fuelEfficiencyRows = vehicles.map((vehicle) => ({
    vehicle: vehicle.nameModel,
    efficiency: getFuelEfficiencyForVehicle(vehicle.id, trips).toFixed(2),
  }));
  const utilizationRows = vehicles.map((vehicle, index) => ({
    vehicle: vehicle.nameModel,
    utilization: `${Math.max(22, Math.min(95, 48 + index * 5))}%`,
  }));
  const operationalRows = [
    { category: "Fuel", amount: fuelLogs.reduce((sum, item) => sum + item.cost, 0) },
    { category: "Maintenance", amount: maintenanceLogs.reduce((sum, item) => sum + item.cost, 0) },
    { category: "Other", amount: expenses.reduce((sum, item) => sum + item.amount, 0) },
  ];
  const roiRows = vehicles.map((vehicle) => ({
    vehicle: vehicle.nameModel,
    roi: `${getVehicleRoi(vehicle, trips, fuelLogs, maintenanceLogs).toFixed(1)}%`,
  }));
  const monthlyBreakdown = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((label, index) => ({
    label,
    value: 3000 + index * 540 + (index % 2) * 240,
  }));
  const costPerVehicle = vehicles.slice(0, 6).map((vehicle) => ({
    vehicle: vehicle.nameModel.split(" ")[0],
    value:
      fuelLogs.filter((item) => item.vehicleId === vehicle.id).reduce((sum, item) => sum + item.cost, 0) +
      maintenanceLogs.filter((item) => item.vehicleId === vehicle.id).reduce((sum, item) => sum + item.cost, 0),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-500">Performance Reporting</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Reports & Analytics</h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">ROI = Revenue − Maintenance − Fuel / Acquisition Cost</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => exportToCsv("fuel-efficiency.csv", fuelEfficiencyRows)}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button variant="ghost" onClick={() => exportAnalyticsPdf({
            fuelEfficiencyRows,
            operationalRows,
            roiRows,
            costPerVehicle,
            monthlyBreakdown,
            kpis: {
              fuelEfficiency: `${fuelEfficiencyRows[0]?.efficiency ?? "0.00"} km/l`,
              fleetUtilization: `${getFleetUtilization(vehicles, trips).toFixed(1)}%`,
              operationalCost: currency(operationalRows.reduce((sum, item) => sum + item.amount, 0)),
              vehicleRoi: roiRows[0]?.roi ?? "0%",
            },
          })}>
            <FileText className="h-4 w-4" /> PDF Export
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Fuel Efficiency" value={`${fuelEfficiencyRows[0]?.efficiency ?? "0.00"} km/l`} />
        <StatCard label="Fleet Utilization" value={`${getFleetUtilization(vehicles, trips).toFixed(1)}%`} accent="text-sky-600" />
        <StatCard label="Operational Cost" value={currency(operationalRows.reduce((sum, item) => sum + item.amount, 0))} accent="text-amber-600" />
        <StatCard label="Vehicle ROI" value={roiRows[0]?.roi ?? "0%"} accent="text-emerald-600" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-slate-100">Monthly Revenue</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBreakdown} barCategoryGap="30%">
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => currency(value)} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-slate-100">Top Cost / Fleet Vehicles</h2>
          <div className="space-y-3">
            {costPerVehicle.sort((a, b) => b.value - a.value).slice(0, 5).map((item, i) => {
              const maxVal = Math.max(...costPerVehicle.map((c) => c.value), 1);
              const barColors = ["#ef4444", "#f97316", "#3b82f6", "#22c55e", "#a855f7"];
              return (
                <div key={item.vehicle}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.vehicle}</span>
                    <span className="text-slate-500 dark:text-slate-400">{currency(item.value)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(item.value / maxVal) * 100}%`, backgroundColor: barColors[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-slate-100">Fuel Efficiency</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="pb-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Vehicle</th>
                <th className="pb-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">km/l</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {fuelEfficiencyRows.map((row) => (
                <tr key={row.vehicle}>
                  <td className="py-2.5 text-slate-800 dark:text-slate-200">{row.vehicle}</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400">{row.efficiency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-slate-100">Operational Cost</h2>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={operationalRows} dataKey="amount" nameKey="category" innerRadius={40} outerRadius={60}>
                  {["#f59e0b", "#fb7185", "#38bdf8"].map((color) => <Cell key={color} fill={color} />)}
                </Pie>
                <Tooltip formatter={(value) => currency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1">
            {operationalRows.map((row, i) => (
              <div key={row.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ["#f59e0b","#fb7185","#38bdf8"][i] }} />
                  <span className="text-slate-600 dark:text-slate-400">{row.category}</span>
                </div>
                <span className="font-medium text-slate-800 dark:text-slate-200">{currency(row.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-base font-semibold text-slate-950 dark:text-slate-100">Vehicle ROI</h2>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="pb-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Vehicle</th>
                <th className="pb-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {roiRows.map((row) => (
                <tr key={row.vehicle}>
                  <td className="py-2.5 text-slate-800 dark:text-slate-200">{row.vehicle}</td>
                  <td className="py-2.5 font-semibold text-emerald-600">{row.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
