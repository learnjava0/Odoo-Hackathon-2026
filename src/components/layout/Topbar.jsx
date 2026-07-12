import { Bell, LogOut, Menu, Search } from "lucide-react";
import { ROLE_LABELS } from "../../constants/roles";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "../ui/Badge";

export function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const name = user.email.split("@")[0].replace(".", " ");

  return (
    <header className="sticky top-0 z-20 mb-6 flex items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/95 px-4 py-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden" onClick={onMenu}>
          <Menu className="h-4 w-4" />
        </button>
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input className="input-base w-80 pl-9" placeholder="Search vehicles, trips, drivers..." />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-200">
          <Bell className="h-4 w-4" />
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold capitalize text-slate-100">{name}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
        <Badge tone="amber">{ROLE_LABELS[user.role]}</Badge>
        <button className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-100" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
