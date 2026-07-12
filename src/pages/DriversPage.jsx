import PageHeader from "../components/ui/PageHeader";
import { useAppData } from "../context/AppDataContext";

function DriversPage() {
  const { drivers } = useAppData();

  return (
    <div>
      <PageHeader title="Drivers" description="Driver roster scaffold with availability and weekly trip counts." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {drivers.map((driver) => (
          <section key={driver.id} className="panel panel-body">
            <h3 className="text-lg font-semibold text-white">{driver.name}</h3>
            <p className="mt-2 text-sm text-slate-400">{driver.status}</p>
            <p className="mt-4 text-sm text-slate-300">Trips this week: {driver.tripsThisWeek}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export default DriversPage;
