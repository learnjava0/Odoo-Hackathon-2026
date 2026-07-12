import { formatDate } from "../utils/dateHelpers";
import PageHeader from "../components/ui/PageHeader";
import { useAppData } from "../context/AppDataContext";

function MaintenancePage() {
  const { maintenance } = useAppData();

  return (
    <div>
      <PageHeader title="Maintenance" description="Scheduled work and parts status scaffold for fleet upkeep." />
      <div className="grid gap-4 lg:grid-cols-2">
        {maintenance.map((job) => (
          <section key={job.id} className="panel panel-body">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{job.vehicle}</h3>
                <p className="mt-2 text-sm text-slate-400">Due {formatDate(job.dueDate)}</p>
              </div>
              <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.16em] text-cyan-400">
                {job.priority}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-300">{job.status}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export default MaintenancePage;
