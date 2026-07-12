import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppData } from "../context/AppDataContext";
import { useAccess } from "../hooks/useAccess";
import { formatDate } from "../utils/dateHelpers";
import { currency } from "../utils/calculations";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Table } from "../components/ui/Table";

function MaintenancePage() {
  const { maintenanceLogs = [] } = useAppData();

  return (
    <div>
      <PageHeader title="Maintenance" description="Scheduled work and parts status scaffold for fleet upkeep." />
      <div className="grid gap-4 lg:grid-cols-2">
        {maintenanceLogs.map((job) => (
          <section key={job.id} className="panel panel-body">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{job.vehicle}</h3>
                <p className="mt-2 text-sm text-slate-400">Due {formatDate(job.endDate ?? job.startDate)}</p>
              </div>
              <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.16em] text-cyan-400">
                {job.active ? "Active" : "Closed"}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-300">{job.description}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

export default MaintenancePage;
