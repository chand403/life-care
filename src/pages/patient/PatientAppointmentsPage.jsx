import React, { useState } from 'react';
import {
  Calendar,
  CalendarPlus,
  Clock,
  Search,
  Building,
  Video,
  XCircle,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { formatDate } from '../../lib/utils.js';
import { BookAppointmentModal } from '../../components/appointments/BookAppointmentModal.jsx';

export function PatientAppointmentsPage({ onNavigate }) {
  const { user } = useAuth();
  const { appointments, updateAppointmentStatus } = useHospital();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const patientId = user?.patientId || 'PAT-2026-0001';

  const myAppointments = appointments.filter(
    (a) => a.patientId === patientId || a.patientId === user?._id
  );

  const filtered = myAppointments.filter((a) => {
    const matchesSearch =
      a.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.doctorSpecialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.appointmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : a.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      updateAppointmentStatus(appointmentId, 'Cancelled');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Appointments & Consultations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View scheduled visits, check consultation modality, or book a new clinical encounter.
          </p>
        </div>
        <button
          onClick={() => setIsBookModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by physician, specialty, ID..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Segmented status filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-stretch sm:self-auto">
          {['ALL', 'CONFIRMED', 'COMPLETED', 'PENDING', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50/70">
                  <th className="py-3 px-4">Appointment ID</th>
                  <th className="py-3 px-4">Attending Physician</th>
                  <th className="py-3 px-4">Specialty</th>
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
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {apt.doctorName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {apt.doctorSpecialty}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 tabular-nums">
                      <div className="font-semibold text-slate-900">{formatDate(apt.date)}</div>
                      <div className="text-[11px] text-slate-500">{apt.time}</div>
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
                    <td className="py-3.5 px-4 text-right">
                      {(apt.status === 'Confirmed' || apt.status === 'Pending') && (
                        <button
                          onClick={() => handleCancelAppointment(apt.appointmentId)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          Cancel Visit
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
            <p className="mt-1">Book an appointment or adjust your active filters above.</p>
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-2xs"
            >
              Book an Appointment
            </button>
          </div>
        )}
      </div>

      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />
    </div>
  );
}
