import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Upload,
  Calendar,
  User,
  Stethoscope,
  Pill,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { uploadMedicalDocumentToCloudinary } from '../../lib/cloudinary.js';

export function CreateReportPage({ patientId, appointmentId, onNavigate }) {
  const { user } = useAuth();
  const { patients, appointments, createMedicalReport } = useHospital();

  const patient = patients.find((p) => p.patientId === patientId || p._id === patientId) || patients[0];
  const linkedAppointment = appointments.find((a) => a.appointmentId === appointmentId);

  // Form State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [examination, setExamination] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Dynamic Prescriptions list
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'rx_init_1',
      medicineName: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
    },
  ]);

  // Attachments (Cloudinary uploaded)
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic prescription management
  const addPrescriptionRow = () => {
    setPrescriptions([
      ...prescriptions,
      {
        id: `rx_${Date.now()}`,
        medicineName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  const removePrescriptionRow = (id) => {
    if (prescriptions.length === 1) return;
    setPrescriptions(prescriptions.filter((p) => p.id !== id));
  };

  const updatePrescriptionRow = (id, field, value) => {
    setPrescriptions(
      prescriptions.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Cloudinary File Upload handler
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    try {
      for (const file of files) {
        const uploadedMeta = await uploadMedicalDocumentToCloudinary(file, {
          patientId: patient?.patientId,
          doctorId: user?.doctorId,
        });
        setAttachments((prev) => [...prev, uploadedMeta]);
      }
    } catch (err) {
      setUploadError(err.message || 'Error uploading file.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeAttachment = (publicId) => {
    setAttachments(attachments.filter((a) => a.publicId !== publicId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!diagnosis.trim() || !treatmentPlan.trim()) {
      alert('Please fill out the Diagnosis and Treatment Plan fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const validPrescriptions = prescriptions.filter((p) => p.medicineName.trim().length > 0);

      const newReport = createMedicalReport({
        patientId: patient.patientId,
        patientName: patient.name,
        doctorId: user?.doctorId || 'DOC-101',
        doctorName: user?.name || 'Dr. Attending Physician',
        appointmentId: appointmentId || linkedAppointment?.appointmentId || 'APT-CLINIC',
        consultationDate: new Date().toISOString().split('T')[0],
        chiefComplaint,
        symptoms,
        diagnosis,
        examination,
        treatmentPlan,
        recommendations,
        followUpDate,
        prescriptions: validPrescriptions,
        attachments,
        status: 'Submitted',
      });

      onNavigate('/doctor/reports');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('/doctor/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <span className="text-xs font-medium text-slate-400">
          Encounter: {linkedAppointment ? linkedAppointment.appointmentId : 'Walk-in Consultation'}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-5 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create Clinical Consultation Report & Prescription
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Document findings, diagnostic impressions, medications, and clinical recommendations
            </p>
          </div>
          <span className="text-xs font-mono font-medium bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-md self-start sm:self-auto">
            Status: Draft → Submitted
          </span>
        </div>

        {/* Patient Demographic Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 border-b border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
              Patient Name
            </span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">{patient?.name}</span>
            <span className="text-slate-500 font-mono text-[11px]">{patient?.patientId}</span>
          </div>
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
              Date of Birth / Gender
            </span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {patient?.dateOfBirth} ({patient?.gender})
            </span>
            <span className="text-slate-500">Blood Group: <strong>{patient?.bloodGroup}</strong></span>
          </div>
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
              Known Allergies
            </span>
            <span className="font-semibold text-rose-700 mt-0.5 block truncate">
              {patient?.allergies && patient.allergies.length > 0
                ? patient.allergies.join(', ')
                : 'None known'}
            </span>
            <span className="text-slate-500 truncate block">
              {patient?.medicalConditions?.join(', ') || 'No chronic conditions'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold block">
              Attending Physician
            </span>
            <span className="font-bold text-slate-900 mt-0.5 block">{user?.name}</span>
            <span className="text-teal-700 font-medium">{user?.doctorProfile?.specialization || 'Consultant'}</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Clinical Notes */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Clinical Findings & Evaluation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chief Complaint <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  required
                  placeholder="e.g. Chest tightness on exertion, migraine aura..."
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Clinical Diagnosis <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                  placeholder="e.g. Stage 1 Essential Hypertension (ICD-10 I10)..."
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Presenting Symptoms & Clinical History
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={2}
                placeholder="Describe onset, duration, severity, and aggravating/relieving factors..."
                className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Physical Examination & Objective Vitals
                </label>
                <textarea
                  value={examination}
                  onChange={(e) => setExamination(e.target.value)}
                  rows={3}
                  placeholder="BP: 138/88 mmHg, HR: 78 bpm, lungs clear, normal heart sounds..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Treatment Plan & Care Instructions <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  rows={3}
                  required
                  placeholder="Titrate pharmacotherapy, low-sodium regimen, daily vitals log..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lifestyle / Dietary Recommendations
                </label>
                <input
                  type="text"
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="e.g. 30 mins aerobic walking, sodium restriction..."
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Recommended Follow-up Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Prescription Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Prescription (Rx) Management
                </h3>
              </div>
              <button
                type="button"
                onClick={addPrescriptionRow}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-3">
              {prescriptions.map((rx, idx) => (
                <div
                  key={rx.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end"
                >
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Medicine Name
                    </label>
                    <input
                      type="text"
                      value={rx.medicineName}
                      onChange={(e) => updatePrescriptionRow(rx.id, 'medicineName', e.target.value)}
                      placeholder="e.g. Lisinopril"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Dosage
                    </label>
                    <input
                      type="text"
                      value={rx.dosage}
                      onChange={(e) => updatePrescriptionRow(rx.id, 'dosage', e.target.value)}
                      placeholder="e.g. 10mg"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Frequency
                    </label>
                    <input
                      type="text"
                      value={rx.frequency}
                      onChange={(e) => updatePrescriptionRow(rx.id, 'frequency', e.target.value)}
                      placeholder="e.g. Once daily"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={rx.duration}
                      onChange={(e) => updatePrescriptionRow(rx.id, 'duration', e.target.value)}
                      placeholder="e.g. 30 days"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Instructions
                    </label>
                    <input
                      type="text"
                      value={rx.instructions}
                      onChange={(e) => updatePrescriptionRow(rx.id, 'instructions', e.target.value)}
                      placeholder="After meals"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removePrescriptionRow(rx.id)}
                      disabled={prescriptions.length === 1}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-30 transition-colors"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Cloudinary Document Attachments */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  3. Cloudinary Document & Diagnostic Attachments
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">PDF, JPG, PNG up to 10MB</span>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Dropzone */}
            <label className="border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50/50 hover:bg-teal-50/20 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-700">
                Click to attach lab results, X-rays, or diagnostic scans
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Automatically uploaded securely to Cloudinary storage
              </span>
              <input
                type="file"
                multiple
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {isUploading && (
              <p className="text-xs text-teal-600 animate-pulse font-medium text-center">
                Uploading and hashing documents to Cloudinary...
              </p>
            )}

            {/* Uploaded items list */}
            {attachments.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {attachments.map((file) => (
                  <div
                    key={file.publicId}
                    className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {file.sizeBytes ? `${(file.sizeBytes / 1024).toFixed(0)} KB · ` : ''}
                          Cloudinary ID: {file.publicId}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(file.publicId)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('/doctor/dashboard')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Discard Draft
            </button>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Report...' : 'Submit Medical Report & Notify Patient'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
