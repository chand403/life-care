import connectToDatabase from '../../../lib/mongodb.js';
import Appointment from '../../../models/Appointment.js';
import Notification from '../../../models/Notification.js';
import AuditLog from '../../../models/AuditLog.js';
import { generateAppointmentId } from '../../../lib/utils.js';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');

    let query = {};
    if (doctorId) query.doctorId = doctorId;
    if (patientId) query.patientId = patientId;
    if (status) query.status = status;

    const appointments = await Appointment.find(query).sort({ date: -1, time: 1 });
    return Response.json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    const { doctorId, patientId, date, time, reason, type } = data;

    if (!doctorId || !patientId || !date || !time || !reason) {
      return Response.json(
        { success: false, message: 'Please provide doctor, patient, date, time, and reason.' },
        { status: 400 }
      );
    }

    // Anti-Double Booking Check (Requirement 7)
    const existingBooking = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: 'Cancelled' },
    });

    if (existingBooking) {
      return Response.json(
        {
          success: false,
          message: `Doctor is already scheduled for ${time} on ${date}. Please select an alternate slot.`,
        },
        { status: 409 }
      );
    }

    const appointmentId = generateAppointmentId();

    const newAppointment = await Appointment.create({
      appointmentId,
      patientId,
      doctorId,
      date,
      time,
      type: type || 'In-person',
      reason,
      status: 'Confirmed',
    });

    // Notify Doctor and Patient
    await Notification.create([
      {
        userId: doctorId,
        title: 'New Patient Booking',
        message: `Patient ${patientId} scheduled a consultation on ${date} at ${time}.`,
        type: 'appointment',
        relatedId: appointmentId,
      },
      {
        userId: patientId,
        title: 'Appointment Confirmed',
        message: `Your appointment with Doctor ${doctorId} on ${date} at ${time} is scheduled.`,
        type: 'appointment',
        relatedId: appointmentId,
      },
    ]);

    // Audit log
    await AuditLog.create({
      userId: patientId,
      userName: data.patientName || 'Patient',
      userRole: 'patient',
      action: 'APPOINTMENT_CREATED',
      resource: 'Appointment',
      resourceId: appointmentId,
      metadata: { doctorId, date, time },
    });

    return Response.json({
      success: true,
      message: 'Appointment scheduled successfully.',
      appointment: newAppointment,
    }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
