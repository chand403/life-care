import connectToDatabase from '../../../lib/mongodb.js';
import MedicalReport from '../../../models/MedicalReport.js';
import Notification from '../../../models/Notification.js';
import AuditLog from '../../../models/AuditLog.js';
import { generateReportId } from '../../../lib/utils.js';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');
    const status = searchParams.get('status');

    let query = {};
    if (patientId) query.patientId = patientId;
    if (doctorId) query.doctorId = doctorId;
    if (status) query.status = status;

    const reports = await MedicalReport.find(query).sort({ consultationDate: -1 });
    return Response.json({ success: true, count: reports.length, reports });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    const {
      patientId,
      doctorId,
      appointmentId,
      chiefComplaint,
      symptoms,
      diagnosis,
      treatmentPlan,
      prescriptions,
      attachments,
    } = data;

    if (!patientId || !doctorId || !diagnosis || !treatmentPlan) {
      return Response.json(
        { success: false, message: 'Patient, Doctor, Diagnosis, and Treatment Plan are required.' },
        { status: 400 }
      );
    }

    const reportId = generateReportId();

    const report = await MedicalReport.create({
      reportId,
      patientId,
      doctorId,
      appointmentId: appointmentId || 'CLINIC-WALKIN',
      chiefComplaint,
      symptoms,
      diagnosis,
      examination: data.examination || '',
      treatmentPlan,
      recommendations: data.recommendations || '',
      followUpDate: data.followUpDate || '',
      prescriptions: prescriptions || [],
      attachments: attachments || [],
      status: 'Submitted',
      submittedAt: new Date(),
    });

    // Notify Patient
    await Notification.create({
      userId: patientId,
      title: 'New Medical Report Released',
      message: `Your attending physician published Medical Report #${reportId}. Please review and acknowledge receipt.`,
      type: 'report',
      relatedId: reportId,
    });

    // Audit Log
    await AuditLog.create({
      userId: doctorId,
      userName: data.doctorName || 'Attending Physician',
      userRole: 'doctor',
      action: 'REPORT_SUBMITTED',
      resource: 'MedicalReport',
      resourceId: reportId,
      metadata: { patientId, prescriptionCount: (prescriptions || []).length },
    });

    return Response.json({
      success: true,
      message: 'Medical report created and submitted to patient.',
      report,
    }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Receipt Acknowledgement Route (PATCH)
export async function PATCH(request) {
  try {
    await connectToDatabase();
    const { reportId, patientId, notes } = await request.json();

    if (!reportId || !patientId) {
      return Response.json(
        { success: false, message: 'Report ID and Patient ID are required for acknowledgement.' },
        { status: 400 }
      );
    }

    const report = await MedicalReport.findOne({ reportId });
    if (!report) {
      return Response.json({ success: false, message: 'Report not found.' }, { status: 404 });
    }

    // Security Check: Patient must be the owner of the report!
    if (report.patientId !== patientId) {
      return Response.json(
        { success: false, message: 'Unauthorized. You cannot acknowledge another patient\'s report.' },
        { status: 403 }
      );
    }

    const timestamp = new Date();
    report.status = 'Received';
    report.receivedAt = timestamp;
    report.patientAcknowledgement = {
      acknowledged: true,
      acknowledgedBy: patientId,
      timestamp,
      notes: notes || 'Acknowledged receipt of clinical summary and prescription instructions.',
    };

    await report.save();

    // Notify Attending Doctor
    await Notification.create({
      userId: report.doctorId,
      title: 'Report Received by Patient',
      message: `Patient ${patientId} has reviewed and acknowledged Medical Report #${reportId}.`,
      type: 'report',
      relatedId: reportId,
    });

    // Audit log
    await AuditLog.create({
      userId: patientId,
      userName: `Patient ${patientId}`,
      userRole: 'patient',
      action: 'REPORT_ACKNOWLEDGED',
      resource: 'MedicalReport',
      resourceId: reportId,
      metadata: { receivedAt: timestamp },
    });

    return Response.json({
      success: true,
      message: 'Report receipt successfully confirmed.',
      report,
    });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
