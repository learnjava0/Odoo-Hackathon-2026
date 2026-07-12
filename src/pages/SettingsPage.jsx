import { useState } from "react";
import { toast } from "sonner";
import { NAV_ITEMS } from "../constants/navigation";
import { PAGE_ACCESS, ROLE_LABELS } from "../constants/roles";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";

const roleKeys = ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"];

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("TransitOps Logistics");
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
      <PageHeader eyebrow="Administration" title="Settings" description="General organization settings and the editable role-to-page access matrix shown in the approved mockup." actions={<Button onClick={() => toast.success("Settings saved locally for demo mode.")}>Save changes</Button>} />
      <Card className="grid gap-4 md:grid-cols-2">
        <Input label="Organization Name" value={orgName} onChange={(event) => setOrgName(event.target.value)} />
        <Input label="Primary Contact Email" value="ops@transitops.io" readOnly />
      </Card>
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-100">Role ↔ Page Access Matrix</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 text-left text-slate-400">Role</th>
                {NAV_ITEMS.map((item) => (
                  <th key={item.pageKey} className="px-4 py-3 text-left text-slate-400">{item.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roleKeys.map((role) => (
                <tr key={role} className="border-b border-slate-800/80">
                  <td className="px-4 py-3 font-medium text-slate-200">{ROLE_LABELS[role]}</td>
                  {NAV_ITEMS.map((item) => (
                    <td key={item.pageKey} className="px-4 py-3">
                      <button
                        type="button"
                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300"
                        onClick={() => toggleCell(item.pageKey, role)}
                      >
                        {matrix[item.pageKey][role] === "full" ? "✓" : matrix[item.pageKey][role] === "view" ? "👁" : "–"}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
