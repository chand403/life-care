import React, { useState } from 'react';
import {
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  Stethoscope,
  Pill,
  Download,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { StatusBadge } from '../ui/StatusBadge.jsx';
import { LifeCareLogo } from '../ui/LifeCareLogo.jsx';
import { formatDate, formatDateTime } from '../../lib/utils.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';

export function ReportViewModal({ isOpen, onClose, report }) {
  const { user } = useAuth();
  const { acknowledgeReport } = useHospital();
  const [ackNotes, setAckNotes] = useState('');
  const [isSubmittingAck, setIsSubmittingAck] = useState(false);

  if (!report) return null;

  const isPatientOwner = user?.role === 'patient' && (user.patientId === report.patientId || user._id === report.patientId);
  const canAcknowledge = report.status === 'Submitted' && (isPatientOwner || user?.role === 'patient');

  const handleAcknowledge = async () => {
    setIsSubmittingAck(true);
    try {
      acknowledgeReport(report.reportId, ackNotes);
    } finally {
      setIsSubmittingAck(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Medical Consultation Report #${report.reportId}`}
      subtitle={`Consultation Date: ${formatDate(report.consultationDate)}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 print:p-0 print:space-y-4">
        {/* Hospital Letterhead */}
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LifeCareLogo size={44} showText={false} />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                LifeCare Hospital & Medical Center
              </h2>
              <p className="text-xs text-slate-500">
                Division of {report.department || 'Clinical Medicine'} · Chief Specialist: Dr. Chandna · JCI Accredited
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <StatusBadge status={report.status} />
          </div>
        </div>

        {/* Workflow Acknowledgement Banner */}
        {report.status === 'Received' ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Report Acknowledged & Received
              </h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                Acknowledged by patient on <strong className="tabular-nums">{formatDateTime(report.receivedAt || report.patientAcknowledgement?.timestamp)}</strong>.
              </p>
              {report.patientAcknowledgement?.notes && (
                <p className="text-xs text-emerald-800 italic mt-1 bg-emerald-100/50 p-2 rounded-md">
                  Patient note: "{report.patientAcknowledgement.notes}"
                </p>
              )}
            </div>
          </div>
        ) : canAcknowledge ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  Patient Action Required: Report Receipt Verification
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Your attending physician submitted this consultation report and prescription. Please review the diagnosis, dosage instructions, and attachments, then click below to acknowledge receipt.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <input
                type="text"
                value={ackNotes}
                onChange={(e) => setAckNotes(e.target.value)}
                placeholder="Optional confirmation note (e.g. 'Understood prescription instructions')"
                className="flex-1 text-xs px-3 py-2 border border-rose-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={handleAcknowledge}
                disabled={isSubmittingAck}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmittingAck ? 'Acknowledging...' : 'Acknowledge / Mark as Received'}</span>
              </button>
            </div>
          </div>
        ) : null}

        {/* Patient & Consultation Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">
              Patient Information
            </span>
            <p className="text-slate-900 font-bold text-sm">{report.patientName}</p>
            <p className="text-slate-600">
              <span className="text-slate-400">ID:</span> <span className="font-mono">{report.patientId}</span> · <span className="text-slate-400">DOB:</span> {report.patientDob}
            </p>
            <p className="text-slate-600">
              <span className="text-slate-400">Gender:</span> {report.patientGender} · <span className="text-slate-400">Blood Group:</span> <strong className="text-slate-900">{report.patientBloodGroup}</strong>
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px]">
              Attending Physician & Encounter
            </span>
            <p className="text-slate-900 font-bold text-sm">{report.doctorName}</p>
            <p className="text-slate-600">
              <span className="text-slate-400">Department:</span> {report.department}
            </p>
            <p className="text-slate-600">
              <span className="text-slate-400">Appointment ID:</span> <span className="font-mono">{report.appointmentId}</span> · <span className="text-slate-400">Date:</span> {formatDate(report.consultationDate)}
            </p>
          </div>
        </div>

        {/* Clinical Report Sections */}
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Chief Complaint
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed">{report.chiefComplaint}</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Presenting Symptoms & Clinical History
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed">{report.symptoms}</p>
          </div>

          <div className="border border-rose-200 bg-rose-50/40 rounded-xl p-4">
            <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1">
              Primary Diagnosis
            </h4>
            <p className="text-sm font-semibold text-rose-950 leading-relaxed">{report.diagnosis}</p>
          </div>

          {report.examination && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Physical Examination & Vitals Findings
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                {report.examination}
              </p>
            </div>
          )}

          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Treatment Plan & Clinical Management
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
              {report.treatmentPlan}
            </p>
          </div>

          {report.recommendations && (
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Doctor's Lifestyle & Dietary Recommendations
              </h4>
              <p className="text-xs text-slate-800 leading-relaxed">{report.recommendations}</p>
            </div>
          )}

          {report.followUpDate && (
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">Scheduled Follow-up Date:</span>
              <strong className="text-slate-900 font-semibold tabular-nums">{formatDate(report.followUpDate)}</strong>
            </div>
          )}
        </div>

        {/* Dynamic Prescription Table */}
        <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-rose-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Prescription (Rx)
            </h4>
          </div>

          {report.prescriptions && report.prescriptions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-medium bg-slate-50">
                    <th className="py-2.5 px-3">Medicine</th>
                    <th className="py-2.5 px-3">Dosage</th>
                    <th className="py-2.5 px-3">Frequency</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.prescriptions.map((rx, idx) => (
                    <tr key={rx.id || idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{rx.medicineName}</td>
                      <td className="py-2.5 px-3 text-slate-700">{rx.dosage}</td>
                      <td className="py-2.5 px-3 text-slate-700">{rx.frequency}</td>
                      <td className="py-2.5 px-3 text-slate-700 tabular-nums">{rx.duration}</td>
                      <td className="py-2.5 px-3 text-slate-600">{rx.instructions || 'As advised'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No oral medications prescribed for this visit.</p>
          )}
        </div>

        {/* Cloudinary Document Attachments */}
        {report.attachments && report.attachments.length > 0 && (
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Diagnostic Documents & Imaging Attachments ({report.attachments.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.attachments.map((doc, idx) => (
                <div
                  key={doc.publicId || idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-rose-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-800 truncate">{doc.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {doc.sizeBytes ? `${(doc.sizeBytes / (1024 * 1024)).toFixed(1)} MB · ` : ''}
                        {doc.fileType.includes('pdf') ? 'PDF Document' : 'Clinical Image'}
                      </p>
                    </div>
                  </div>
                  <a
                    href={doc.secureUrl || doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-white rounded-md transition-colors"
                    title="View Attachment"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor Signature Stamp */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-800">{report.doctorName}</p>
            <p className="text-[11px]">Authorized Medical Practitioner · License #MED-884920</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Submitted: {formatDateTime(report.submittedAt)}</p>
          </div>
          <div className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-right">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Verification Stamp</span>
            <span className="font-mono text-xs font-semibold text-rose-700 block">
              SEAL-VERIFIED-{report.reportId}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
