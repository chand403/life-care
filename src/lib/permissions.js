export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

export function canViewPatientRecord(currentUser, patientId, assignedDoctorIds = []) {
  if (!currentUser) return false;
  if (currentUser.role === ROLES.ADMIN) return true;
  if (currentUser.role === ROLES.PATIENT && currentUser.patientId === patientId) return true;
  if (currentUser.role === ROLES.DOCTOR && assignedDoctorIds.includes(currentUser.doctorId)) return true;
  return false;
}

export function canCreateMedicalReport(currentUser, doctorId) {
  if (!currentUser) return false;
  if (currentUser.role === ROLES.ADMIN) return true;
  if (currentUser.role === ROLES.DOCTOR && (!doctorId || currentUser.doctorId === doctorId)) return true;
  return false;
}

export function canAcknowledgeReport(currentUser, report) {
  if (!currentUser || !report) return false;
  if (currentUser.role === ROLES.PATIENT && currentUser.patientId === report.patientId) {
    return report.status === 'Submitted';
  }
  return false;
}

export function canManageAppointment(currentUser, appointment) {
  if (!currentUser || !appointment) return false;
  if (currentUser.role === ROLES.ADMIN) return true;
  if (currentUser.role === ROLES.DOCTOR && currentUser.doctorId === appointment.doctorId) return true;
  if (currentUser.role === ROLES.PATIENT && currentUser.patientId === appointment.patientId) return true;
  return false;
}
