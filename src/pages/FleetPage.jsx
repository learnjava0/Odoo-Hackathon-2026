import PageHeader from "../components/ui/PageHeader";
import { useAppData } from "../context/AppDataContext";

function FleetPage() {
  const { vehicles } = useAppData();

  return (
    <div>
      <PageHeader title="Fleet" description="Vehicle list scaffold with status and utilization placeholders." />
      <section className="panel overflow-hidden">
        <div className="panel-header">
          <h3 className="text-lg font-semibold text-white">Vehicles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/70 text-left text-slate-400">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td className="px-5 py-3 text-white">{vehicle.name}</td>
                  <td className="px-5 py-3 text-slate-300">{vehicle.type}</td>
                  <td className="px-5 py-3 text-slate-300">{vehicle.status}</td>
                  <td className="px-5 py-3 text-slate-300">{vehicle.utilization}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default FleetPage;
