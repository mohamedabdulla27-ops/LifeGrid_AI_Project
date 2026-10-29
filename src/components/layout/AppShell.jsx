import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toasts from '../ui/Toasts';

/** Authenticated layout: sidebar + topbar + routed page content. */
export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="grid-bg flex min-h-screen bg-ink-950">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
      <Toasts />
    </div>
  );
}
