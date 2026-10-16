/**
 * Standalone MongoDB Seed Script for MedPulse Hospital Management System
 * Run with: node scripts/seed.js
 *
 * Populates MongoDB with:
 * - 1 Admin
 * - 5 Attending Specialists (Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology)
 * - 15 Diverse Patients with full demographic and clinical data
 * - Multiple Encounters & Appointments (Confirmed, Completed, Pending, Cancelled)
 * - Clinical Consultation Reports with multi-drug prescriptions and attachments
 * - Real-time Notifications & System Compliance Audit Logs
 */

import mongoose from 'mongoose';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import Appointment from '../models/Appointment.js';
import MedicalReport from '../models/MedicalReport.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import {
  INITIAL_USERS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_REPORTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../src/data/mockData.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medpulse_hospital';

async function seedDatabase() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // Clear existing collections
    console.log('Clearing existing hospital collections...');
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
      Appointment.deleteMany({}),
      MedicalReport.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    // Insert Users
    console.log(`Seeding ${INITIAL_USERS.length} user credentials...`);
    await User.insertMany(INITIAL_USERS);

    // Insert Doctors
    console.log(`Seeding ${INITIAL_DOCTORS.length} specialized physicians...`);
    await Doctor.insertMany(INITIAL_DOCTORS);

    // Insert Patients
    console.log(`Seeding ${INITIAL_PATIENTS.length} patient clinical files...`);
    await Patient.insertMany(INITIAL_PATIENTS);

    // Insert Appointments
    console.log(`Seeding ${INITIAL_APPOINTMENTS.length} hospital encounters...`);
    await Appointment.insertMany(INITIAL_APPOINTMENTS);

    // Insert Medical Reports
    console.log(`Seeding ${INITIAL_MEDICAL_REPORTS.length} medical consultation reports...`);
    await MedicalReport.insertMany(INITIAL_MEDICAL_REPORTS);

    // Insert Notifications
    console.log(`Seeding ${INITIAL_NOTIFICATIONS.length} notifications...`);
    await Notification.insertMany(INITIAL_NOTIFICATIONS);

    // Insert Audit Logs
    console.log(`Seeding ${INITIAL_AUDIT_LOGS.length} compliance audit logs...`);
    await AuditLog.insertMany(INITIAL_AUDIT_LOGS);

    console.log('\n=========================================');
    console.log(' MEDPULSE HOSPITAL DATABASE SEED COMPLETE');
    console.log('=========================================');
    console.log('Demo Credentials for Immediate Testing:');
    console.log('1. Admin:   admin@medpulse.org      / admin123');
    console.log('2. Doctor:  dr.jenkins@medpulse.org / doctor123');
    console.log('3. Patient: patient@medpulse.org    / patient123');
    console.log('=========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Database seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
