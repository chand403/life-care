import React from 'react';
import {
  Activity,
  Award,
  ShieldCheck,
  Heart,
  Users,
  Building,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { LifeCareLogo } from '../../components/ui/LifeCareLogo.jsx';

export function AboutPage({ onNavigate }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex justify-center mb-2">
          <LifeCareLogo size={42} showText={true} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
          About Our Healthcare Institution
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          LifeCare Hospital & Medical Center
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Under the clinical direction of Chief Medical Specialist <strong>Dr. Chandna</strong>, LifeCare Hospital delivers tertiary level clinical interventions, chronic care management, and transparent digital record security.
        </p>
      </div>

      {/* Hospital Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">JCI & HIPAA Certified</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Accredited by the Joint Commission International for the highest quality standards, sterile clinical protocols, and patient safety systems.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Documented Recovery Milestones</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our Patient Photo Recovery Gallery documents real clinical milestones, spirometry normalization, and joint rehabilitation progress under Dr. Chandna.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Zero-Compromise Security</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Granular role-based authorization ensuring patients cannot alter physician prescriptions, and medical records are locked by strict identity validation.
          </p>
        </div>
      </div>

      {/* Clinical Leadership & Statistics */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center border border-rose-900/40">
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold text-rose-400 tracking-wider">
            Clinical Leadership
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Led by Dr. Chandna, Chief Medical Director
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dr. Chandna brings over 20 years of clinical mastery in internal medicine, cardiovascular diagnostics, and post-surgical rehabilitation, personally directing outpatient care and patient recovery workflows.
          </p>
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => onNavigate('/doctors/DOC-CHANDNA')}
              className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-rose-50 rounded-xl shadow-xs transition-colors"
            >
              Dr. Chandna's Profile
            </button>
            <button
              onClick={() => onNavigate('/gallery')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors"
            >
              View Recovery Gallery
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <span className="text-3xl font-extrabold text-rose-400 tabular-nums">20+ Yrs</span>
            <span className="text-xs text-slate-300 block mt-1">Clinical Practice</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <span className="text-3xl font-extrabold text-rose-400 tabular-nums">99.8%</span>
            <span className="text-xs text-slate-300 block mt-1">Diagnostic Accuracy</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <span className="text-3xl font-extrabold text-rose-400 tabular-nums">24 / 7</span>
            <span className="text-xs text-slate-300 block mt-1">Trauma & Emergency Unit</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
            <span className="text-3xl font-extrabold text-rose-400 tabular-nums">100%</span>
            <span className="text-xs text-slate-300 block mt-1">Encrypted Record Privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
