import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    patientId: {
      type: String,
      required: true,
      ref: 'Patient',
    },
    doctorId: {
      type: String,
      required: true,
      ref: 'Doctor',
    },
    date: {
      type: String,
      required: true, // YYYY-MM-DD format
    },
    time: {
      type: String,
      required: true, // e.g. "10:00 AM"
    },
    type: {
      type: String,
      enum: ['In-person', 'Online consultation'],
      default: 'In-person',
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'No-show'],
      default: 'Pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent double-booking of doctor on the same date and time
AppointmentSchema.index({ doctorId: 1, date: 1, time: 1, status: 1 });
AppointmentSchema.index({ patientId: 1, date: 1 });
AppointmentSchema.index({ appointmentId: 1 });

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
