import React, { useState } from 'react';
import {
  Users,
  Stethoscope,
  Calendar,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  History,
  Image as ImageIcon,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowRight,
  ShieldCheck,
  FileText,
  UserCheck,
  Upload,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { StatCard } from '../../components/ui/StatCard.jsx';
import { formatDate } from '../../lib/utils.js';
import { Modal } from '../../components/ui/Modal.jsx';
import { LifeCareLogo } from '../../components/ui/LifeCareLogo.jsx';
import { uploadMedicalDocumentToCloudinary } from '../../lib/cloudinary.js';

export function AdminDashboard({ onNavigate }) {
  const { user } = useAuth();
  const {
    analytics,
    appointments,
    auditLogs,
    patients,
    doctors,
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
  } = useHospital();

  // Search & Filter for "Manage Patient Records" section
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatientModal, setSelectedPatientModal] = useState(null);

  // Gallery Edit state on Dashboard
  const [isAddGalleryModalOpen, setIsAddGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [gallerySearch, setGallerySearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [newGalleryPhoto, setNewGalleryPhoto] = useState({
    title: '',
    category: 'Patient Recovery',
    patientId: patients[0]?.patientId || '',
    patientName: patients[0]?.name || '',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    description: '',
    tags: 'Recovery, Cardiology',
  });

  if (!analytics) return null;

  const recentAudits = auditLogs.slice(0, 6);

  // Filtered patients for the dashboard's "Manage Patient Records" section
  const filteredPatients = patients.filter((p) => {
    const q = patientSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.patientId.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.bloodGroup.toLowerCase().includes(q)
    );
  }).slice(0, 6);

  // Filtered gallery items for dashboard's "Gallery Edit" section
  const filteredGallery = galleryItems.filter((g) => {
    const q = gallerySearch.toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      (g.patientName && g.patientName.toLowerCase().includes(q))
    );
  }).slice(0, 6);

  const handlePatientSelectForGallery = (pid) => {
    const found = patients.find((p) => p.patientId === pid);
    setNewGalleryPhoto({
      ...newGalleryPhoto,
      patientId: pid,
      patientName: found ? found.name : '',
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const meta = await uploadMedicalDocumentToCloudinary(file);
      setNewGalleryPhoto((prev) => ({ ...prev, imageUrl: meta.url || meta.secureUrl }));
    } catch (err) {
      alert(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateGallerySubmit = (e) => {
    e.preventDefault();
    if (!newGalleryPhoto.title.trim() || !newGalleryPhoto.imageUrl.trim()) {
      alert('Please provide a title and an image URL.');
      return;
    }
    addGalleryItem({
      ...newGalleryPhoto,
      doctorName: 'Dr. Chandna',
      tags: newGalleryPhoto.tags
        ? newGalleryPhoto.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    });
    setIsAddGalleryModalOpen(false);
    setNewGalleryPhoto({
      title: '',
      category: 'Patient Recovery',
      patientId: patients[0]?.patientId || '',
      patientName: patients[0]?.name || '',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
      description: '',
      tags: 'Recovery, Vitals',
    });
  };

  const handleSaveGalleryEdit = (e) => {
    e.preventDefault();
    if (!editingGalleryItem) return;
    updateGalleryItem(editingGalleryItem.itemId, {
      title: editingGalleryItem.title,
      category: editingGalleryItem.category,
      patientName: editingGalleryItem.patientName,
      patientId: editingGalleryItem.patientId,
      description: editingGalleryItem.description,
      imageUrl: editingGalleryItem.imageUrl,
      isPublished: editingGalleryItem.isPublished,
    });
    setEditingGalleryItem(null);
  };

  const handleDeleteGallery = (itemId) => {
    if (window.confirm('Are you sure you want to remove this photo from the patient gallery?')) {
      deleteGalleryItem(itemId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Banner - LifeCare Logo & Brand Colors */}
      <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-rose-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-rose-400 bg-rose-900/50 border border-rose-700/60 px-2.5 py-0.5 rounded-full">
              Combined Staff & Clinical Director Console
            </span>
            <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-white/90">
              Dr. Chandna (Attending Physician & Admin)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            LifeCare Hospital Administration & Patient Records
          </h1>
          <p className="text-xs text-rose-100/80 max-w-2xl leading-relaxed">
            Centralized platform for comprehensive patient records management, certified clinical reports authored by Dr. Chandna, encounter schedules, and the hospital patient photo recovery gallery.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('/admin/patients')}
            className="px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-rose-50 rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-rose-600" />
            <span>Manage All Patients</span>
          </button>
          <button
            onClick={() => onNavigate('/admin/gallery')}
            className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Full Gallery Studio</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
        <div className="col-span-2 sm:col-span-2 lg:col-span-2">
          <StatCard
            label="Total Patients"
            value={analytics.totalPatients}
            helper="Registered medical records"
            icon={Users}
            color="rose"
          />
        </div>
        <div className="col-span-2 sm:col-span-2 lg:col-span-2">
          <StatCard
            label="Attending Physician"
            value="Dr. Chandna"
            helper="Chief Medical Specialist"
            icon={Stethoscope}
            color="rose"
          />
        </div>
        <div className="col-span-2 sm:col-span-2 lg:col-span-2">
          <StatCard
            label="Patient Gallery Photos"
            value={galleryItems.length}
            helper="Recovery & clinical milestones"
            icon={ImageIcon}
            color="amber"
          />
        </div>
        <div className="col-span-2 sm:col-span-2 lg:col-span-2">
          <StatCard
            label="Clinical Reports"
            value={analytics.totalReports}
            helper="Consultation reports & Rx"
            icon={FileCheck2}
            color="blue"
          />
        </div>
      </div>

      {/* Secondary Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Visits</span>
            <span className="text-xl font-bold text-slate-900 block tabular-nums">{analytics.todayCount}</span>
          </div>
          <Calendar className="w-5 h-5 text-rose-500" />
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Confirmed Future</span>
            <span className="text-xl font-bold text-rose-600 block tabular-nums">{analytics.confirmed}</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-rose-600" />
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Confirmation</span>
            <span className="text-xl font-bold text-amber-600 block tabular-nums">{analytics.pending}</span>
          </div>
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Completed Encounters</span>
            <span className="text-xl font-bold text-emerald-600 block tabular-nums">{analytics.completed}</span>
          </div>
          <UserCheck className="w-5 h-5 text-emerald-600" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* CORE SECTION 1: MANAGE PATIENT RECORDS (USER REQUIREMENT) */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded">
                Admin Core
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Manage Patient Records
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and update patient demographics, medical history, vital alerts, and consult notes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                placeholder="Search patient, ID, blood..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <button
              onClick={() => onNavigate('/admin/patients')}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 shrink-0"
            >
              <span>View All ({patients.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold">
                <th className="py-2.5 px-3">Patient ID</th>
                <th className="py-2.5 px-3">Patient Name</th>
                <th className="py-2.5 px-3">Blood Group</th>
                <th className="py-2.5 px-3">Emergency Contact</th>
                <th className="py-2.5 px-3">Primary Diagnosis / Alert</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.map((patient) => (
                <tr key={patient.patientId} className="hover:bg-rose-50/30 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-rose-700">
                    {patient.patientId}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {patient.name}
                    <span className="block text-[11px] font-normal text-slate-400">{patient.email}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 font-bold rounded">
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <span className="font-medium text-slate-800">{patient.emergencyContact?.name}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{patient.emergencyContact?.phone}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                    {patient.medicalConditions?.length > 0 ? (
                      <span className="text-slate-800">{patient.medicalConditions.join(', ')}</span>
                    ) : (
                      <span className="text-slate-400 italic">None recorded</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedPatientModal(patient)}
                      className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onNavigate(`/doctor/reports/create/${patient.patientId}`)}
                      className="px-2.5 py-1 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                    >
                      Write Rx/Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================== */}
      {/* CORE SECTION 2: GALLERY EDIT & SHOWCASE (USER BRIEF)   */}
      {/* ====================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded">
                Admin Core
              </span>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-rose-600" />
                Gallery Edit & Patient Photo Showcase
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage and publish patient recovery photos, clinical milestone achievements, and treatment outcomes under Dr. Chandna.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative w-48 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                placeholder="Search gallery photos..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <button
              onClick={() => setIsAddGalleryModalOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Patient Photo</span>
            </button>
            <button
              onClick={() => onNavigate('/gallery')}
              className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors shrink-0"
              title="View Public Gallery"
            >
              Public Gallery →
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGallery.map((item) => (
            <div
              key={item.itemId}
              className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 hover:border-rose-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs ${
                        item.isPublished
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {item.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Patient: {item.patientName || 'Clinical Case'}</span>
                    <span className="font-mono">{item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Admin Gallery Actions */}
              <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    updateGalleryItem(item.itemId, { isPublished: !item.isPublished })
                  }
                  className={`text-[11px] font-bold px-2 py-1 rounded transition-colors ${
                    item.isPublished
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                      : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {item.isPublished ? 'Set to Draft' : 'Publish'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingGalleryItem(item)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Edit Photo Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGallery(item.itemId)}
                    className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* CHARTS & ANALYTICS                                       */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Registrations and Appointments */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Hospital Activity Trajectory
              </h3>
              <p className="text-[11px] text-slate-400">
                Monthly patient intake and appointment volumes
              </p>
            </div>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              Current Year
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.monthlyRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    fontSize: 12,
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  name="Appointments"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  name="New Patients"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Doctor Workload Distribution (Dr. Chandna) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Dr. Chandna's Clinical Caseload
              </h3>
              <p className="text-[11px] text-slate-400">
                Total consultations and published medical reports
              </p>
            </div>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              Lead Specialist
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.doctorWorkloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    fontSize: 12,
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="appointments" name="Encounters" fill="#e11d48" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reports" name="Authored Reports" fill="#be123c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Real-time System Audit Trail */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-rose-600" />
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Hospital Compliance Audit Trail
              </h3>
              <p className="text-[11px] text-slate-400">
                Tracking report submissions, appointments, and gallery photo updates
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/admin/audit-logs')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800"
          >
            All Logs →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentAudits.map((log) => (
            <div key={log._id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-[10px] text-slate-400 shrink-0 tabular-nums">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">
                    {log.action.replace(/_/g, ' ')}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    By {log.userName} ({log.userRole}) · {log.resource} #{log.resourceId}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded shrink-0">
                {log.resource}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Patient Photo to Gallery */}
      <Modal
        isOpen={isAddGalleryModalOpen}
        onClose={() => setIsAddGalleryModalOpen(false)}
        title="Add Patient Photo to Recovery Gallery"
        subtitle="Upload and document a patient recovery milestone or clinical achievement"
      >
        <form onSubmit={handleCreateGallerySubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Milestone Title *
            </label>
            <input
              type="text"
              required
              value={newGalleryPhoto.title}
              onChange={(e) =>
                setNewGalleryPhoto({ ...newGalleryPhoto, title: e.target.value })
              }
              placeholder="e.g. Post-Therapy Cardiac Recovery Milestone"
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={newGalleryPhoto.category}
                onChange={(e) =>
                  setNewGalleryPhoto({ ...newGalleryPhoto, category: e.target.value })
                }
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option>Patient Recovery</option>
                <option>Clinical Milestone</option>
                <option>Pediatric Wellness</option>
                <option>Orthopedic Rehab</option>
                <option>Hospital Facilities</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Associated Patient
              </label>
              <select
                value={newGalleryPhoto.patientId}
                onChange={(e) => handlePatientSelectForGallery(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {patients.map((p) => (
                  <option key={p.patientId} value={p.patientId}>
                    {p.name} ({p.patientId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Patient Photo URL or Cloudinary Upload *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={newGalleryPhoto.imageUrl}
                onChange={(e) =>
                  setNewGalleryPhoto({ ...newGalleryPhoto, imageUrl: e.target.value })
                }
                placeholder="https://..."
                className="flex-1 p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5 text-rose-600" />
                <span>{isUploading ? 'Uploading...' : 'Browse'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Clinical Progress / Description
            </label>
            <textarea
              rows={3}
              value={newGalleryPhoto.description}
              onChange={(e) =>
                setNewGalleryPhoto({ ...newGalleryPhoto, description: e.target.value })
              }
              placeholder="Provide clinical context on the patient's recovery trajectory..."
              className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddGalleryModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
            >
              Save & Publish to Gallery
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Existing Gallery Photo */}
      {editingGalleryItem && (
        <Modal
          isOpen={true}
          onClose={() => setEditingGalleryItem(null)}
          title={`Edit Gallery Photo: ${editingGalleryItem.title}`}
          subtitle="Update caption, image asset, or publish status"
        >
          <form onSubmit={handleSaveGalleryEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={editingGalleryItem.title}
                onChange={(e) =>
                  setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })
                }
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={editingGalleryItem.category}
                  onChange={(e) =>
                    setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option>Patient Recovery</option>
                  <option>Clinical Milestone</option>
                  <option>Pediatric Wellness</option>
                  <option>Orthopedic Rehab</option>
                  <option>Hospital Facilities</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={editingGalleryItem.patientName || ''}
                  onChange={(e) =>
                    setEditingGalleryItem({
                      ...editingGalleryItem,
                      patientName: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Photo URL
              </label>
              <input
                type="url"
                required
                value={editingGalleryItem.imageUrl}
                onChange={(e) =>
                  setEditingGalleryItem({ ...editingGalleryItem, imageUrl: e.target.value })
                }
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Clinical Description
              </label>
              <textarea
                rows={3}
                value={editingGalleryItem.description || ''}
                onChange={(e) =>
                  setEditingGalleryItem({
                    ...editingGalleryItem,
                    description: e.target.value,
                  })
                }
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isPublishedCheck"
                checked={editingGalleryItem.isPublished !== false}
                onChange={(e) =>
                  setEditingGalleryItem({
                    ...editingGalleryItem,
                    isPublished: e.target.checked,
                  })
                }
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <label htmlFor="isPublishedCheck" className="font-semibold text-slate-700">
                Published on Public Gallery
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingGalleryItem(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Update Photo
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: View Patient Record Quick Details */}
      {selectedPatientModal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPatientModal(null)}
          title={`Patient Record: ${selectedPatientModal.name} (${selectedPatientModal.patientId})`}
          subtitle="Clinical demographics and emergency contact"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Date of Birth</span>
                <p className="font-semibold text-slate-900">{selectedPatientModal.dateOfBirth}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Gender</span>
                <p className="font-semibold text-slate-900">{selectedPatientModal.gender}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Blood Group</span>
                <p className="font-bold text-rose-600">{selectedPatientModal.bloodGroup}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Phone</span>
                <p className="font-mono text-slate-900">{selectedPatientModal.phone}</p>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">Medical Conditions</span>
              <p className="text-slate-600 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
                {selectedPatientModal.medicalConditions?.join(', ') || 'No chronic conditions recorded.'}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">Allergies & Contraindications</span>
              <p className="text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200 font-medium">
                {selectedPatientModal.allergies?.join(', ') || 'NKDA (No Known Drug Allergies)'}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">Current Medications</span>
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
                {selectedPatientModal.currentMedications?.join(', ') || 'None active.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPatientModal(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const pid = selectedPatientModal.patientId;
                  setSelectedPatientModal(null);
                  onNavigate(`/doctor/reports/create/${pid}`);
                }}
                className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
              >
                Write Consultation Report
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
