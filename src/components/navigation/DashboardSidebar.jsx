import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  FileText,
  Clock,
  UserCheck,
  Users,
  Stethoscope,
  ShieldCheck,
  FileCheck2,
  Settings,
  History,
  LogOut,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { LifeCareLogo } from '../ui/LifeCareLogo.jsx';

export function DashboardSidebar({ currentRoute, onNavigate, onCloseMobile }) {
  const { user, logout, loginAsDemo } = useAuth();

  if (!user) return null;

  const isStaff = user.role === 'admin' || user.role === 'doctor';

  // Unified Staff (Doctor & Admin - Dr. Chandna) Navigation Links
  const staffLinks = [
    { label: 'Hospital & Clinical Dashboard', icon: LayoutDashboard, route: '/admin/dashboard' },
    { label: 'Manage Patient Records', icon: Users, route: '/admin/patients' },
    { label: 'Patient Photo Gallery Editor', icon: ImageIcon, route: '/admin/gallery' },
    { label: 'Clinical Reports & Rx (Dr. Chandna)', icon: FileText, route: '/admin/reports' },
    { label: 'Hospital Encounters & Visits', icon: Calendar, route: '/admin/appointments' },
    { label: 'Compliance Audit Trail', icon: History, route: '/admin/audit-logs' },
    { label: 'Hospital Settings', icon: Settings, route: '/admin/settings' },
  ];

  // Patient Navigation Links
  const patientLinks = [
    { label: 'Patient Dashboard', icon: LayoutDashboard, route: '/patient/dashboard' },
    { label: 'My Appointments with Dr. Chandna', icon: Calendar, route: '/patient/appointments' },
    { label: 'Book Appointment', icon: CalendarPlus, route: '/patient/appointments/book' },
    { label: 'Medical Reports & Prescriptions', icon: FileCheck2, route: '/patient/reports' },
    { label: 'Clinical Recovery Timeline', icon: History, route: '/patient/medical-records' },
    { label: 'Patient Recovery Photo Gallery', icon: ImageIcon, route: '/gallery' },
    { label: 'My Health Profile', icon: UserCheck, route: '/patient/profile' },
  ];

  const links = isStaff ? staffLinks : patientLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <button
          onClick={() => {
            onNavigate('/');
            onCloseMobile?.();
          }}
          className="flex items-center text-left"
        >
          <LifeCareLogo size={32} showText={true} />
        </button>
      </div>

      {/* Role Pill & Credentials */}
      <div className="px-4 py-2.5 bg-rose-50/50 border-b border-rose-100 flex items-center justify-between">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200 bg-white text-rose-800 uppercase tracking-wider">
          {isStaff ? 'Doctor & Admin Portal' : 'Patient Portal'}
        </span>
        <span className="text-[11px] font-mono font-bold text-rose-900">
          {isStaff ? 'DR-CHANDNA' : user.patientId || 'PATIENT'}
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;
          return (
            <button
              key={item.route}
              onClick={() => {
                onNavigate(item.route);
                onCloseMobile?.();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-rose-50/60 hover:text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
            </button>
          );
        })}
      </nav>

      {/* Demo Switcher */}
      <div className="p-3 mx-3 mb-3 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
          Portal Switcher
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => loginAsDemo('admin')}
            className={`py-1.5 text-[11px] rounded-lg font-bold border text-center transition-colors ${
              isStaff
                ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Staff (Dr. Chandna)
          </button>
          <button
            onClick={() => loginAsDemo('patient')}
            className={`py-1.5 text-[11px] rounded-lg font-bold border text-center transition-colors ${
              !isStaff
                ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Patient Portal
          </button>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={
              isStaff
                ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
                : user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            }
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border border-rose-200 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">
              {isStaff ? 'Dr. Chandna' : user.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {isStaff ? 'Doctor & Admin' : 'Patient'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          title="Sign Out"
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
