import { useState } from "react";
import { toast } from "sonner";
import { NAV_ITEMS } from "../constants/navigation";
import { PAGE_ACCESS, ROLE_LABELS } from "../constants/roles";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";

const roleKeys = ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"];

const accessTone = {
  full: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
  view: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800",
  none: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700",
};

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("TransitOps Logistics");
  const [currency, setCurrency] = useState("INR (Rs)");
  const [distanceUnit, setDistanceUnit] = useState("Kilometers");
  const [matrix, setMatrix] = useState(PAGE_ACCESS);

  function toggleCell(pageKey, role) {
    const next = matrix[pageKey][role] === "none" ? "view" : matrix[pageKey][role] === "view" ? "full" : "none";
    setMatrix((prev) => ({
      ...prev,
      [pageKey]: { ...prev[pageKey], [role]: next },
    }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        description="General organization settings and role-based access controls."
        actions={<Button onClick={() => toast.success("Settings saved locally for demo mode.")}>Save changes</Button>}
      />
      <div className="grid gap-6 xl:grid-cols-[0.5fr_1.5fr]">
        <div className="panel p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">General</h2>
          <Input label="Depot Name" value={orgName} onChange={(e) => setOrgName(e.target.value)} />
          <Input label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
          <Input label="Distance Unit" value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)} />
          <Button onClick={() => toast.success("Settings saved.")} className="w-full justify-center bg-sky-500 text-white hover:bg-sky-600">
            Save changes
          </Button>
        </div>
        <div className="panel p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Role-Based Access (RBAC)</h2>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="pb-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Role</th>
                  {["Fleet", "Drivers", "Trips", "Fuel/Exp.", "Analytics"].map((label) => (
                    <th key={label} className="pb-3 px-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {roleKeys.map((role) => (
                  <tr key={role}>
                    <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{ROLE_LABELS[role]}</td>
                    {["fleet", "drivers", "trips", "fuelExpenses", "analytics"].map((pageKey) => (
                      <td key={pageKey} className="py-3 px-3">
                        <button
                          type="button"
                          className={`min-w-12 rounded-lg border px-2.5 py-1 text-xs font-semibold transition hover:opacity-80 ${accessTone[matrix[pageKey][role]]}`}
                          onClick={() => toggleCell(pageKey, role)}
                        >
                          {matrix[pageKey][role] === "full" ? "✓" : matrix[pageKey][role] === "view" ? "View" : "—"}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Click a cell to cycle: None → View → Full</p>
        </div>
      </div>
    </div>
  );
}
