import { Bell, LogOut, Menu, Plus, Search, Moon, Sun } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getVisibleNavItems, NAV_ITEMS } from "../../constants/navigation";
import { ROLE_LABELS } from "../../constants/roles";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Badge } from "../ui/Badge";

export function Topbar({ onMenu }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const name = user.email.split("@")[0].replace(".", " ");
  const active = useMemo(
    () => NAV_ITEMS.find((item) => item.path === location.pathname) ?? NAV_ITEMS[0],
    [location.pathname],
  );
  const quickActionPath = useMemo(() => {
    const visibleItems = getVisibleNavItems(user.role);
    return visibleItems.find((item) => item.path === "/trips")?.path ?? visibleItems[0]?.path ?? "/dashboard";
  }, [user.role]);

  return (
    <header className="sticky top-0 z-20 mb-6 border-b border-slate-200 bg-slate-50/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-ink-950/90 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={onMenu}>
            <Menu className="h-4 w-4" />
          </button>
          <div className="hidden min-w-0 sm:block">
            <p className="text-xs font-medium text-slate-500">Workspace / {active.label}</p>
            <p className="truncate text-lg font-semibold text-slate-950">{active.label}</p>
          </div>
        </div>
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input className="input-base w-80 pl-9" placeholder="Search vehicles, trips, drivers..." />
        </div>
        <button
          className="hidden items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 xl:inline-flex"
          onClick={() => navigate(quickActionPath)}
        >
          <Plus className="h-4 w-4" />
          Quick action
        </button>
        <button 
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:text-slate-950 dark:border-slate-800 dark:bg-ink-900 dark:text-slate-400 dark:hover:text-slate-200"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:text-slate-900 dark:border-slate-800 dark:bg-ink-900 dark:text-slate-400 dark:hover:text-slate-200">
          <Bell className="h-4 w-4" />
        </button>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold capitalize text-slate-950 dark:text-slate-100">{name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
        <Badge tone="amber">{ROLE_LABELS[user.role]}</Badge>
        <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:text-slate-950 dark:border-slate-800 dark:bg-ink-900 dark:text-slate-400 dark:hover:text-slate-200" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
