import { Menu, Truck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getVisibleNavItems } from "../../constants/navigation";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/classNames";

export function Sidebar({ collapsed, onToggle, mobileOpen, onClose }) {
  const { user } = useAuth();
  const items = getVisibleNavItems(user.role);

  return (
    <>
      <div className={cn("fixed inset-0 z-30 bg-slate-950/70 lg:hidden", mobileOpen ? "block" : "hidden")} onClick={onClose} />
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-slate-800 bg-slate-950/95 px-3 py-4 backdrop-blur transition-all",
          collapsed ? "w-24" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/15 p-2 text-amber-400">
              <Truck className="h-5 w-5" />
            </div>
            {!collapsed ? (
              <div>
                <p className="font-semibold text-slate-100">TransitOps</p>
                <p className="text-xs text-slate-500">Fleet command center</p>
              </div>
            ) : null}
          </div>
          <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-800" onClick={onToggle}>
            <Menu className="h-4 w-4" />
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
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-900 hover:text-slate-100",
                    isActive && "bg-amber-500 text-slate-950 hover:bg-amber-500 hover:text-slate-950",
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
