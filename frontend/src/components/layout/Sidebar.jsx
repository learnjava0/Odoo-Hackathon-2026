import { PanelLeftClose, PanelLeftOpen, Truck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getVisibleNavItems } from "../../constants/navigation";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/classNames";

export function Sidebar({ collapsed, onToggle, mobileOpen, onClose }) {
  const { user } = useAuth();
  const items = getVisibleNavItems(user.role);

  return (
    <>
      <div className={cn("fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm lg:hidden", mobileOpen ? "block" : "hidden")} onClick={onClose} />
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-slate-800 bg-slate-950 dark:bg-ink-950 dark:border-slate-800 px-3 py-4 text-slate-300 shadow-2xl shadow-slate-950/20 transition-all duration-300",
          collapsed ? "w-24" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-400 p-2 text-slate-950 shadow-lg shadow-amber-950/20">
              <Truck className="h-5 w-5" />
            </div>
            {!collapsed ? (
              <div>
                <p className="font-semibold text-white">TransitOps</p>
                <p className="text-xs text-slate-400">Fleet command center</p>
              </div>
            ) : null}
          </div>
          <button className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" onClick={onToggle}>
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/10 hover:text-white",
                    isActive && "bg-white text-slate-950 shadow-sm hover:bg-white hover:text-slate-950",
                    collapsed && "justify-center",
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed ? <span>{item.label}</span> : null}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
