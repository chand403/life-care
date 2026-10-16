import React, { useState } from 'react';
import {
  Calendar,
  CalendarPlus,
  FileCheck2,
  History,
  Stethoscope,
  UserCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Pill,
  Building,
  Video,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { formatDate } from '../../lib/utils.js';
import { ReportViewModal } from '../../components/reports/ReportViewModal.jsx';
import { BookAppointmentModal } from '../../components/appointments/BookAppointmentModal.jsx';

export function PatientDashboard({ onNavigate }) {
  const { user } = useAuth();
  const { appointments, reports, doctors } = useHospital();

  const [selectedReport, setSelectedReport] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const patientId = user?.patientId || 'PAT-2026-0001';

  // Filter patient's appointments
  const myAppointments = appointments
    .filter((a) => a.patientId === patientId || a.patientId === user?._id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Next upcoming confirmed or pending appointment
  const upcomingAppointment = myAppointments.find(
    (a) => (a.status === 'Confirmed' || a.status === 'Pending') && new Date(a.date) >= new Date(new Date().setHours(0,0,0,0))
  );

  // Filter patient's reports
  const myReports = reports
    .filter((r) => r.patientId === patientId || r.patientId === user?._id)
    .sort((a, b) => new Date(b.consultationDate) - new Date(a.consultationDate));

  const latestReport = myReports[0];
  const pendingReport = myReports.find((r) => r.status === 'Submitted');

  // Collect all unique prescriptions from all reports
  const allPrescriptions = myReports.flatMap((r) => r.prescriptions || []).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-300">
                Patient Health Portal
              </span>
              <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/90">
                {patientId}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs text-white/80 mt-1 max-w-xl">
              Access your medical consultations, schedule appointments with top specialists, and review doctor prescriptions securely.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-rose-900 bg-white hover:bg-rose-50 rounded-xl transition-all shadow-md self-start md:self-auto shrink-0"
        >
          <CalendarPlus className="w-4 h-4 text-rose-700" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Awaiting Report Acknowledgment Action Alert */}
      {pendingReport && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                Medical Consultation Report Awaiting Your Receipt Acknowledgment
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                {pendingReport.doctorName} submitted Medical Report #{pendingReport.reportId} on{' '}
                {formatDate(pendingReport.consultationDate)}. Review diagnosis and acknowledge receipt.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedReport(pendingReport)}
            className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto shadow-2xs"
          >
            Review & Acknowledge Now
          </button>
        </div>
      )}

      {/* Quick Actions Bar */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Book Visit', icon: CalendarPlus, action: () => setIsBookModalOpen(true), color: 'text-rose-600 bg-rose-50 border-rose-100' },
            { label: 'Recovery Gallery', icon: ImageIcon, action: () => onNavigate('/gallery'), color: 'text-rose-600 bg-rose-50 border-rose-100' },
            { label: 'My Appointments', icon: Calendar, action: () => onNavigate('/patient/appointments'), color: 'text-blue-600 bg-blue-50 border-blue-100' },
            { label: 'Medical Reports', icon: FileCheck2, action: () => onNavigate('/patient/reports'), color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
            { label: 'Health Timeline', icon: History, action: () => onNavigate('/patient/medical-records'), color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
            { label: 'Dr. Chandna', icon: Stethoscope, action: () => onNavigate('/doctors/DOC-CHANDNA'), color: 'text-violet-600 bg-violet-50 border-violet-100' },
            { label: 'Health Profile', icon: UserCheck, action: () => onNavigate('/patient/profile'), color: 'text-slate-600 bg-slate-50 border-slate-200' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action}
                className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.color} mb-2.5 transition-transform group-hover:scale-105`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-800 leading-tight">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Next Appointment & Latest Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Appointment Card (1 col) */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Upcoming Appointment
              </span>
              {upcomingAppointment && <StatusBadge status={upcomingAppointment.status} />}
            </div>

            {upcomingAppointment ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 flex flex-col items-center justify-center font-bold">
                    <span className="text-[10px] uppercase font-semibold leading-none">
                      {new Date(upcomingAppointment.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-lg leading-tight tabular-nums">
                      {new Date(upcomingAppointment.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {upcomingAppointment.doctorName}
                    </h4>
                    <p className="text-[11px] text-rose-700 font-medium">
                      {upcomingAppointment.doctorSpecialty}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {upcomingAppointment.appointmentId}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold tabular-nums">{upcomingAppointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    {upcomingAppointment.type === 'In-person' ? (
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <Video className="w-3.5 h-3.5 text-blue-500" />
                    )}
                    <span>{upcomingAppointment.type}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] pt-1 border-t border-slate-200/60 italic">
                    "{upcomingAppointment.reason}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No upcoming visits scheduled.</p>
                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="mt-3 text-xs text-rose-700 font-semibold hover:underline"
                >
                  Schedule an Appointment
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => onNavigate('/patient/appointments')}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              <span>View All Appointments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Latest Clinical Report & Prescriptions (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Report Highlight */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Latest Medical Report
              </span>
              {latestReport && (
                <div className="flex items-center gap-2">
                  <StatusBadge status={latestReport.status} />
                  <button
                    onClick={() => setSelectedReport(latestReport)}
                    className="text-xs font-semibold text-rose-700 hover:text-rose-900"
                  >
                    Open Full Report →
                  </button>
                </div>
              )}
            </div>

            {latestReport ? (
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Diagnosis
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {latestReport.diagnosis}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Attending: {latestReport.doctorName} · {formatDate(latestReport.consultationDate)}
                    </p>
                  </div>
                  {latestReport.status === 'Submitted' && (
                    <button
                      onClick={() => setSelectedReport(latestReport)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                    >
                      Acknowledge Receipt
                    </button>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 text-slate-700">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                    Treatment Summary
                  </span>
                  <p className="line-clamp-2 leading-relaxed">{latestReport.treatmentPlan}</p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No medical reports generated yet.</p>
              </div>
            )}
          </div>

          {/* Active Prescriptions Table */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Recent Prescriptions (Rx)
                </span>
              </div>
              <button
                onClick={() => onNavigate('/patient/medical-records')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                View History
              </button>
            </div>

            {allPrescriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 font-semibold border-b border-slate-100">
                      <th className="pb-2">Medicine</th>
                      <th className="pb-2">Dosage</th>
                      <th className="pb-2">Frequency</th>
                      <th className="pb-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allPrescriptions.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2 font-semibold text-slate-900">{p.medicineName}</td>
                        <td className="py-2 text-slate-600">{p.dosage}</td>
                        <td className="py-2 text-slate-600">{p.frequency}</td>
                        <td className="py-2 text-slate-600 tabular-nums">{p.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">No active prescriptions on file.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Appointment History Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Recent Appointments
          </span>
          <button
            onClick={() => onNavigate('/patient/appointments')}
            className="text-xs font-semibold text-rose-700 hover:text-rose-900"
          >
            All Appointments ({myAppointments.length})
          </button>
        </div>

        {myAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Encounter ID</th>
                  <th className="py-2.5 px-3">Physician</th>
                  <th className="py-2.5 px-3">Specialty</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Modality</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myAppointments.slice(0, 5).map((apt) => (
                  <tr key={apt.appointmentId} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-mono font-medium text-slate-600">
                      {apt.appointmentId}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{apt.doctorName}</td>
                    <td className="py-3 px-3 text-slate-600">{apt.doctorSpecialty}</td>
                    <td className="py-3 px-3 text-slate-700 tabular-nums">
                      {formatDate(apt.date)} at {apt.time}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{apt.type}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-4 text-center">
            No past appointment records.
          </p>
        )}
      </div>

      {/* Modals */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />

      <ReportViewModal
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </div>
  );
}
