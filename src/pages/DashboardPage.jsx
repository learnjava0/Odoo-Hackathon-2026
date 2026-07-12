import { Activity, Bus, Fuel, Wrench } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { useAppData } from "../context/AppDataContext";

const cards = [
  { key: "vehicles", label: "Vehicles", icon: Bus },
  { key: "drivers", label: "Drivers", icon: Activity },
  { key: "maintenance", label: "Maintenance Jobs", icon: Wrench },
  { key: "fuelExpenses", label: "Fuel Records", icon: Fuel }
];

function DashboardPage() {
  const data = useAppData();

  return (
    <div>
      <PageHeader title="Dashboard" description="Starter overview for fleet health, staffing, and operations." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <section key={card.key} className="panel panel-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{data[card.key].length}</p>
                </div>
                <div className="rounded-lg bg-slate-800 p-3 text-cyan-400">
                  <Icon size={20} />
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardPage;
