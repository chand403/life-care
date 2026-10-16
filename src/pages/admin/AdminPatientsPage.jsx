import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { formatDate } from '../../lib/utils.js';
import { Modal } from '../../components/ui/Modal.jsx';

export function AdminPatientsPage({ onNavigate }) {
  const { user } = useAuth();
  const { patients, addPatient, updatePatient, appointments, reports } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Pagination (Requirement 10)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [inspectingPatient, setInspectingPatient] = useState(null);

  // New Patient Form State
  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    street: '',
    city: '',
    allergies: '',
    medicalConditions: '',
  });

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);

    const matchesBg = bloodGroupFilter === 'ALL' || p.bloodGroup === bloodGroupFilter;
    const matchesGender = genderFilter === 'ALL' || p.gender === genderFilter;
    const matchesStatus = statusFilter === 'ALL' || (p.status || 'Active') === statusFilter;

    return matchesSearch && matchesBg && matchesGender && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedPatients = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreatePatient = (e) => {
    e.preventDefault();
    addPatient({
      ...newPatient,
      address: { street: newPatient.street, city: newPatient.city },
      allergies: newPatient.allergies.split(',').map((s) => s.trim()).filter(Boolean),
      medicalConditions: newPatient.medicalConditions.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setIsAddModalOpen(false);
    setNewPatient({
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'Male',
      bloodGroup: 'O+',
      street: '',
      city: '',
      allergies: '',
      medicalConditions: '',
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingPatient) return;
    updatePatient(editingPatient.patientId, editingPatient);
    setEditingPatient(null);
  };

  const handleToggleStatus = (patient) => {
    const newStatus = patient.status === 'Inactive' ? 'Active' : 'Inactive';
    updatePatient(patient.patientId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Hospital Patients Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin oversight: Patient census, demographics, clinical admission records, and account statuses.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, patient ID, email, or phone..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <select
              value={bloodGroupFilter}
              onChange={(e) => {
                setBloodGroupFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="ALL">All Blood Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients Table (Requirement 10 Columns) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50/70">
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">DOB</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedPatients.map((patient) => (
                <tr key={patient.patientId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                    {patient.patientId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {patient.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{patient.email}</td>
                  <td className="py-3.5 px-4 text-slate-600 tabular-nums">{patient.phone}</td>
                  <td className="py-3.5 px-4 text-slate-600">{patient.gender}</td>
                  <td className="py-3.5 px-4 text-slate-600 tabular-nums">{patient.dateOfBirth}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{patient.bloodGroup}</td>
                  <td className="py-3.5 px-4 text-slate-500 tabular-nums">
                    {formatDate(patient.createdAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={patient.status || 'Active'} />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => setInspectingPatient(patient)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md"
                      title="View Details & Records"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingPatient({ ...patient })}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                      title="Edit Patient"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(patient)}
                      className={`p-1.5 rounded-md ${
                        patient.status === 'Inactive'
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-amber-600 hover:bg-amber-50'
                      }`}
                      title={patient.status === 'Inactive' ? 'Activate' : 'Deactivate'}
                    >
                      {patient.status === 'Inactive' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} patients
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-slate-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Hospital Patient Record"
        subtitle="Generates unique permanent Patient ID and patient portal access credentials"
      >
        <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={newPatient.email}
                onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={newPatient.phone}
                onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                value={newPatient.dateOfBirth}
                onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
              <select
                value={newPatient.gender}
                onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Blood Group *</label>
              <select
                value={newPatient.bloodGroup}
                onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Known Allergies</label>
            <input
              type="text"
              placeholder="e.g. Penicillin, Peanuts"
              value={newPatient.allergies}
              onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-rose-600 rounded-lg shadow-2xs"
            >
              Create Patient
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Patient Modal */}
      {editingPatient && (
        <Modal
          isOpen={Boolean(editingPatient)}
          onClose={() => setEditingPatient(null)}
          title={`Edit Patient: ${editingPatient.name}`}
          subtitle={`ID: ${editingPatient.patientId}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingPatient.name}
                  onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editingPatient.phone}
                  onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={editingPatient.dateOfBirth}
                  onChange={(e) => setEditingPatient({ ...editingPatient, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={editingPatient.bloodGroup}
                  onChange={(e) => setEditingPatient({ ...editingPatient, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingPatient(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-rose-600 rounded-lg shadow-2xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Inspect Patient Full Record */}
      {inspectingPatient && (
        <Modal
          isOpen={Boolean(inspectingPatient)}
          onClose={() => setInspectingPatient(null)}
          title={`Patient Complete File: ${inspectingPatient.name}`}
          subtitle={`ID: ${inspectingPatient.patientId} · Registered: ${formatDate(inspectingPatient.createdAt)}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl">
              <div>
                <p className="text-slate-500">Contact Email: <strong className="text-slate-900">{inspectingPatient.email}</strong></p>
                <p className="text-slate-500">Phone: <strong className="text-slate-900">{inspectingPatient.phone}</strong></p>
                <p className="text-slate-500">Gender / DOB: {inspectingPatient.gender} · {inspectingPatient.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-slate-500">Blood Group: <strong className="text-slate-900">{inspectingPatient.bloodGroup}</strong></p>
                <p className="text-slate-500">Emergency: {inspectingPatient.emergencyContact?.name || '—'} ({inspectingPatient.emergencyContact?.relation || '—'})</p>
                <p className="text-slate-500">Status: <strong className="text-rose-700">{inspectingPatient.status || 'Active'}</strong></p>
              </div>
            </div>

            <div className="border border-slate-200 p-3 rounded-xl">
              <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1">
                Clinical Disclosures & Allergies
              </span>
              <p className="text-rose-700 font-semibold">
                Allergies: {inspectingPatient.allergies?.join(', ') || 'None recorded'}
              </p>
              <p className="text-slate-700 mt-1">
                Conditions: {inspectingPatient.medicalConditions?.join(', ') || 'None'}
              </p>
              <p className="text-slate-600 mt-1">
                Medications: {inspectingPatient.currentMedications?.join(', ') || 'None'}
              </p>
            </div>

            {/* Encounters & Reports Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 p-3 rounded-xl">
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Appointments ({appointments.filter(a => a.patientId === inspectingPatient.patientId).length})
                </span>
                <div className="space-y-1.5">
                  {appointments.filter(a => a.patientId === inspectingPatient.patientId).slice(0, 3).map(a => (
                    <div key={a.appointmentId} className="flex justify-between text-[11px] text-slate-600">
                      <span>{a.doctorName}</span>
                      <span className="font-mono">{formatDate(a.date)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 p-3 rounded-xl">
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Medical Reports ({reports.filter(r => r.patientId === inspectingPatient.patientId).length})
                </span>
                <div className="space-y-1.5">
                  {reports.filter(r => r.patientId === inspectingPatient.patientId).slice(0, 3).map(r => (
                    <div key={r.reportId} className="flex justify-between text-[11px] text-slate-600">
                      <span className="truncate max-w-[120px]">{r.diagnosis}</span>
                      <span className="font-mono">{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
