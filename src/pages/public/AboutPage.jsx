import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Lightbulb,
  Target,
} from 'lucide-react';

const studentDetails = [
  ['Student Name', 'Chandna'],
  ['Class / Course', 'B.tech cse'],
  ['Roll Number', '2428816'],
  ['Semester', '7th'],
  ['College / Institute', 'Doaba Group of Colleges Rahon Distt Nawanshahr '],
  ['Project Guide', 'Manoj Barhpagga'],
];

const projectModules = [
  'Patient profiles and medical history',
  'Appointment booking and schedule management',
  'Consultation reports and prescriptions',
  'Role-based patient, doctor, and staff dashboards',
  'Notifications, activity history, and gallery records',
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl space-y-4">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
          <GraduationCap className="h-4 w-4" />
          College Project
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          LifeCare Hospital Management System
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          A student project demonstrating how patient records, appointments, and
          clinical reports can be organized in one straightforward web application.
        </p>
      </header>

      <section aria-labelledby="student-details-heading" className="border-y border-slate-200 py-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 id="student-details-heading" className="text-lg font-bold text-slate-900">
              Student Details
            </h2>
            <p className="text-xs text-slate-500">Replace the prompts with your submission details.</p>
          </div>
        </div>
        <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {studentDetails.map(([label, value]) => (
            <div key={label} className="border-t border-slate-100 py-3">
              <dt className="text-xs font-medium text-slate-500">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-700">
            <BookOpen className="h-5 w-5" />
            <h2 className="text-lg font-bold text-slate-900">Problem Statement</h2>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Patient information, appointment schedules, and consultation notes can
            become difficult to track when maintained in separate registers or files.
            This can lead to duplicated work, delayed follow-ups, and incomplete records.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-700">
            <Lightbulb className="h-5 w-5" />
            <h2 className="text-lg font-bold text-slate-900">Proposed Solution</h2>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            LifeCare brings the core workflows into a single interface. Patients can
            review their appointments and reports, while staff can manage patient
            records, schedules, prescriptions, and follow-up notifications.
          </p>
        </div>
      </section>

      <section className="grid gap-10 border-t border-slate-200 pt-8 md:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-rose-700" />
            <h2 className="text-lg font-bold text-slate-900">Project Objectives</h2>
          </div>
          <ul className="space-y-3">
            {[
              'Keep patient and appointment information organized.',
              'Make reports and prescription details easy to review.',
              'Provide separate views for patients and hospital staff.',
              'Demonstrate common workflows with sample data.',
            ].map((objective) => (
              <li key={objective} className="flex items-start gap-2 text-sm leading-5 text-slate-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                {objective}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-rose-700" />
            <h2 className="text-lg font-bold text-slate-900">Project Modules</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {projectModules.map((module, index) => (
              <li key={module} className="flex gap-3 py-2.5 text-sm text-slate-600">
                <span className="font-mono text-xs font-bold text-rose-700">0{index + 1}</span>
                {module}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}