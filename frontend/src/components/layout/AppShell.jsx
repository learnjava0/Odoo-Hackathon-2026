import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed((value) => !value)}
        onClose={() => setMobileOpen(false)}
      />
      <div className={collapsed ? "transition-all duration-300 lg:pl-24" : "transition-all duration-300 lg:pl-72"}>
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="px-4 pb-10 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
