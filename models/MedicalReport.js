import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String, default: '' },
});

const AttachmentSchema = new mongoose.Schema({
  publicId: { type: String, required: true },
  url: { type: String, required: true },
  secureUrl: { type: String, required: true },
  name: { type: String, required: true },
  fileType: { type: String, required: true },
  sizeBytes: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now },
});

const MedicalReportSchema = new mongoose.Schema(
  {
    reportId: {
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
    appointmentId: {
      type: String,
      required: true,
      ref: 'Appointment',
    },
    chiefComplaint: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    examination: {
      type: String,
      default: '',
    },
    treatmentPlan: {
      type: String,
      required: true,
    },
    recommendations: {
      type: String,
      default: '',
    },
    followUpDate: {
      type: String,
      default: '',
    },
    prescriptions: [PrescriptionSchema],
    attachments: [AttachmentSchema],
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Received', 'Archived'],
      default: 'Submitted',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    receivedAt: {
      type: Date,
      default: null,
    },
    patientAcknowledgement: {
      acknowledged: { type: Boolean, default: false },
      acknowledgedBy: { type: String, default: null },
      timestamp: { type: Date, default: null },
      notes: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

MedicalReportSchema.index({ reportId: 1 });
MedicalReportSchema.index({ patientId: 1 });
MedicalReportSchema.index({ doctorId: 1 });
MedicalReportSchema.index({ appointmentId: 1 });
MedicalReportSchema.index({ status: 1 });

export default mongoose.models.MedicalReport || mongoose.model('MedicalReport', MedicalReportSchema);
