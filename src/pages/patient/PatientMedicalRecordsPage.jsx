import React, { useState } from 'react';
import {
  History,
  Calendar,
  Stethoscope,
  Pill,
  FileCheck2,
  Paperclip,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { formatDate } from '../../lib/utils.js';
import { ReportViewModal } from '../../components/reports/ReportViewModal.jsx';

export function PatientMedicalRecordsPage() {
  const { user } = useAuth();
  const { reports, appointments } = useHospital();
  const [selectedReport, setSelectedReport] = useState(null);

  const patientId = user?.patientId || 'PAT-2026-0001';

  // Merge reports and completed appointments into a unified chronological clinical timeline
  const timelineEvents = reports
    .filter((r) => r.patientId === patientId || r.patientId === user?._id)
    .map((r) => ({
      type: 'REPORT',
      id: r.reportId,
      date: r.consultationDate,
      doctor: r.doctorName,
      department: r.department,
      diagnosis: r.diagnosis,
      prescriptions: r.prescriptions || [],
      attachments: r.attachments || [],
      followUp: r.followUpDate,
      status: r.status,
      raw: r,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Chronological Medical & Clinical Timeline
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive longitudinal medical history, consultations, diagnoses, prescribed regimens, and diagnostic files.
        </p>
      </div>

      {/* Timeline view */}
      {timelineEvents.length > 0 ? (
        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {timelineEvents.map((event) => (
            <div key={event.id} className="relative group">
              {/* Timeline marker icon */}
              <div className="absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-teal-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                <div className="w-2 h-2 rounded-full bg-teal-600" />
              </div>

              {/* Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors">
                {/* Event Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {event.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {event.doctor} · <span className="text-slate-500 font-normal">{event.department}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {formatDate(event.date)}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-emerald-700 font-medium">{event.status}</span>
                  </div>
                </div>

                {/* Clinical Diagnosis & Notes */}
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                    Primary Clinical Diagnosis
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {event.diagnosis}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Treatment & Care Plan: {event.raw.treatmentPlan}
                  </p>
                </div>

                {/* Prescriptions (Rx) */}
                {event.prescriptions.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-lg space-y-2 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      <Pill className="w-3.5 h-3.5 text-teal-600" />
                      <span>Prescribed Medication Regimen ({event.prescriptions.length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {event.prescriptions.map((rx, idx) => (
                        <div key={idx} className="bg-white p-2 rounded border border-slate-200">
                          <p className="font-semibold text-slate-900">{rx.medicineName} ({rx.dosage})</p>
                          <p className="text-[11px] text-slate-500">{rx.frequency} · {rx.duration}</p>
                          {rx.instructions && (
                            <p className="text-[10px] text-slate-400 italic mt-0.5">{rx.instructions}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {event.attachments.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500">Clinical Files:</span>
                    {event.attachments.map((doc, idx) => (
                      <a
                        key={doc.publicId || idx}
                        href={doc.secureUrl || doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors"
                      >
                        <Paperclip className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{doc.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Footer Link */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  {event.followUp ? (
                    <span className="text-slate-500">
                      Follow-up: <strong className="text-slate-800">{formatDate(event.followUp)}</strong>
                    </span>
                  ) : <span />}
                  <button
                    onClick={() => setSelectedReport(event.raw)}
                    className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-900"
                  >
                    <span>View Complete Report Document</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 text-sm">No medical timeline events recorded</p>
          <p className="mt-1">
            As you complete clinical consultations, your timeline will document your health journey here.
          </p>
        </div>
      )}

      <ReportViewModal
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </div>
  );
}
