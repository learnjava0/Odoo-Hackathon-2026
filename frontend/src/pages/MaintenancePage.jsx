import { useAppData } from "../context/AppDataContext";
import { formatDate } from "../utils/dateHelpers";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/StatusBadge";

function MaintenancePage() {
  const { maintenanceLogs = [] } = useAppData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Service Operations"
        title="Maintenance"
        description="Scheduled work, completion status, and service history for vehicles that need attention."
      />
      {maintenanceLogs.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {maintenanceLogs.map((job) => (
            <section key={job.id} className="panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                    {job.active ? "Open service" : "Closed service"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">{job.vehicleName ?? job.vehicle ?? `Vehicle #${job.vehicleId}`}</h3>
                  <p className="mt-2 text-sm text-slate-600">Due {formatDate(job.endDate ?? job.startDate)}</p>
                </div>
                <StatusBadge value={job.active ? "IN_SHOP" : "COMPLETED"} />
              </div>
              <div className="mt-5 border-l-2 border-slate-200 pl-4">
                <p className="text-sm font-medium text-slate-900">{job.description}</p>
                <p className="mt-2 text-sm text-slate-500">Service window started {formatDate(job.startDate)}</p>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState title="No maintenance records" description="Service history will appear here once maintenance activity is logged." />
      )}
    </div>
  );
}

export default MaintenancePage;
