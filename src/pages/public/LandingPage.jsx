import React, { useState } from 'react';
import {
  Activity,
  Calendar,
  CalendarPlus,
  Stethoscope,
  Heart,
  Shield,
  Clock,
  Phone,
  ArrowRight,
  CheckCircle2,
  Users,
  Award,
  Sparkles,
  ChevronRight,
  Star,
  Building,
  Video,
  FileCheck2,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatCurrency } from '../../lib/utils.js';
import { BookAppointmentModal } from '../../components/appointments/BookAppointmentModal.jsx';
import { LifeCareLogo } from '../../components/ui/LifeCareLogo.jsx';

export function LandingPage({ onNavigate }) {
  const { user } = useAuth();
  const { doctors, galleryItems } = useHospital();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  // Single Doctor: Dr. Chandna
  const chiefDoctor = doctors[0] || {
    doctorId: 'DOC-CHANDNA',
    name: 'Dr. Chandna',
    specialization: 'Chief Consultant Physician & Clinical Director',
    department: 'Internal Medicine, Cardiology & Chronic Care',
    qualification: 'MD, FACP, FCCP, Board Certified Specialist',
    experience: 20,
    bio: 'Dr. Chandna is the Chief Medical Director and Senior Attending Physician at LifeCare Hospital. With over 20 years of clinical mastery, Dr. Chandna oversees comprehensive patient consultations, cardiovascular therapeutics, acute chronic care management, and post-surgical patient rehabilitation.',
    profileImage: 'https://res.cloudinary.com/hdbfsq9s/image/upload/v1793076585/indian-medical-lady-doctor-using-laptop-in-clinic-KX39P4.jpg',
    consultationFee: 120,
    rating: 4.98,
  };

  const previewGallery = galleryItems.slice(0, 3);

  const departments = [
    {
      name: 'Cardiovascular Therapeutics',
      desc: 'Advanced cardiac evaluations, arrhythmia management, lipid titration, and post-angioplasty care.',
      icon: Heart,
      cases: '14,200+ patient reviews',
    },
    {
      name: 'Internal & Chronic Medicine',
      desc: 'Expert care for type-2 diabetes, hypertension, metabolic syndrome, and multi-system pathology.',
      icon: Activity,
      cases: '19,500+ consultations',
    },
    {
      name: 'Pediatric Care & Spirometry',
      desc: 'Compassionate pediatric wellness, childhood asthma normalization, and preventive diagnostics.',
      icon: Users,
      cases: '11,000+ happy children',
    },
    {
      name: 'Post-Surgical Rehabilitation',
      desc: 'Targeted recovery regimens for joint mobility, knee reconstructions, and cardiac rehab walking.',
      icon: Shield,
      cases: '6,400+ recoveries',
    },
    {
      name: 'Cutaneous & Dermatologic Care',
      desc: 'Clinical dermatoscopy, allergy patch evaluations, and systematic symptom management.',
      icon: Award,
      cases: '8,100+ treatments',
    },
    {
      name: '24/7 Clinical Emergency',
      desc: 'Immediate triage response, continuous vital monitoring, and critical stabilization protocols.',
      icon: Clock,
      cases: '24/7 round-the-clock',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Register Patient Account',
      desc: 'Create your digital hospital ID in two minutes with your blood group, medical background, and emergency contact.',
    },
    {
      number: '02',
      title: 'Schedule with Dr. Chandna',
      desc: 'Pick your preferred date and verified time slot with real-time anti-double booking protection.',
    },
    {
      number: '03',
      title: 'Clinical Consultation',
      desc: 'Receive comprehensive in-person evaluation or telehealth consultation conducted by Dr. Chandna.',
    },
    {
      number: '04',
      title: 'Digital Reports & Recovery',
      desc: 'Review certified medical reports, view prescriptions, acknowledge receipt, and track recovery milestones.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section with Official LifeCare Branding & Colors */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-rose-100 bg-gradient-to-b from-rose-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/70 text-rose-800 text-xs font-bold border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                <span>LifeCare Hospital & Medical Research Center</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Advanced Healthcare,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-red-700">
                  Patient First
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Welcome to <strong>LifeCare Hospital</strong>, led by Chief Medical Specialist <strong>Dr. Chandna</strong>. Book appointments without delay, access your complete clinical records, and follow real recovery milestones in our patient photo gallery.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Book Appointment with Dr. Chandna</span>
                </button>

                <button
                  onClick={() => onNavigate('/gallery')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold text-slate-800 bg-white hover:bg-rose-50 border border-rose-200 rounded-xl transition-all shadow-2xs"
                >
                  <ImageIcon className="w-4 h-4 text-rose-600" />
                  <span>Patient Recovery Gallery</span>
                </button>

                {!user && (
                  <button
                    onClick={() => onNavigate('/login')}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs font-semibold text-slate-600 hover:text-rose-700 transition-colors"
                  >
                    <span>Staff & Patient Sign In</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Trust markers */}
              <div className="pt-6 border-t border-rose-100 grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 block tabular-nums">
                    99.8%
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Patient Recovery Rate</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 block tabular-nums">
                    20+ Yrs
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Dr. Chandna's Experience</span>
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 block tabular-nums">
                    24 / 7
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Trauma & Emergency</span>
                </div>
              </div>
            </div>

            {/* Right Card Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <LifeCareLogo size={36} showText={true} />
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    JCI Accredited
                  </span>
                </div>

                {/* Dr. Chandna Quick Card */}
                <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://res.cloudinary.com/hdbfsq9s/image/upload/v1793076585/indian-medical-lady-doctor-using-laptop-in-clinic-KX39P4.jpg"
                      alt="Dr. Chandna"
                      className="w-12 h-12 rounded-xl object-cover border-2 border-rose-500 shadow-2xs"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Dr. Chandna</h4>
                      <p className="text-[11px] text-rose-700 font-medium">
                        Chief Consultant Physician & Clinical Director
                      </p>
                      <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>4.98 (142+ clinical endorsements)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-rose-200/60">
                    <span className="text-slate-600">Next Slot: <strong>Today 10:00 AM</strong></span>
                    <span className="text-rose-700 font-bold font-mono">Fee: {formatCurrency(chiefDoctor.consultationFee)}</span>
                  </div>
                </div>

                {/* Patient Photo Gallery Highlight */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-rose-600" />
                      Patient Recovery Gallery
                    </span>
                    <span className="text-rose-700 font-bold text-[10px] bg-rose-100/70 px-2 py-0.5 rounded">
                      Real Milestones
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Browse real photographic documentation of post-therapy recovery milestones achieved under Dr. Chandna's personalized medical care.
                  </p>
                </div>

                <button
                  onClick={() => setIsBookModalOpen(true)}
                  className="w-full py-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors text-center shadow-xs"
                >
                  Schedule Your Encounter with Dr. Chandna
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Hotline Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border-l-4 border-rose-600">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Phone className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                Immediate Critical Assistance
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                LifeCare 24/7 Hospital Emergency & Trauma Dispatch
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Round-the-clock acute medical triage under Dr. Chandna's clinical protocol oversight.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+18005559911"
              className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Emergency Hotline: +1 (800) 555-9911
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* PATIENT PHOTO RECOVERY GALLERY SHOWCASE (USER REQUEST)   */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded">
              Clinical Documentation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Patient Recovery & Clinical Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Visual records of successful patient rehabilitation, vitals normalization, and surgical recoveries under Dr. Chandna.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/gallery')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all shadow-2xs shrink-0"
          >
            <span>Explore Full Patient Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewGallery.map((item) => (
            <div
              key={item.itemId}
              onClick={() => onNavigate('/gallery')}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {item.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-rose-700">Patient: {item.patientName}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-4 pt-1 flex items-center justify-between border-t border-slate-100 text-xs text-rose-600 font-semibold">
                <span>View Clinical Case Details</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Single Doctor Highlight Section: Dr. Chandna */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-50 via-white to-slate-50 rounded-3xl border border-rose-200 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="relative max-w-sm mx-auto">
                <img
                  src="https://res.cloudinary.com/hdbfsq9s/image/upload/v1793076585/indian-medical-lady-doctor-using-laptop-in-clinic-KX39P4.jpg"
                  alt={chiefDoctor.name}
                  className="w-full h-80 object-cover rounded-2xl border-4 border-white shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl border border-rose-100 shadow-lg text-center">
                  <span className="text-xl font-extrabold text-rose-600 block">20+</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Years Clinical Mastery</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-5 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2.5 py-0.5 rounded">
                  Hospital Attending Specialist
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                  {chiefDoctor.name}
                </h2>
                <p className="text-xs font-bold text-rose-600 mt-0.5">
                  {chiefDoctor.specialization} · {chiefDoctor.qualification}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {chiefDoctor.bio}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Department</span>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">Internal Medicine & Cardiology</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Consultation Fee</span>
                  <p className="font-bold text-rose-600 text-xs mt-0.5 font-mono">{formatCurrency(chiefDoctor.consultationFee)}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Availability</span>
                  <p className="font-bold text-emerald-700 text-xs mt-0.5">Mon – Sat (9 AM – 5 PM)</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedDoctorForBooking('DOC-CHANDNA');
                    setIsBookModalOpen(true);
                  }}
                  className="px-6 py-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Book Visit with Dr. Chandna</span>
                </button>
                <button
                  onClick={() => onNavigate('/doctors/DOC-CHANDNA')}
                  className="px-5 py-3 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                >
                  View Clinical Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Departments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
            LifeCare Clinical Services
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Specialized Hospital Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            State-of-the-art diagnostic facilities, continuous telemetry monitoring, and certified clinical protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{dept.name}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{dept.desc}</p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{dept.cases}</span>
                  <button
                    onClick={() => {
                      setSelectedDoctorForBooking('DOC-CHANDNA');
                      setIsBookModalOpen(true);
                    }}
                    className="font-semibold text-rose-600 hover:text-rose-800 inline-flex items-center gap-1"
                  >
                    <span>Schedule Visit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How LifeCare Operates */}
      <section className="bg-slate-50 border-y border-slate-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Streamlined Patient Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              How LifeCare Operates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              From appointment scheduling to receipt verification, every step is coordinated with clinical accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3"
              >
                <span className="text-2xl font-black text-rose-600 block tabular-nums">
                  {step.number}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & System Quality */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-rose-900/50">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs uppercase font-bold tracking-wider text-rose-300">
              Healthcare Technology & Data Integrity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              LifeCare Certified Digital Records & Complete Confidentiality
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our clinical management system enforces strict role-based authorization: patients cannot alter doctor prescriptions, medical reports require explicit digital acknowledgement of receipt, and recovery photos are verified before publishing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {[
                'Anti-Double Booking algorithmic scheduling',
                'Multi-drug structured prescription builder',
                'Patient recovery photo gallery with admin editor',
                'Two-way report receipt acknowledgement workflow',
                'Unified Doctor & Admin management console',
                'Immutable compliance and security audit logs',
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => onNavigate('/register')}
                className="px-6 py-3 text-xs font-bold text-rose-950 bg-white hover:bg-rose-50 rounded-xl transition-all shadow-md"
              >
                Register Your Patient Account Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-rose-100 bg-white pt-12 pb-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <LifeCareLogo size={36} showText={true} />
            <p className="leading-relaxed text-[11px] text-slate-500">
              LifeCare Hospital & Medical Center. Certified JCI healthcare institution providing clinical excellence under Dr. Chandna.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Patient Services
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => setIsBookModalOpen(true)} className="hover:text-rose-600">Book Appointment</button></li>
              <li><button onClick={() => onNavigate('/gallery')} className="hover:text-rose-600">Patient Recovery Gallery</button></li>
              <li><button onClick={() => onNavigate('/doctors/DOC-CHANDNA')} className="hover:text-rose-600">Dr. Chandna's Profile</button></li>
              <li><button onClick={() => onNavigate('/login')} className="hover:text-rose-600">Patient Portal Login</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Doctor & Admin Staff
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('/login')} className="hover:text-rose-600">Combined Staff Login</button></li>
              <li><button onClick={() => onNavigate('/admin/dashboard')} className="hover:text-rose-600">Admin & Clinical Dashboard</button></li>
              <li><button onClick={() => onNavigate('/admin/gallery')} className="hover:text-rose-600">Gallery Editor</button></li>
              <li><span className="text-slate-400">HIPAA & JCI Auditing</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              Hospital Campus
            </h4>
            <p className="leading-relaxed text-[11px]">
              500 Healthcare Boulevard, Suite 100<br />
              LifeCare Medical Center<br />
              Tel: +1 (800) 555-CARE<br />
              Emergency: 911 / +1 (800) 555-9911
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 LifeCare Hospital & Medical Center. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-rose-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-rose-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-rose-600 cursor-pointer">Patient Rights</span>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setSelectedDoctorForBooking(null);
        }}
        preselectedDoctorId={selectedDoctorForBooking}
      />
    </div>
  );
}
