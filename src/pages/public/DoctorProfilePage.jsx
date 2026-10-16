import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Star,
  Globe,
  Award,
  DollarSign,
  Building,
  Phone,
  Mail,
  CheckCircle2,
  CalendarPlus,
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { formatCurrency } from '../../lib/utils.js';
import { BookAppointmentModal } from '../../components/appointments/BookAppointmentModal.jsx';

export function DoctorProfilePage({ doctorId, onNavigate }) {
  const { doctors } = useHospital();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const doctor = doctors.find((d) => d.doctorId === doctorId) || doctors[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => onNavigate('/doctors')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctor Directory</span>
        </button>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-rose-200/90 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Large Doctor Image */}
        <div className="md:col-span-5 relative">
          <img
            src={doctor.profileImage}
            alt={doctor.name}
            className="w-full h-80 sm:h-96 object-cover rounded-2xl border border-rose-200 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-rose-200 flex items-center justify-between text-xs shadow-2xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Consultation Fee
              </span>
              <span className="text-base font-extrabold text-rose-700 tabular-nums">
                {formatCurrency(doctor.consultationFee)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Rating
              </span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{doctor.rating}</span>
                <span className="text-slate-400 font-normal">({doctor.reviewCount || 142})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="md:col-span-7 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded tracking-wider">
                {doctor.department}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                LifeCare Medical Director
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-tight">
              {doctor.name}
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-1">
              {doctor.qualification}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {doctor.bio}
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Clinical Experience
              </span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {doctor.experience}+ Years Active Practice
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Physician Credentials
              </span>
              <span className="text-sm font-bold text-rose-700 font-mono">
                {doctor.doctorId}
              </span>
            </div>
          </div>

          {/* Areas of Expertise */}
          {doctor.expertise && doctor.expertise.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Clinical Areas of Expertise
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {doctor.expertise.map((exp, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-rose-800 bg-rose-50 border border-rose-100 px-3 py-1 rounded-md"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Spoken Languages */}
          <div className="space-y-1 text-xs">
            <span className="text-slate-400 font-medium">Consultation Languages:</span>
            <p className="font-semibold text-slate-800">
              {doctor.languages?.join(', ') || 'English, Hindi, Spanish'}
            </p>
          </div>

          {/* Primary Booking Button */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Book Appointment with {doctor.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Available Days and Time Slots Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Practicing Clinic Days
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(doctor.availability?.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']).map(
              (day) => (
                <div
                  key={day}
                  className="p-3 bg-rose-50/50 border border-rose-200/50 rounded-xl text-center"
                >
                  <span className="text-xs font-bold text-rose-900 block">{day}</span>
                  <span className="text-[10px] text-rose-700 font-medium">Outpatient Clinic</span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Consultation Time Slots
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(doctor.availability?.timeSlots || [
              '09:00 AM',
              '10:00 AM',
              '11:00 AM',
              '01:30 PM',
              '02:30 PM',
              '03:30 PM',
              '04:30 PM',
            ]).map((slot) => (
              <div
                key={slot}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center"
              >
                <span className="text-xs font-mono font-bold text-slate-800 block tabular-nums">
                  {slot}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Available</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        preselectedDoctorId={doctor.doctorId}
      />
    </div>
  );
}
