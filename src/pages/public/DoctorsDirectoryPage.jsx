import React, { useState } from 'react';
import {
  Search,
  Star,
  Clock,
  CalendarPlus,
  Globe,
  Award,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { formatCurrency } from '../../lib/utils.js';
import { BookAppointmentModal } from '../../components/appointments/BookAppointmentModal.jsx';

export function DoctorsDirectoryPage({ onNavigate }) {
  const { doctors } = useHospital();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Single Doctor: Dr. Chandna
  const filtered = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && doc.isActive !== false;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Directory Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
          LifeCare Medical Faculty
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Attending Physician Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Consult with our Chief Attending Physician & Clinical Director, Dr. Chandna, for comprehensive internal medicine, cardiology, and chronic care.
        </p>
      </div>

      {/* Doctor Cards */}
      <div className="max-w-4xl mx-auto">
        {filtered.map((doc) => (
          <div
            key={doc.doctorId}
            className="bg-white rounded-3xl border border-rose-200/90 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col md:flex-row justify-between"
          >
            <div className="md:w-80 relative shrink-0">
              <img
                src={doc.profileImage}
                alt={doc.name}
                className="w-full h-72 md:h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="tabular-nums">{doc.rating}</span>
                <span className="text-slate-500 font-normal">({doc.reviewCount || 142} reviews)</span>
              </span>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Chief Attending Physician
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Available Mon – Sat
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900">
                  {doc.name}
                </h3>
                <p className="text-xs font-bold text-rose-600 mt-0.5">
                  {doc.specialization}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{doc.qualification}</p>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {doc.bio}
                </p>

                {/* Details list */}
                <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Department</span>
                    <p className="font-semibold text-slate-800">{doc.department}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Experience</span>
                    <p className="font-semibold text-slate-800">{doc.experience}+ Years Active Practice</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Consultation Fee</span>
                    <p className="font-bold text-rose-600 font-mono text-sm">{formatCurrency(doc.consultationFee)}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Languages</span>
                    <p className="font-semibold text-slate-800">{doc.languages?.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate(`/doctors/${doc.doctorId}`)}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-800 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl text-center transition-colors"
                >
                  Full Clinical Profile
                </button>
                <button
                  onClick={() => {
                    setSelectedDoctorId(doc.doctorId);
                    setIsBookModalOpen(true);
                  }}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl text-center transition-all shadow-md flex items-center gap-1.5"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Book Appointment with Dr. Chandna</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setSelectedDoctorId(null);
        }}
        preselectedDoctorId={selectedDoctorId || 'DOC-CHANDNA'}
      />
    </div>
  );
}
