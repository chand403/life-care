import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  FilePlus,
  Eye,
  Building,
  Video,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { formatDate } from '../../lib/utils.js';

export function DoctorAppointmentsPage({ onNavigate }) {
  const { user } = useAuth();
  const { appointments, updateAppointmentStatus } = useHospital();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const doctorId = user?.doctorId || 'DOC-101';

  const myAppointments = appointments.filter((a) => a.doctorId === doctorId);

  const filtered = myAppointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.appointmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : a.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (appointmentId, status) => {
    updateAppointmentStatus(appointmentId, status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Doctor Appointments Schedule
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review encounter requests, confirm consultations, mark completed visits, and create clinical reports.
        </p>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, ID, or reason..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-stretch sm:self-auto">
          {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL' ? 'All Visits' : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50/70">
                  <th className="py-3 px-4">Appointment ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Modality</th>
                  <th className="py-3 px-4">Reason for Visit</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((apt) => (
                  <tr key={apt.appointmentId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      {apt.appointmentId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{apt.patientName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{apt.patientId}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 tabular-nums">
                      <span className="font-semibold text-slate-900 block">{formatDate(apt.date)}</span>
                      <span className="text-[11px] text-slate-500">{apt.time}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-slate-700">
                        {apt.type === 'In-person' ? (
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <Video className="w-3.5 h-3.5 text-blue-500" />
                        )}
                        <span>{apt.type}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate">
                      {apt.reason}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {apt.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(apt.appointmentId, 'Confirmed')}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-2xs"
                        >
                          Confirm
                        </button>
                      )}
                      {(apt.status === 'Confirmed' || apt.status === 'Pending') && (
                        <button
                          onClick={() =>
                            onNavigate(
                              `/doctor/reports/create/${apt.patientId}?appointmentId=${apt.appointmentId}`
                            )
                          }
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs"
                        >
                          <FilePlus className="w-3.5 h-3.5" />
                          <span>Create Report</span>
                        </button>
                      )}
                      {apt.status === 'Confirmed' && (
                        <button
                          onClick={() => handleStatusChange(apt.appointmentId, 'Completed')}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
                        >
                          Mark Completed
                        </button>
                      )}
                      {(apt.status === 'Pending' || apt.status === 'Confirmed') && (
                        <button
                          onClick={() => handleStatusChange(apt.appointmentId, 'Cancelled')}
                          className="px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-md"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 text-sm">No appointments matching this query</p>
          </div>
        )}
      </div>
    </div>
  );
}
