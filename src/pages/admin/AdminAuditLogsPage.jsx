import React, { useState } from 'react';
import {
  History,
  Search,
  Shield,
  Filter,
  Download,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { formatDateTime } from '../../lib/utils.js';

export function AdminAuditLogsPage() {
  const { auditLogs } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceFilter, setResourceFilter] = useState('ALL');

  const filtered = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resourceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesResource =
      resourceFilter === 'ALL' || log.resource === resourceFilter;

    return matchesSearch && matchesResource;
  });

  const resources = [...new Set(auditLogs.map((l) => l.resource))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            System Security & Compliance Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of sensitive clinical workflows, report acknowledgments, appointment modifications, and access events.
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action, user, or resource ID..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          className="w-full sm:w-auto text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
        >
          <option value="ALL">All Resource Types</option>
          {resources.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50/70">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Resource ID</th>
                <th className="py-3 px-4">Event Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filtered.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 text-slate-500 tabular-nums">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                    {log.userName}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                        log.userRole === 'admin'
                          ? 'bg-indigo-50 text-indigo-700'
                          : log.userRole === 'doctor'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-sans">
                    {log.resource}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-bold">
                    {log.resourceId}
                  </td>
                  <td className="py-3 px-4 text-[10px] text-slate-500 max-w-xs truncate">
                    {JSON.stringify(log.metadata || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
