import React, { useState } from 'react';
import {
  Calendar,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Video,
  Eye,
  Edit,
  Filter,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { formatDate } from '../../lib/utils.js';
import { Modal } from '../../components/ui/Modal.jsx';

export function AdminAppointmentsPage() {
  const { appointments, updateAppointmentStatus, rescheduleAppointment, doctors } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');

  // Reschedule state
  const [reschedulingApt, setReschedulingApt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.appointmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : apt.status.toUpperCase() === statusFilter.toUpperCase();

    const matchesDoc =
      doctorFilter === 'ALL' || apt.doctorId === doctorFilter;

    return matchesSearch && matchesStatus && matchesDoc;
  });

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    setRescheduleError('');
    try {
      rescheduleAppointment(reschedulingApt.appointmentId, newDate, newTime);
      setReschedulingApt(null);
    } catch (err) {
      setRescheduleError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Hospital Encounters & Appointments Master
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Administer hospital schedules, override confirmation states, prevent double-bookings, and reschedule clinical sessions.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient, doctor, or ID..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="ALL">All Attending Physicians</option>
              {doctors.map((d) => (
                <option key={d.doctorId} value={d.doctorId}>
                  {d.name} ({d.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50/70">
                <th className="py-3 px-4">Appointment ID</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Attending Doctor</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Modality</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Admin Overrides</th>
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
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900">{apt.doctorName}</p>
                    <p className="text-[10px] text-slate-500">{apt.doctorSpecialty}</p>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 tabular-nums">
                    <span className="font-semibold text-slate-900 block">{formatDate(apt.date)}</span>
                    <span className="text-[11px] text-slate-500">{apt.time}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      {apt.type === 'In-person' ? (
                        <Building className="w-3 h-3 text-slate-400" />
                      ) : (
                        <Video className="w-3 h-3 text-blue-500" />
                      )}
                      <span>{apt.type}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {apt.reason}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={apt.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                    {apt.status === 'Pending' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.appointmentId, 'Confirmed')}
                        className="px-2 py-1 text-[11px] font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded shadow-2xs"
                      >
                        Confirm
                      </button>
                    )}
                    {(apt.status === 'Confirmed' || apt.status === 'Pending') && (
                      <button
                        onClick={() => {
                          setReschedulingApt(apt);
                          setNewDate(apt.date);
                          setNewTime(apt.time);
                          setRescheduleError('');
                        }}
                        className="px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 rounded border border-slate-200"
                      >
                        Reschedule
                      </button>
                    )}
                    {apt.status === 'Confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.appointmentId, 'Completed')}
                        className="px-2 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-50 rounded"
                      >
                        Complete
                      </button>
                    )}
                    {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.appointmentId, 'Cancelled')}
                        className="px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 rounded"
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
      </div>

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <Modal
          isOpen={Boolean(reschedulingApt)}
          onClose={() => setReschedulingApt(null)}
          title={`Reschedule Encounter #${reschedulingApt.appointmentId}`}
          subtitle={`Patient: ${reschedulingApt.patientName} · Physician: ${reschedulingApt.doctorName}`}
        >
          <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
            {rescheduleError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
                {rescheduleError}
              </div>
            )}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Date</label>
              <input
                type="date"
                required
                value={newDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Time Slot</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                {[
                  '09:00 AM',
                  '10:00 AM',
                  '11:00 AM',
                  '01:30 PM',
                  '02:00 PM',
                  '03:00 PM',
                  '04:00 PM',
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReschedulingApt(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg shadow-2xs"
              >
                Confirm Reschedule
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
