import { Outlet } from "react-router-dom";
import { navigationItems } from "../../constants/navigation";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/classNames";
import { Button } from "../ui/Button";
import NavItem from "../ui/NavItem";

function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-slate-800 bg-slate-950/95 px-5 py-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">TransitOps</p>
              <h1 className="mt-2 text-2xl font-semibold text-white">Fleet Control</h1>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-right">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{user?.role}</p>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {navigationItems.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </nav>

          <div className={cn("mt-6 pt-2", "lg:mt-10")}>
            <Button className="w-full justify-center" variant="ghost" onClick={logout}>
              Sign out
            </Button>
          </div>
        </aside>

        <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
