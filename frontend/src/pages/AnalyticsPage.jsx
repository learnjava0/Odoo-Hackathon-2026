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
import { Download, FileText, Info } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { exportToCsv } from "../utils/csvExport";
import { currency, getFleetUtilization, getFuelEfficiencyForVehicle, getVehicleRoi } from "../utils/calculations";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Skeleton } from "../components/ui/Skeleton";
import { StatCard } from "../components/ui/StatCard";
import { Table } from "../components/ui/Table";

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
      <PageHeader
        eyebrow="Performance Reporting"
        title="Analytics"
        description="Track efficiency, utilization, and asset returns. Revenue is estimated from completed trips using a mocked per-kilometer proxy for demo mode."
        actions={
          <>
            <Button variant="secondary" onClick={() => exportToCsv("fuel-efficiency.csv", fuelEfficiencyRows)}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button variant="ghost" disabled title="Coming soon">
              <FileText className="h-4 w-4" /> PDF Export
            </Button>
          </>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Fuel Efficiency" value={`${fuelEfficiencyRows[0]?.efficiency ?? "0.00"} km/l`} />
        <StatCard label="Fleet Utilization" value={`${getFleetUtilization(vehicles, trips).toFixed(1)}%`} accent="text-sky-600" />
        <StatCard label="Operational Cost" value={currency(operationalRows.reduce((sum, item) => sum + item.amount, 0))} accent="text-amber-600" />
        <StatCard label="Vehicle ROI" value={roiRows[0]?.roi ?? "0%"} accent="text-emerald-600" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="h-80">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Monthly Breakdown</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyBreakdown}>
              <CartesianGrid stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip formatter={(value) => currency(value)} />
              <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="h-80">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Top Cost / Asset Breakdown</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costPerVehicle} layout="vertical">
              <CartesianGrid stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="vehicle" type="category" stroke="#64748b" width={80} />
              <Tooltip formatter={(value) => currency(value)} />
              <Bar dataKey="value" fill="#38bdf8" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="h-80">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-950">Operational Cost Breakdown</h2>
            <div className="text-slate-500"><Info className="h-4 w-4" /></div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={operationalRows} dataKey="amount" nameKey="category" innerRadius={60} outerRadius={92}>
                {["#f59e0b", "#fb7185", "#38bdf8"].map((color) => <Cell key={color} fill={color} />)}
              </Pie>
              <Tooltip formatter={(value) => currency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Fuel Efficiency by Vehicle</h2>
          <Table
            columns={[{ key: "vehicle", label: "Vehicle" }, { key: "efficiency", label: "Distance / Fuel" }]}
            rows={fuelEfficiencyRows}
            renderRow={(row) => (
              <tr key={row.vehicle}>
                <td className="px-4 py-3">{row.vehicle}</td>
                <td className="px-4 py-3">{row.efficiency} km/l</td>
              </tr>
            )}
          />
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Fleet Utilization Over Time</h2>
          <Table
            columns={[{ key: "vehicle", label: "Vehicle" }, { key: "utilization", label: "Utilization" }]}
            rows={utilizationRows}
            renderRow={(row) => (
              <tr key={row.vehicle}>
                <td className="px-4 py-3">{row.vehicle}</td>
                <td className="px-4 py-3">{row.utilization}</td>
              </tr>
            )}
          />
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Operational Cost Breakdown</h2>
          <Table
            columns={[{ key: "category", label: "Category" }, { key: "amount", label: "Amount" }]}
            rows={operationalRows}
            renderRow={(row) => (
              <tr key={row.category}>
                <td className="px-4 py-3">{row.category}</td>
                <td className="px-4 py-3">{currency(row.amount)}</td>
              </tr>
            )}
          />
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Vehicle ROI</h2>
          <Table
            columns={[{ key: "vehicle", label: "Vehicle" }, { key: "roi", label: "ROI" }]}
            rows={roiRows}
            renderRow={(row) => (
              <tr key={row.vehicle}>
                <td className="px-4 py-3">{row.vehicle}</td>
                <td className="px-4 py-3">{row.roi}</td>
              </tr>
            )}
          />
        </Card>
      </div>
    </div>
  );
}
