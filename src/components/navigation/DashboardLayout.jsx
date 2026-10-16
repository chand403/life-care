import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar.jsx';
import { DashboardTopBar } from './DashboardTopBar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export function DashboardLayout({ currentRoute, onNavigate, breadcrumbs, children }) {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased text-slate-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <DashboardSidebar
          currentRoute={currentRoute}
          onNavigate={onNavigate}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 flex">
            <DashboardSidebar
              currentRoute={currentRoute}
              onNavigate={onNavigate}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Viewport Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopBar
          onOpenMobile={() => setMobileSidebarOpen(true)}
          onNavigate={onNavigate}
          breadcrumbs={breadcrumbs}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
