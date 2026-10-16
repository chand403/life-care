import React, { createContext, useContext, useState, useEffect } from 'react';
import { hospitalStorage } from '../services/storage.js';
import { useAuth } from './AuthContext.jsx';

const HospitalContext = createContext(null);

export function HospitalProvider({ children }) {
  const { user, showToast } = useAuth();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const refreshData = () => {
    setPatients(hospitalStorage.getPatients());
    setDoctors(hospitalStorage.getDoctors());
    setAppointments(hospitalStorage.getAppointments());
    setReports(hospitalStorage.getReports());
    setGalleryItems(hospitalStorage.getGalleryItems());
    setNotifications(hospitalStorage.getNotifications(user?._id || user?.userId));
    setAuditLogs(hospitalStorage.getAuditLogs());
    setAnalytics(hospitalStorage.getAnalyticsStats());
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  // Appointment operations
  const bookAppointment = (data) => {
    try {
      const newApt = hospitalStorage.createAppointment(data, user);
      refreshData();
      showToast(`Appointment ${newApt.appointmentId} with Dr. Chandna booked!`, 'success');
      return newApt;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateAppointmentStatus = (appointmentId, status) => {
    try {
      const updated = hospitalStorage.updateAppointmentStatus(appointmentId, status, user);
      refreshData();
      showToast(`Encounter updated to ${status}`, 'success');
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const rescheduleAppointment = (appointmentId, date, time) => {
    try {
      const updated = hospitalStorage.rescheduleAppointment(appointmentId, date, time, user);
      refreshData();
      showToast(`Encounter rescheduled to ${date} at ${time}`, 'success');
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Medical Reports
  const createMedicalReport = (reportData) => {
    try {
      const newReport = hospitalStorage.createReport(reportData, user);
      refreshData();
      showToast(`Medical Report #${newReport.reportId} authored by Dr. Chandna. Patient notified.`, 'success');
      return newReport;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const acknowledgeReport = (reportId, notes = '') => {
    try {
      const acknowledged = hospitalStorage.acknowledgeReport(reportId, user, notes);
      refreshData();
      showToast(`Report acknowledged. Dr. Chandna has been notified.`, 'success');
      return acknowledged;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Patient Management
  const addPatient = (patientData) => {
    try {
      const newPat = hospitalStorage.createPatient(patientData, user);
      refreshData();
      showToast(`Patient profile created: ${newPat.name} (${newPat.patientId})`, 'success');
      return newPat;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updatePatient = (patientId, updates) => {
    try {
      const updated = hospitalStorage.updatePatient(patientId, updates, user);
      refreshData();
      showToast('Patient record saved', 'success');
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Gallery Operations (Requested by User: Patient Photo saved & Admin edit)
  const addGalleryItem = (galleryData) => {
    try {
      const item = hospitalStorage.createGalleryItem(galleryData, user);
      refreshData();
      showToast(`New patient photo added to LifeCare Gallery: "${item.title}"`, 'success');
      return item;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const updateGalleryItem = (itemId, updates) => {
    try {
      const updated = hospitalStorage.updateGalleryItem(itemId, updates, user);
      refreshData();
      showToast('Gallery item updated successfully', 'success');
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteGalleryItem = (itemId) => {
    try {
      hospitalStorage.deleteGalleryItem(itemId, user);
      refreshData();
      showToast('Photo record removed from gallery', 'info');
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Doctor Updates
  const updateDoctor = (doctorId, updates) => {
    try {
      const updated = hospitalStorage.updateDoctor(doctorId, updates, user);
      refreshData();
      showToast('Dr. Chandna credentials updated', 'success');
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Notifications
  const markNotificationRead = (notifId) => {
    hospitalStorage.markNotificationAsRead(notifId);
    refreshData();
  };

  const markAllNotificationsRead = () => {
    hospitalStorage.markAllNotificationsAsRead(user?._id || user?.userId);
    refreshData();
    showToast('All notifications marked as read', 'info');
  };

  return (
    <HospitalContext.Provider
      value={{
        patients,
        doctors,
        appointments,
        reports,
        galleryItems,
        notifications,
        auditLogs,
        analytics,
        bookAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        createMedicalReport,
        acknowledgeReport,
        addPatient,
        updatePatient,
        updateDoctor,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        markNotificationRead,
        markAllNotificationsRead,
        refreshData,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
}
