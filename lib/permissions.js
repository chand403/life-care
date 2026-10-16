/**
 * Role-Based Access Control and Permission Verifiers
 * Security requirement: Users must never access another user's private medical
 * information by altering IDs.
 */

export const ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
};

/**
 * Checks whether user can view a given patient's profile and medical records
 */
export function canViewPatientRecord(currentUser, patientId, assignedDoctorIds = []) {
  if (!currentUser) return false;
  if (currentUser.role === ROLES.ADMIN) return true;
  if (currentUser.role === ROLES.PATIENT && currentUser.patientId === patientId) return true;
  if (currentUser.role === ROLES.DOCTOR && assignedDoctorIds.includes(currentUser.doctorId)) return true;
  return false;
}

/**
 * Checks whether user can create or edit a medical report
 * Only the attending Doctor can author reports
 */
export function canCreateMedicalReport(currentUser, doctorId) {
  if (!currentUser) return false;
  if (currentUser.role === ROLES.ADMIN) return true;
  if (currentUser.role === ROLES.DOCTOR && (!doctorId || currentUser.doctorId === doctorId)) return true;
  return false;
}

/**
 * Checks whether user can acknowledge receipt of a medical report
 * Only the specific Patient for whom the report is written can acknowledge it!
 */
export function canAcknowledgeReport(currentUser, report) {
  if (!currentUser || !report) return false;
  if (currentUser.role === ROLES.PATIENT && currentUser.patientId === report.patientId) {
    return report.status === 'Submitted';
  }
  return false;
}

/**
 * Checks if user is authorized to manage appointments
 */
export function canManageAppointment(currentUser, appointment) {
  if (!currentUser || !appointment) return false;
  if (currentUser.role === ROLES.ADMIN) return true;
  if (currentUser.role === ROLES.DOCTOR && currentUser.doctorId === appointment.doctorId) return true;
  if (currentUser.role === ROLES.PATIENT && currentUser.patientId === appointment.patientId) return true;
  return false;
}
