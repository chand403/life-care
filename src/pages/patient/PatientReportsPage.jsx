import React, { useState } from 'react';
import {
  FileCheck2,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  Calendar,
  Paperclip,
  Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { formatDate, formatDateTime } from '../../lib/utils.js';
import { ReportViewModal } from '../../components/reports/ReportViewModal.jsx';

export function PatientReportsPage() {
  const { user } = useAuth();
  const { reports, acknowledgeReport } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);

  const patientId = user?.patientId || 'PAT-2026-0001';

  const myReports = reports.filter(
    (r) => r.patientId === patientId || r.patientId === user?._id
  );

  const filteredReports = myReports.filter((r) => {
    const matchesSearch =
      r.reportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.department && r.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ? true : r.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Medical Reports & Doctor Prescriptions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Access certified consultation summaries, test evaluations, and acknowledge receipt of clinical reports.
          </p>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by diagnosis, doctor, report ID..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Segmented status filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-stretch sm:self-auto">
          {['ALL', 'SUBMITTED', 'RECEIVED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                statusFilter === status
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status === 'ALL' ? 'All Reports' : status === 'SUBMITTED' ? 'Awaiting Receipt' : 'Acknowledged'}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50/70">
                  <th className="py-3 px-4">Report ID</th>
                  <th className="py-3 px-4">Attending Doctor</th>
                  <th className="py-3 px-4">Encounter Date</th>
                  <th className="py-3 px-4">Clinical Diagnosis</th>
                  <th className="py-3 px-4">Attachments</th>
                  <th className="py-3 px-4">Receipt Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((report) => (
                  <tr key={report.reportId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                      {report.reportId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{report.doctorName}</p>
                      <p className="text-[11px] text-slate-500">{report.department}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 tabular-nums">
                      {formatDate(report.consultationDate)}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-900 font-medium">
                      {report.diagnosis}
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
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {report.status === 'Submitted' && (
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-md transition-colors shadow-2xs"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
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
            <p className="font-semibold text-slate-700 text-sm">No medical reports found</p>
            <p className="mt-1">
              Your attending physicians will publish your consultation summaries and prescriptions here after your encounters.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <ReportViewModal
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </div>
  );
}
