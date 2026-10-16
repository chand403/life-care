import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Check,
  AlertCircle,
  Video,
  Building,
} from 'lucide-react';
import { Modal } from '../ui/Modal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { formatCurrency } from '../../lib/utils.js';

export function BookAppointmentModal({ isOpen, onClose, preselectedDoctorId = null }) {
  const { user } = useAuth();
  const { doctors, bookAppointment, patients } = useHospital();

  const activeDoctors = doctors.filter((d) => d.isActive !== false);

  const [selectedDoctorId, setSelectedDoctorId] = useState(preselectedDoctorId || activeDoctors[0]?.doctorId || 'DOC-CHANDNA');
  const [selectedPatientId, setSelectedPatientId] = useState(user?.patientId || user?._id || patients[0]?.patientId);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('10:00 AM');
  const [type, setType] = useState('In-person');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const selectedDoctor = activeDoctors.find((d) => d.doctorId === selectedDoctorId) || activeDoctors[0];

  const timeSlots = selectedDoctor?.availability?.timeSlots || [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:30 PM',
    '02:30 PM',
    '03:30 PM',
    '04:30 PM',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setBookingError('');

    if (!reason.trim()) {
      setBookingError('Please enter a brief reason for your consultation.');
      return;
    }

    setIsSubmitting(true);
    try {
      const patientId = user?.role === 'patient' ? (user.patientId || 'PAT-2026-0001') : selectedPatientId;
      bookAppointment({
        patientId,
        doctorId: selectedDoctor?.doctorId || 'DOC-CHANDNA',
        date,
        time,
        type,
        reason,
        notes,
      });
      onClose();
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Doctor Appointment"
      subtitle="Select appointment date, consultation modality, and available time slot with Dr. Chandna"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {bookingError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{bookingError}</span>
          </div>
        )}

        {/* If Admin or Doctor is booking on behalf of a patient */}
        {user?.role === 'admin' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Patient
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {patients.map((p) => (
                <option key={p.patientId} value={p.patientId}>
                  {p.name} ({p.patientId}) - {p.phone}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Doctor Selection (Featuring Dr. Chandna) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Attending Specialist
          </label>
          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedDoctor?.profileImage}
                alt={selectedDoctor?.name || 'Dr. Chandna'}
                className="w-12 h-12 rounded-xl object-cover border border-rose-300 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">{selectedDoctor?.name || 'Dr. Chandna'}</p>
                <p className="text-[11px] text-rose-700 font-semibold">{selectedDoctor?.specialization}</p>
                <p className="text-[10px] text-slate-500">
                  {selectedDoctor?.department} · {selectedDoctor?.experience} Yrs Clinical Mastery
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Fee</span>
              <span className="text-xs font-bold font-mono text-rose-700">
                {formatCurrency(selectedDoctor?.consultationFee || 120)}
              </span>
            </div>
          </div>
        </div>

        {/* Date & Time Slot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Consultation Date
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Available Slot
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Appointment Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Consultation Modality
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType('In-person')}
              className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                type === 'In-person'
                  ? 'border-rose-600 bg-rose-50 text-rose-900 font-semibold'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Building className="w-4 h-4 text-rose-600" />
              <span>In-Person Hospital Visit</span>
            </button>
            <button
              type="button"
              onClick={() => setType('Online consultation')}
              className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                type === 'Online consultation'
                  ? 'border-rose-600 bg-rose-50 text-rose-900 font-semibold'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Video className="w-4 h-4 text-rose-600" />
              <span>Telehealth Video Call</span>
            </button>
          </div>
        </div>

        {/* Reason for Visit */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Reason for Visit / Symptoms
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            required
            placeholder="e.g. Hypertension review, ECG follow-up, asthma spirometry check, or medication adjustment..."
            className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? 'Confirming...' : 'Confirm Appointment with Dr. Chandna'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
