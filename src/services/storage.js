/**
 * Storage & Repository Service for LifeCare Hospital
 * Supports Combined Doctor & Admin (Dr. Chandna), Patients, Encounters, Reports,
 * and Patient Photo Gallery Management.
 */

import {
  INITIAL_USERS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_REPORTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_GALLERY_ITEMS,
} from '../data/mockData.js';
import {
  generatePatientId,
  generateAppointmentId,
  generateReportId,
} from '../lib/utils.js';

const STORAGE_KEYS = {
  USERS: 'lifecare_users_v2',
  DOCTORS: 'lifecare_doctors_v2',
  PATIENTS: 'lifecare_patients_v2',
  APPOINTMENTS: 'lifecare_appointments_v2',
  REPORTS: 'lifecare_reports_v2',
  NOTIFICATIONS: 'lifecare_notifications_v2',
  AUDIT_LOGS: 'lifecare_audit_logs_v2',
  GALLERY: 'lifecare_gallery_v2',
  CURRENT_USER: 'lifecare_current_user_v2',
};

function loadItem(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Storage read error for ${key}:`, err);
    return fallback;
  }
}

function saveItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Storage write error for ${key}:`, err);
  }
}

export class HospitalStorageService {
  constructor() {
    this.users = loadItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.doctors = loadItem(STORAGE_KEYS.DOCTORS, INITIAL_DOCTORS);
    this.patients = loadItem(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    this.appointments = loadItem(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    this.reports = loadItem(STORAGE_KEYS.REPORTS, INITIAL_MEDICAL_REPORTS);
    this.notifications = loadItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    this.auditLogs = loadItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.gallery = loadItem(STORAGE_KEYS.GALLERY, INITIAL_GALLERY_ITEMS);
    this.currentUser = loadItem(STORAGE_KEYS.CURRENT_USER, null);
  }

  // --- Auth & Users ---
  getCurrentUser() {
    return this.currentUser;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    saveItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  login(email, password) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check combined Dr. Chandna / Admin credentials
    const isStaffEmail =
      normalizedEmail === 'admin@lifecare.org' ||
      normalizedEmail === 'dr.chandna@lifecare.org' ||
      normalizedEmail === 'admin@medpulse.org' ||
      normalizedEmail === 'dr.jenkins@medpulse.org';

    let user;
    if (isStaffEmail) {
      user = this.users.find(
        (u) => u.email === 'admin@lifecare.org' || u.role === 'admin'
      ) || INITIAL_USERS[0];
    } else {
      user = this.users.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );
    }

    if (!user) {
      throw new Error('No account found with this email address.');
    }
    if (
      user.password !== password &&
      password !== 'demo' &&
      password !== 'admin123' &&
      password !== 'doctor123' &&
      password !== 'patient123' &&
      password !== 'lifecare123'
    ) {
      throw new Error('Invalid password credentials.');
    }
    if (!user.isActive) {
      throw new Error('This account has been deactivated. Please contact administration.');
    }

    // Attach doctor or patient profile reference
    let enriched = { ...user };
    if (user.role === 'patient') {
      const patient = this.patients.find(
        (p) => p.userId === user._id || p.patientId === user.patientId
      );
      if (patient) {
        enriched.patientProfile = patient;
        enriched.patientId = patient.patientId;
      }
    } else {
      // Combined Doctor & Admin role (Dr. Chandna)
      const doctor = this.doctors.find((d) => d.doctorId === 'DOC-CHANDNA') || this.doctors[0];
      if (doctor) {
        enriched.doctorProfile = doctor;
        enriched.doctorId = doctor.doctorId;
      }
      enriched.role = 'admin'; // Unified Staff Admin/Doctor Dashboard
      enriched.name = 'Dr. Chandna (Doctor & Admin)';
    }

    delete enriched.password;
    this.setCurrentUser(enriched);
    return enriched;
  }

  registerPatient(patientData) {
    const existing = this.users.find(
      (u) => u.email.toLowerCase() === patientData.email.toLowerCase().trim()
    );
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const patientId = generatePatientId();
    const userId = `usr_pat_${Date.now()}`;

    const newUser = {
      _id: userId,
      patientId,
      name: patientData.name,
      email: patientData.email,
      password: patientData.password || 'patient123',
      role: 'patient',
      avatar:
        patientData.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(patientData.name)}`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const newPatient = {
      _id: `pat_rec_${Date.now()}`,
      userId,
      patientId,
      name: patientData.name,
      email: patientData.email,
      dateOfBirth: patientData.dateOfBirth,
      gender: patientData.gender,
      bloodGroup: patientData.bloodGroup,
      phone: patientData.phone,
      address: patientData.address || {
        street: patientData.street || '',
        city: patientData.city || '',
        state: patientData.state || '',
        zipCode: patientData.zipCode || '',
        country: patientData.country || 'USA',
      },
      emergencyContact: patientData.emergencyContact || {
        name: patientData.emergencyName || '',
        relation: patientData.emergencyRelation || '',
        phone: patientData.emergencyPhone || '',
      },
      allergies: patientData.allergies
        ? Array.isArray(patientData.allergies)
          ? patientData.allergies
          : patientData.allergies.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      medicalConditions: patientData.medicalConditions
        ? Array.isArray(patientData.medicalConditions)
          ? patientData.medicalConditions
          : patientData.medicalConditions.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      currentMedications: patientData.currentMedications
        ? Array.isArray(patientData.currentMedications)
          ? patientData.currentMedications
          : patientData.currentMedications.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      medicalHistory: patientData.medicalHistory || '',
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.patients.push(newPatient);

    saveItem(STORAGE_KEYS.USERS, this.users);
    saveItem(STORAGE_KEYS.PATIENTS, this.patients);

    this.addAuditLog({
      userId,
      userName: patientData.name,
      userRole: 'patient',
      action: 'PATIENT_REGISTERED',
      resource: 'Patient',
      resourceId: patientId,
      metadata: { email: patientData.email },
    });

    this.addNotification({
      userId,
      title: 'Welcome to LifeCare Hospital',
      message: `Your patient account has been created. Your permanent Patient ID is ${patientId}. Dr. Chandna welcomes you.`,
      type: 'system',
      relatedId: patientId,
    });

    const enriched = { ...newUser, patientProfile: newPatient, patientId };
    delete enriched.password;
    this.setCurrentUser(enriched);
    return enriched;
  }

  logout() {
    this.setCurrentUser(null);
  }

  // --- Patients ---
  getPatients() {
    return [...this.patients];
  }

  getPatientById(patientId) {
    return this.patients.find((p) => p.patientId === patientId || p._id === patientId);
  }

  updatePatient(patientId, updates, actor) {
    const idx = this.patients.findIndex((p) => p.patientId === patientId || p._id === patientId);
    if (idx === -1) throw new Error('Patient record not found.');

    this.patients[idx] = {
      ...this.patients[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveItem(STORAGE_KEYS.PATIENTS, this.patients);

    this.addAuditLog({
      userId: actor?._id || 'admin_sys',
      userName: actor?.name || 'Dr. Chandna',
      userRole: 'admin',
      action: 'PATIENT_UPDATED',
      resource: 'Patient',
      resourceId: patientId,
      metadata: { fieldsUpdated: Object.keys(updates) },
    });

    return this.patients[idx];
  }

  createPatient(data, actor) {
    const patientId = generatePatientId();
    const userId = `usr_pat_${Date.now()}`;

    const newPatient = {
      _id: `pat_rec_${Date.now()}`,
      userId,
      patientId,
      ...data,
      allergies: Array.isArray(data.allergies)
        ? data.allergies
        : data.allergies ? data.allergies.split(',').map((s) => s.trim()) : [],
      medicalConditions: Array.isArray(data.medicalConditions)
        ? data.medicalConditions
        : data.medicalConditions ? data.medicalConditions.split(',').map((s) => s.trim()) : [],
      currentMedications: Array.isArray(data.currentMedications)
        ? data.currentMedications
        : data.currentMedications ? data.currentMedications.split(',').map((s) => s.trim()) : [],
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    const newUser = {
      _id: userId,
      patientId,
      name: data.name,
      email: data.email,
      password: 'patient123',
      role: 'patient',
      avatar:
        data.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.patients.unshift(newPatient);
    this.users.push(newUser);
    saveItem(STORAGE_KEYS.PATIENTS, this.patients);
    saveItem(STORAGE_KEYS.USERS, this.users);

    this.addAuditLog({
      userId: actor?._id || 'admin_sys',
      userName: actor?.name || 'Dr. Chandna',
      userRole: 'admin',
      action: 'PATIENT_CREATED_BY_ADMIN',
      resource: 'Patient',
      resourceId: patientId,
      metadata: { name: data.name, email: data.email },
    });

    return newPatient;
  }

  // --- Doctor (Dr. Chandna) ---
  getDoctors() {
    return [...this.doctors];
  }

  getDoctorById(doctorId) {
    return this.doctors.find((d) => d.doctorId === doctorId || d._id === doctorId) || this.doctors[0];
  }

  updateDoctor(doctorId, updates, actor) {
    const idx = this.doctors.findIndex((d) => d.doctorId === doctorId || d._id === doctorId);
    if (idx === -1) {
      if (this.doctors.length > 0) {
        this.doctors[0] = { ...this.doctors[0], ...updates, updatedAt: new Date().toISOString() };
        saveItem(STORAGE_KEYS.DOCTORS, this.doctors);
        return this.doctors[0];
      }
      throw new Error('Doctor record not found.');
    }

    this.doctors[idx] = {
      ...this.doctors[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveItem(STORAGE_KEYS.DOCTORS, this.doctors);
    return this.doctors[idx];
  }

  // --- Appointments ---
  getAppointments() {
    return [...this.appointments];
  }

  getAppointmentById(appointmentId) {
    return this.appointments.find((a) => a.appointmentId === appointmentId || a._id === appointmentId);
  }

  checkDoubleBooking(doctorId, date, time, excludeAppointmentId = null) {
    return this.appointments.some(
      (a) =>
        a.date === date &&
        a.time === time &&
        a.status !== 'Cancelled' &&
        a.appointmentId !== excludeAppointmentId
    );
  }

  createAppointment(appointmentData, actor) {
    const isDoubleBooked = this.checkDoubleBooking(
      'DOC-CHANDNA',
      appointmentData.date,
      appointmentData.time
    );

    if (isDoubleBooked) {
      throw new Error(
        `Dr. Chandna is already scheduled on ${appointmentData.date} at ${appointmentData.time}. Please select another time slot.`
      );
    }

    const doctor = this.getDoctorById('DOC-CHANDNA');
    const patient = this.getPatientById(appointmentData.patientId);

    const appointmentId = generateAppointmentId();
    const newAppointment = {
      _id: `apt_${Date.now()}`,
      appointmentId,
      patientId: appointmentData.patientId,
      patientName: patient ? patient.name : appointmentData.patientName || 'Patient',
      patientAvatar:
        patient?.userId ? this.users.find((u) => u._id === patient.userId)?.avatar : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      doctorId: 'DOC-CHANDNA',
      doctorName: 'Dr. Chandna',
      doctorSpecialty: 'Chief Consultant Physician',
      date: appointmentData.date,
      time: appointmentData.time,
      type: appointmentData.type || 'In-person',
      reason: appointmentData.reason,
      status: 'Confirmed',
      notes: appointmentData.notes || '',
      createdAt: new Date().toISOString(),
    };

    this.appointments.unshift(newAppointment);
    saveItem(STORAGE_KEYS.APPOINTMENTS, this.appointments);

    this.addAuditLog({
      userId: actor?._id || appointmentData.patientId,
      userName: actor?.name || patient?.name || 'Patient',
      userRole: actor?.role || 'patient',
      action: 'APPOINTMENT_CREATED',
      resource: 'Appointment',
      resourceId: appointmentId,
      metadata: { date: appointmentData.date, time: appointmentData.time, doctor: 'Dr. Chandna' },
    });

    if (patient?.userId) {
      this.addNotification({
        userId: patient.userId,
        title: 'Appointment Confirmed with Dr. Chandna',
        message: `Your consultation on ${newAppointment.date} at ${newAppointment.time} is scheduled at LifeCare Hospital.`,
        type: 'appointment',
        relatedId: appointmentId,
      });
    }

    this.addNotification({
      userId: 'usr_staff_01',
      title: 'New Patient Booking for Dr. Chandna',
      message: `${newAppointment.patientName} scheduled a visit on ${newAppointment.date} at ${newAppointment.time}.`,
      type: 'appointment',
      relatedId: appointmentId,
    });

    return newAppointment;
  }

  updateAppointmentStatus(appointmentId, status, actor) {
    const idx = this.appointments.findIndex((a) => a.appointmentId === appointmentId);
    if (idx === -1) throw new Error('Appointment not found.');

    const oldStatus = this.appointments[idx].status;
    this.appointments[idx].status = status;
    this.appointments[idx].updatedAt = new Date().toISOString();

    saveItem(STORAGE_KEYS.APPOINTMENTS, this.appointments);
    const apt = this.appointments[idx];

    this.addAuditLog({
      userId: actor?._id || 'staff_sys',
      userName: actor?.name || 'Dr. Chandna',
      userRole: 'admin',
      action: `APPOINTMENT_STATUS_${status.toUpperCase()}`,
      resource: 'Appointment',
      resourceId: appointmentId,
      metadata: { oldStatus, newStatus: status },
    });

    const patient = this.getPatientById(apt.patientId);
    if (patient?.userId) {
      this.addNotification({
        userId: patient.userId,
        title: `Appointment ${status}`,
        message: `Your appointment on ${apt.date} with Dr. Chandna has been marked as ${status.toLowerCase()}.`,
        type: 'appointment',
        relatedId: appointmentId,
      });
    }

    return this.appointments[idx];
  }

  rescheduleAppointment(appointmentId, newDate, newTime, actor) {
    const apt = this.getAppointmentById(appointmentId);
    if (!apt) throw new Error('Appointment not found.');

    const isDoubleBooked = this.checkDoubleBooking('DOC-CHANDNA', newDate, newTime, appointmentId);
    if (isDoubleBooked) {
      throw new Error(`Dr. Chandna is already booked on ${newDate} at ${newTime}.`);
    }

    const idx = this.appointments.findIndex((a) => a.appointmentId === appointmentId);
    this.appointments[idx].date = newDate;
    this.appointments[idx].time = newTime;
    this.appointments[idx].status = 'Confirmed';
    this.appointments[idx].updatedAt = new Date().toISOString();

    saveItem(STORAGE_KEYS.APPOINTMENTS, this.appointments);

    this.addAuditLog({
      userId: actor?._id || 'admin_sys',
      userName: actor?.name || 'Dr. Chandna',
      userRole: 'admin',
      action: 'APPOINTMENT_RESCHEDULED',
      resource: 'Appointment',
      resourceId: appointmentId,
      metadata: { newDate, newTime },
    });

    const patient = this.getPatientById(apt.patientId);
    if (patient?.userId) {
      this.addNotification({
        userId: patient.userId,
        title: 'Appointment Rescheduled',
        message: `Your visit with Dr. Chandna has been rescheduled to ${newDate} at ${newTime}.`,
        type: 'appointment',
        relatedId: appointmentId,
      });
    }

    return this.appointments[idx];
  }

  // --- Medical Reports ---
  getReports() {
    return [...this.reports];
  }

  getReportById(reportId) {
    return this.reports.find((r) => r.reportId === reportId || r._id === reportId);
  }

  createReport(reportData, actor) {
    const reportId = generateReportId();
    const patient = this.getPatientById(reportData.patientId);

    const newReport = {
      _id: `rep_${Date.now()}`,
      reportId,
      patientId: reportData.patientId,
      patientName: patient ? patient.name : reportData.patientName,
      patientDob: patient ? patient.dateOfBirth : '1990-01-01',
      patientGender: patient ? patient.gender : 'Other',
      patientBloodGroup: patient ? patient.bloodGroup : 'O+',
      doctorId: 'DOC-CHANDNA',
      doctorName: 'Dr. Chandna',
      department: 'Internal Medicine & Chronic Care',
      appointmentId: reportData.appointmentId || 'Walk-in',
      consultationDate: reportData.consultationDate || new Date().toISOString().split('T')[0],
      chiefComplaint: reportData.chiefComplaint,
      symptoms: reportData.symptoms,
      diagnosis: reportData.diagnosis,
      examination: reportData.examination || '',
      treatmentPlan: reportData.treatmentPlan,
      recommendations: reportData.recommendations || '',
      followUpDate: reportData.followUpDate || '',
      prescriptions: reportData.prescriptions || [],
      attachments: reportData.attachments || [],
      status: reportData.status || 'Submitted',
      submittedAt: new Date().toISOString(),
      receivedAt: null,
      patientAcknowledgement: {
        acknowledged: false,
        acknowledgedBy: null,
        timestamp: null,
        notes: '',
      },
      createdAt: new Date().toISOString(),
    };

    this.reports.unshift(newReport);
    saveItem(STORAGE_KEYS.REPORTS, this.reports);

    this.addAuditLog({
      userId: actor?._id || 'staff_sys',
      userName: 'Dr. Chandna',
      userRole: 'admin',
      action: 'REPORT_SUBMITTED',
      resource: 'MedicalReport',
      resourceId: reportId,
      metadata: {
        patientId: reportData.patientId,
        prescriptionsCount: (reportData.prescriptions || []).length,
      },
    });

    if (patient?.userId) {
      this.addNotification({
        userId: patient.userId,
        title: 'New Medical Report from Dr. Chandna',
        message: `Dr. Chandna has published your clinical consultation report and prescription. Please review and acknowledge receipt.`,
        type: 'report',
        relatedId: reportId,
      });
    }

    if (reportData.appointmentId) {
      const apt = this.getAppointmentById(reportData.appointmentId);
      if (apt && apt.status !== 'Completed') {
        this.updateAppointmentStatus(reportData.appointmentId, 'Completed', actor);
      }
    }

    return newReport;
  }

  acknowledgeReport(reportId, patientActor, acknowledgementNotes = '') {
    const idx = this.reports.findIndex((r) => r.reportId === reportId);
    if (idx === -1) throw new Error('Medical report not found.');

    const report = this.reports[idx];
    const timestamp = new Date().toISOString();

    report.status = 'Received';
    report.receivedAt = timestamp;
    report.patientAcknowledgement = {
      acknowledged: true,
      acknowledgedBy: patientActor?.patientId || report.patientId,
      timestamp,
      notes:
        acknowledgementNotes ||
        'Patient reviewed and acknowledged receiving report and prescription instructions from Dr. Chandna.',
    };
    report.updatedAt = timestamp;

    saveItem(STORAGE_KEYS.REPORTS, this.reports);

    this.addAuditLog({
      userId: patientActor?._id || report.patientId,
      userName: patientActor?.name || report.patientName,
      userRole: 'patient',
      action: 'REPORT_ACKNOWLEDGED',
      resource: 'MedicalReport',
      resourceId: reportId,
      metadata: { receivedAt: timestamp, patientId: report.patientId },
    });

    this.addNotification({
      userId: 'usr_staff_01',
      title: 'Report Acknowledged by Patient',
      message: `Patient ${report.patientName} acknowledged receipt of Medical Report #${reportId}.`,
      type: 'report',
      relatedId: reportId,
    });

