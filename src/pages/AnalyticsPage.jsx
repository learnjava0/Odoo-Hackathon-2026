import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PageHeader from "../components/ui/PageHeader";
import { useAppData } from "../context/AppDataContext";

function AnalyticsPage() {
  const { trips } = useAppData();
  const chartData = trips.map((trip) => ({
    route: trip.route,
    completionRate: trip.completionRate
  }));

  return (
    <div>
      <PageHeader title="Analytics" description="Recharts scaffold for route-level operational performance." />
      <section className="panel">
        <div className="panel-header">
          <h3 className="text-lg font-semibold text-white">Trip completion rate</h3>
        </div>
        <div className="h-[360px] px-2 py-4 sm:px-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid stroke="#1e293b" vertical={false} />
              <XAxis dataKey="route" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#1e293b",
                  borderRadius: "8px"
                }}
              />
              <Bar dataKey="completionRate" fill="#22d3ee" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default AnalyticsPage;
