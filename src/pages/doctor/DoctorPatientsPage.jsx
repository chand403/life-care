import React, { useState } from 'react';
import {
  Users,
  Search,
  FilePlus,
  FileText,
  Calendar,
  AlertTriangle,
  History,
  Phone,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { formatDate } from '../../lib/utils.js';
import { Modal } from '../../components/ui/Modal.jsx';

export function DoctorPatientsPage({ onNavigate }) {
  const { user } = useAuth();
  const { patients, appointments, reports } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingPatient, setViewingPatient] = useState(null);

  const doctorId = user?.doctorId || 'DOC-101';

  // Only patients that have an appointment associated with this doctor (Requirement 17)
  const myDoctorAppointments = appointments.filter((a) => a.doctorId === doctorId);
  const patientIdsWithThisDoctor = [...new Set(myDoctorAppointments.map((a) => a.patientId))];

  const assignedPatients = patients.filter((p) =>
    patientIdsWithThisDoctor.includes(p.patientId)
  );

  const filtered = assignedPatients.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Assigned Patients Directory
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Restricted access: Only patients with scheduled or completed consultations under your care are listed.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assigned patients by name, ID, phone..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((patient) => {
          const patientReports = reports.filter(
            (r) => r.patientId === patient.patientId && r.doctorId === doctorId
          );
          const patientApts = myDoctorAppointments.filter(
            (a) => a.patientId === patient.patientId
          );

          return (
            <div
              key={patient.patientId}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {patient.name}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      {patient.patientId} · {patient.bloodGroup} · {patient.gender}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  {patient.allergies && patient.allergies.length > 0 && (
                    <div className="flex items-start gap-1.5 text-rose-700 text-[11px] pt-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span className="truncate">Allergies: {patient.allergies.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg flex items-center justify-between text-[11px] text-slate-500">
                  <span>{patientApts.length} Visits</span>
                  <span>·</span>
                  <span>{patientReports.length} Reports</span>
                  <span>·</span>
                  <span>DOB: {patient.dateOfBirth}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingPatient(patient)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => onNavigate(`/doctor/reports/create/${patient.patientId}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>Create Report</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 text-sm">No assigned patients found</p>
          <p className="mt-1">
            Patients who book consultations with your practice will appear in this directory automatically.
          </p>
        </div>
      )}

      {/* Patient Detail Modal */}
      {viewingPatient && (
        <Modal
          isOpen={Boolean(viewingPatient)}
          onClose={() => setViewingPatient(null)}
          title={`Patient Record: ${viewingPatient.name}`}
          subtitle={`ID: ${viewingPatient.patientId} · Date of Birth: ${viewingPatient.dateOfBirth}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
                  Demographics
                </span>
                <p className="font-semibold text-slate-900 mt-1">{viewingPatient.name}</p>
                <p className="text-slate-600">Gender: {viewingPatient.gender} · Blood: {viewingPatient.bloodGroup}</p>
                <p className="text-slate-600">Phone: {viewingPatient.phone}</p>
                <p className="text-slate-600">Email: {viewingPatient.email}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
                  Emergency Contact
                </span>
                <p className="font-semibold text-slate-900 mt-1">
                  {viewingPatient.emergencyContact?.name || 'Not provided'}
                </p>
                <p className="text-slate-600">
                  Relation: {viewingPatient.emergencyContact?.relation || '—'}
                </p>
                <p className="text-slate-600">
                  Phone: {viewingPatient.emergencyContact?.phone || '—'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="border border-slate-200 p-3.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Known Allergies
                </span>
                <p className="font-semibold text-rose-700">
                  {viewingPatient.allergies?.join(', ') || 'No known allergies'}
                </p>
              </div>

              <div className="border border-slate-200 p-3.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Chronic Medical Conditions
                </span>
                <p className="font-semibold text-slate-800">
                  {viewingPatient.medicalConditions?.join(', ') || 'No recorded conditions'}
                </p>
              </div>

              <div className="border border-slate-200 p-3.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Current Medications Disclosed
                </span>
                <p className="text-slate-700">
                  {viewingPatient.currentMedications?.join(', ') || 'None recorded'}
                </p>
              </div>

              {viewingPatient.medicalHistory && (
                <div className="border border-slate-200 p-3.5 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Surgical & Medical History
                  </span>
                  <p className="text-slate-700 whitespace-pre-line">
                    {viewingPatient.medicalHistory}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  const targetId = viewingPatient.patientId;
                  setViewingPatient(null);
                  onNavigate(`/doctor/reports/create/${targetId}`);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                Create Medical Consultation Report
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
