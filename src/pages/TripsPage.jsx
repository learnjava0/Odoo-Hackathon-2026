import { formatDate } from "../utils/dateHelpers";
import PageHeader from "../components/ui/PageHeader";
import { useAppData } from "../context/AppDataContext";

function TripsPage() {
  const { trips } = useAppData();

  return (
    <div>
      <PageHeader title="Trips" description="Trip operations scaffold with route, date, and completion placeholders." />
      <section className="grid gap-4 lg:grid-cols-3">
        {trips.map((trip) => (
          <article key={trip.id} className="panel panel-body">
            <p className="text-xs uppercase tracking-[0.16em] text-cyan-400">{trip.status}</p>
            <h3 className="mt-3 text-lg font-semibold text-white">{trip.route}</h3>
            <p className="mt-2 text-sm text-slate-400">{formatDate(trip.date)}</p>
            <p className="mt-5 text-sm text-slate-300">Completion rate: {trip.completionRate}%</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default TripsPage;
