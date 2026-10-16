import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Patient Recovery',
        'Clinical Milestone',
        'Pediatric Wellness',
        'Orthopedic Rehab',
        'Cardiac Care',
        'Hospital Facilities',
      ],
      default: 'Patient Recovery',
    },
    patientId: {
      type: String,
      default: '',
    },
    patientName: {
      type: String,
      default: '',
    },
    doctorName: {
      type: String,
      default: 'Dr. Chandna',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

GalleryItemSchema.index({ category: 1 });
GalleryItemSchema.index({ patientId: 1 });

export default mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema);