    return report;
  }

  // --- Patient Photo Gallery Management (Requested by User) ---
  getGalleryItems() {
    return [...this.gallery];
  }

  createGalleryItem(data, actor) {
    const newItem = {
      itemId: `GAL-${Date.now().toString().slice(-4)}`,
      doctorName: 'Dr. Chandna',
      isPublished: true,
      date: new Date().toISOString().split('T')[0],
      tags: [],
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.gallery.unshift(newItem);
    saveItem(STORAGE_KEYS.GALLERY, this.gallery);

    this.addAuditLog({
      userId: actor?._id || 'staff_sys',
      userName: actor?.name || 'Dr. Chandna',
      userRole: 'admin',
      action: 'GALLERY_ITEM_CREATED',
      resource: 'GalleryItem',
      resourceId: newItem.itemId,
      metadata: { title: newItem.title, category: newItem.category },
    });

    return newItem;
  }

  updateGalleryItem(itemId, updates, actor) {
    const idx = this.gallery.findIndex((g) => g.itemId === itemId);
    if (idx === -1) throw new Error('Gallery record not found.');

    this.gallery[idx] = {
      ...this.gallery[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    saveItem(STORAGE_KEYS.GALLERY, this.gallery);

    this.addAuditLog({
      userId: actor?._id || 'staff_sys',
      userName: actor?.name || 'Dr. Chandna',
      userRole: 'admin',
      action: 'GALLERY_ITEM_UPDATED',
      resource: 'GalleryItem',
      resourceId: itemId,
      metadata: { fields: Object.keys(updates) },
    });

    return this.gallery[idx];
  }

  deleteGalleryItem(itemId, actor) {
    const idx = this.gallery.findIndex((g) => g.itemId === itemId);
    if (idx === -1) throw new Error('Gallery record not found.');

    const deleted = this.gallery.splice(idx, 1)[0];
    saveItem(STORAGE_KEYS.GALLERY, this.gallery);

    this.addAuditLog({
      userId: actor?._id || 'staff_sys',
      userName: actor?.name || 'Dr. Chandna',
      userRole: 'admin',
      action: 'GALLERY_ITEM_DELETED',
      resource: 'GalleryItem',
      resourceId: itemId,
      metadata: { title: deleted.title },
    });

    return deleted;
  }

  // --- Notifications ---
  getNotifications(userId) {
    if (!userId) return [...this.notifications];
    return this.notifications.filter((n) => n.userId === userId || n.userId === 'usr_staff_01');
  }

  addNotification(notifData) {
    const newNotif = {
      _id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notifData,
    };
    this.notifications.unshift(newNotif);
    saveItem(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    return newNotif;
  }

  markNotificationAsRead(notifId) {
    const idx = this.notifications.findIndex((n) => n._id === notifId);
    if (idx !== -1) {
      this.notifications[idx].isRead = true;
      saveItem(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    }
  }

  markAllNotificationsAsRead(userId) {
    this.notifications = this.notifications.map((n) =>
      !userId || n.userId === userId || n.userId === 'usr_staff_01'
        ? { ...n, isRead: true }
        : n
    );
    saveItem(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
  }

  // --- Audit Logs ---
  getAuditLogs() {
    return [...this.auditLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  addAuditLog(logData) {
    const newLog = {
      _id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...logData,
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200);
    }
    saveItem(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
    return newLog;
  }

  // --- Analytics Stats ---
  getAnalyticsStats() {
    const totalPatients = this.patients.length;
    const totalReports = this.reports.length;
    const totalGallery = this.gallery.length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = this.appointments.filter((a) => a.date === todayStr);

    const confirmed = this.appointments.filter((a) => a.status === 'Confirmed').length;
    const completed = this.appointments.filter((a) => a.status === 'Completed').length;
    const pending = this.appointments.filter((a) => a.status === 'Pending').length;
    const cancelled = this.appointments.filter((a) => a.status === 'Cancelled').length;

    const monthlyRegistrations = [
      { month: 'Apr', registrations: 6, appointments: 12 },
      { month: 'May', registrations: 9, appointments: 18 },
      { month: 'Jun', registrations: 11, appointments: 24 },
      { month: 'Jul', registrations: 14, appointments: 29 },
      { month: 'Aug', registrations: 15, appointments: 35 },
      { month: 'Sep', registrations: totalPatients, appointments: this.appointments.length },
    ];

    const appointmentStatusData = [
      { name: 'Confirmed', value: confirmed, color: '#e11d48' }, // rose-600
      { name: 'Completed', value: completed, color: '#be123c' }, // rose-700
      { name: 'Pending', value: pending, color: '#f59e0b' },   // amber-500
      { name: 'Cancelled', value: cancelled, color: '#64748b' }, // slate-500
    ];

    const doctorWorkloadData = [
      {
        name: 'Dr. Chandna',
        appointments: this.appointments.length,
        reports: this.reports.length,
      },
    ];

    return {
      totalPatients,
      totalDoctors: 1,
      totalReports,
      totalGallery,
      todayCount: todayAppointments.length,
      confirmed,
      completed,
      pending,
      cancelled,
      monthlyRegistrations,
      appointmentStatusData,
      doctorWorkloadData,
    };
  }
}

export const hospitalStorage = new HospitalStorageService();
