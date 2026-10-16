import React, { useState } from 'react';
import {
  Stethoscope,
  Search,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Award,
  DollarSign,
  Globe,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { StatusBadge } from '../../components/ui/StatusBadge.jsx';
import { formatCurrency } from '../../lib/utils.js';
import { Modal } from '../../components/ui/Modal.jsx';

export function AdminDoctorsPage({ onNavigate }) {
  const { doctors, appointments, addDoctor, updateDoctor, toggleDoctorStatus } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [inspectingDoctor, setInspectingDoctor] = useState(null);

  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    specialization: 'Cardiology',
    department: 'Cardiovascular Medicine',
    qualification: 'MD, Board Certified',
    experience: 8,
    consultationFee: 150,
    bio: '',
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    languages: 'English',
  });

  const departments = [...new Set(doctors.map((d) => d.department))];

  const filtered = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.doctorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      departmentFilter === 'ALL' || doc.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const handleCreateDoctor = (e) => {
    e.preventDefault();
    addDoctor({
      ...newDoctor,
      languages: newDoctor.languages.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingDoctor) return;
    updateDoctor(editingDoctor.doctorId, editingDoctor);
    setEditingDoctor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Medical Staff & Physician Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer hospital attending physicians, consultation pricing, specialties, and active credentials.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Attending Physician</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or specialization..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full sm:w-auto text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
        >
          <option value="ALL">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px] bg-slate-50/70">
                <th className="py-3 px-4">Doctor</th>
                <th className="py-3 px-4">Specialization</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Experience</th>
                <th className="py-3 px-4">Consultation Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((doc) => (
                <tr key={doc.doctorId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.profileImage}
                        alt={doc.name}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{doc.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{doc.doctorId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{doc.specialization}</td>
                  <td className="py-3.5 px-4 text-slate-600">{doc.department}</td>
                  <td className="py-3.5 px-4 text-slate-700 tabular-nums">{doc.experience} years</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                    {formatCurrency(doc.consultationFee)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={doc.isActive !== false ? 'Active' : 'Inactive'} />
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={() => setInspectingDoctor(doc)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md"
                      title="View Profile Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingDoctor({ ...doc })}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                      title="Edit Doctor"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleDoctorStatus(doc.doctorId)}
                      className={`p-1.5 rounded-md ${
                        doc.isActive === false
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-amber-600 hover:bg-amber-50'
                      }`}
                      title={doc.isActive === false ? 'Activate' : 'Deactivate'}
                    >
                      {doc.isActive === false ? (
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
      </div>

      {/* Add Doctor Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Attending Physician"
        subtitle="Enrolls specialist in hospital directory and creates doctor dashboard access"
      >
        <form onSubmit={handleCreateDoctor} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Doctor Name *</label>
              <input
                type="text"
                required
                value={newDoctor.name}
                onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                placeholder="Dr. Full Name"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Staff Email *</label>
              <input
                type="email"
                required
                value={newDoctor.email}
                onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                placeholder="dr.name@medpulse.org"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specialization *</label>
              <input
                type="text"
                required
                value={newDoctor.specialization}
                onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department *</label>
              <input
                type="text"
                required
                value={newDoctor.department}
                onChange={(e) => setNewDoctor({ ...newDoctor, department: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Qualifications *</label>
              <input
                type="text"
                required
                value={newDoctor.qualification}
                onChange={(e) => setNewDoctor({ ...newDoctor, qualification: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Consultation Fee ($) *</label>
              <input
                type="number"
                required
                value={newDoctor.consultationFee}
                onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
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
              className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg shadow-2xs"
            >
              Add Doctor
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <Modal
          isOpen={Boolean(editingDoctor)}
          onClose={() => setEditingDoctor(null)}
          title={`Edit Doctor: ${editingDoctor.name}`}
          subtitle={`ID: ${editingDoctor.doctorId}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Consultation Fee ($)</label>
                <input
                  type="number"
                  value={editingDoctor.consultationFee}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, consultationFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization</label>
                <input
                  type="text"
                  value={editingDoctor.specialization}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={editingDoctor.department}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, department: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bio</label>
              <textarea
                value={editingDoctor.bio}
                onChange={(e) => setEditingDoctor({ ...editingDoctor, bio: e.target.value })}
                rows={3}
                className="w-full p-2.5 border rounded-lg"
              />
            </div>
            <div className="pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="px-3 py-1.5 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg shadow-2xs"
              >
                Save Doctor Profile
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Inspect Doctor Modal */}
      {inspectingDoctor && (
        <Modal
          isOpen={Boolean(inspectingDoctor)}
          onClose={() => setInspectingDoctor(null)}
          title={`Physician Profile: ${inspectingDoctor.name}`}
          subtitle={`ID: ${inspectingDoctor.doctorId} · ${inspectingDoctor.specialization}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
              <img
                src={inspectingDoctor.profileImage}
                alt={inspectingDoctor.name}
                className="w-16 h-16 rounded-xl object-cover border"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{inspectingDoctor.name}</h4>
                <p className="text-indigo-700 font-medium">{inspectingDoctor.qualification}</p>
                <p className="text-slate-500">
                  {inspectingDoctor.experience} years clinical practice · Fee: {formatCurrency(inspectingDoctor.consultationFee)}
                </p>
              </div>
            </div>
            <p className="text-slate-700 leading-relaxed">{inspectingDoctor.bio}</p>
            <div className="border border-slate-200 p-3 rounded-lg">
              <span className="font-bold text-slate-800 block mb-1">Encounters on Record:</span>
              <p className="text-slate-600">
                Total Appointments:{' '}
                {appointments.filter((a) => a.doctorId === inspectingDoctor.doctorId).length}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
