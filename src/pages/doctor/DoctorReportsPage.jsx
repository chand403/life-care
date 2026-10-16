import React, { useState } from 'react';
import {
  FileText,
  Search,
  Eye,
  Plus,
  Paperclip,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { formatDate } from '../../lib/utils.js';
import { ReportViewModal } from '../../components/reports/ReportViewModal.jsx';

export function DoctorReportsPage({ onNavigate }) {
  const { user } = useAuth();
  const { reports } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);

  const doctorId = user?.doctorId || 'DOC-101';
  const myReports = reports.filter((r) => r.doctorId === doctorId);

  const filtered = myReports.filter((r) => {
    const matchesSearch =
      r.reportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : r.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Authored Medical Reports & Prescriptions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review certified consultation summaries, track patient receipt acknowledgments, and inspect uploaded files.
          </p>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient, ID, or diagnosis..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-stretch sm:self-auto">
          {['ALL', 'SUBMITTED', 'RECEIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st === 'ALL'
                ? 'All Reports'
                : st === 'SUBMITTED'
                ? 'Awaiting Patient Ack'
                : 'Received by Patient'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50/70">
                  <th className="py-3 px-4">Report ID</th>
                  <th className="py-3 px-4">Patient Details</th>
                  <th className="py-3 px-4">Consultation Date</th>
                  <th className="py-3 px-4">Diagnosis</th>
                  <th className="py-3 px-4">Rx Medications</th>
                  <th className="py-3 px-4">Attachments</th>
                  <th className="py-3 px-4">Receipt Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((report) => (
                  <tr key={report.reportId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      {report.reportId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{report.patientName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{report.patientId}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 tabular-nums">
                      {formatDate(report.consultationDate)}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-slate-900 font-medium truncate">
                      {report.diagnosis}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {report.prescriptions?.length || 0} drugs
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {report.attachments && report.attachments.length > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                          <Paperclip className="w-3 h-3" />
                          <span>{report.attachments.length} files</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Document</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 text-sm">No reports matching filter</p>
          </div>
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
