import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  FileCheck2,
  Stethoscope,
  CheckCircle2,
  XCircle,
  FilePlus,
  Eye,
  AlertCircle,
  ChevronRight,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { formatDate } from '../../lib/utils.js';
import { ReportViewModal } from '../../components/reports/ReportViewModal.jsx';

export function DoctorDashboard({ onNavigate }) {
  const { user } = useAuth();
  const { appointments, reports, patients, updateAppointmentStatus } = useHospital();
  const [selectedReport, setSelectedReport] = useState(null);

  const doctorId = user?.doctorId || 'DOC-101';

  // Filter doctor's appointments
  const myAppointments = appointments
    .filter((a) => a.doctorId === doctorId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = myAppointments.filter((a) => a.date === todayStr);
  const upcomingAppointments = myAppointments.filter(
    (a) => a.date >= todayStr && a.status === 'Confirmed'
  );

  // Filter doctor's authored reports
  const myReports = reports.filter((r) => r.doctorId === doctorId);
  const awaitingPatientAck = myReports.filter((r) => r.status === 'Submitted');

  // Assigned unique patients
  const patientIds = [...new Set(myAppointments.map((a) => a.patientId))];
  const myPatients = patients.filter((p) => patientIds.includes(p.patientId));

  const handleStatusChange = (appointmentId, newStatus) => {
    updateAppointmentStatus(appointmentId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-800 via-rose-900 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-300">
                LifeCare Attending Physician & Clinical Director
              </span>
              <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/90">
                {doctorId || 'DOC-CHANDNA'}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Welcome, Dr. Chandna
            </h1>
            <p className="text-xs text-white/80 mt-1 max-w-xl">
              Chief Consultant Physician & Clinical Director · Manage your clinical schedule, review assigned patient histories, author prescriptions, and edit the recovery gallery.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('/admin/dashboard')}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-rose-50 rounded-xl transition-all shadow-md shrink-0"
          >
            <span>Admin & Gallery Console</span>
          </button>
          <button
            onClick={() => onNavigate('/doctor/appointments')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md shrink-0"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Consultation Schedule</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Consultations"
          value={todayAppointments.length}
          helper="Scheduled for current date"
          icon={Calendar}
          color="blue"
        />
        <StatCard
          label="Upcoming Visits"
          value={upcomingAppointments.length}
          helper="Confirmed future encounters"
          icon={Clock}
          color="rose"
        />
        <StatCard
          label="Assigned Patients"
          value={myPatients.length}
          helper="Patients with active encounters"
          icon={Users}
          color="slate"
        />
        <StatCard
          label="Reports Awaiting Ack"
          value={awaitingPatientAck.length}
          helper="Awaiting patient receipt verification"
          icon={FileCheck2}
          color="amber"
        />
      </div>

      {/* Main Grid: Today's Schedule & Pending Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Consultations (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Clinical Schedule
              </h3>
              <p className="text-[11px] text-slate-400">
                Manage appointment status and document patient consultation reports
              </p>
            </div>
            <button
              onClick={() => onNavigate('/doctor/appointments')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900"
            >
              All Appointments ({myAppointments.length}) →
            </button>
          </div>

          {myAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50">
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Modality</th>
                    <th className="py-2.5 px-3">Chief Reason</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Doctor Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myAppointments.slice(0, 6).map((apt) => (
                    <tr key={apt.appointmentId} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-900">{apt.patientName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{apt.patientId}</p>
                      </td>
                      <td className="py-3 px-3 tabular-nums">
                        <span className="font-semibold text-slate-800">{formatDate(apt.date)}</span>
                        <span className="block text-[11px] text-slate-500">{apt.time}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{apt.type}</td>
                      <td className="py-3 px-3 text-slate-700 max-w-xs truncate">{apt.reason}</td>
                      <td className="py-3 px-3">
                        <StatusBadge status={apt.status} />
                      </td>
                      <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                        {apt.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(apt.appointmentId, 'Confirmed')}
                            className="px-2 py-1 text-[11px] font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded shadow-2xs"
                          >
                            Confirm
                          </button>
                        )}
                        {apt.status === 'Confirmed' && (
                          <>
                            <button
                              onClick={() =>
                                onNavigate(
                                  `/doctor/reports/create/${apt.patientId}?appointmentId=${apt.appointmentId}`
                                )
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-2xs"
                            >
                              <FilePlus className="w-3 h-3" />
                              <span>Create Report</span>
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.appointmentId, 'Completed')}
                              className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 rounded"
                            >
                              Complete
                            </button>
                          </>
                        )}
                        {apt.status === 'Completed' && (
                          <button
                            onClick={() =>
                              onNavigate(
                                `/doctor/reports/create/${apt.patientId}?appointmentId=${apt.appointmentId}`
                              )
                            }
                            className="px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 rounded"
                          >
                            Add Addendum
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-6 text-center">
              No appointments on record yet.
            </p>
          )}
        </div>

        {/* Assigned Patients Quick Access (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Assigned Patients
            </h3>
            <button
              onClick={() => onNavigate('/doctor/patients')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900"
            >
              Directory →
            </button>
          </div>

          <div className="space-y-3">
            {myPatients.slice(0, 5).map((patient) => (
              <div
                key={patient.patientId}
                className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{patient.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {patient.patientId} · {patient.bloodGroup} · {patient.gender}
                  </p>
                  {patient.allergies && patient.allergies.length > 0 && (
                    <p className="text-[10px] text-rose-700 truncate mt-0.5">
                      Allergies: {patient.allergies.join(', ')}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onNavigate(`/doctor/reports/create/${patient.patientId}`)}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 bg-white border border-blue-200 rounded-lg shadow-2xs whitespace-nowrap"
                >
                  Write Report
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Authored Medical Reports Overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Authored Medical Reports & Prescriptions
            </h3>
            <p className="text-[11px] text-slate-400">
              Prescriptions, clinical findings, and receipt verification status
            </p>
          </div>
          <button
            onClick={() => onNavigate('/doctor/reports')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900"
          >
            All Reports ({myReports.length})
          </button>
        </div>

        {myReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50">
                  <th className="py-2.5 px-3">Report ID</th>
                  <th className="py-2.5 px-3">Patient Name</th>
                  <th className="py-2.5 px-3">Consultation Date</th>
                  <th className="py-2.5 px-3">Diagnosis</th>
                  <th className="py-2.5 px-3">Prescription Items</th>
                  <th className="py-2.5 px-3">Receipt Workflow</th>
                  <th className="py-2.5 px-3 text-right">Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myReports.slice(0, 5).map((r) => (
                  <tr key={r.reportId} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-mono font-medium text-slate-900">{r.reportId}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{r.patientName}</td>
                    <td className="py-3 px-3 text-slate-700 tabular-nums">
                      {formatDate(r.consultationDate)}
                    </td>
                    <td className="py-3 px-3 text-slate-900 font-medium max-w-xs truncate">
                      {r.diagnosis}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {r.prescriptions ? `${r.prescriptions.length} medications` : 'None'}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedReport(r)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-4 text-center">
            No medical reports published yet.
          </p>
        )}
      </div>

      <ReportViewModal
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </div>
  );
}
