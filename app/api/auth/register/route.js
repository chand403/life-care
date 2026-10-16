import connectToDatabase from '../../../../lib/mongodb.js';
import User from '../../../../models/User.js';
import Patient from '../../../../models/Patient.js';
import AuditLog from '../../../../models/AuditLog.js';
import { hashPassword, sanitizeUser } from '../../../../lib/auth.js';
import { generatePatientId } from '../../../../lib/utils.js';

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    const { name, email, password, phone, dateOfBirth, gender, bloodGroup } = data;

    if (!name || !email || !password || !phone || !dateOfBirth || !gender || !bloodGroup) {
      return Response.json(
        { success: false, message: 'All required registration fields must be provided.' },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return Response.json(
        { success: false, message: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const patientId = generatePatientId();
    const hashedPassword = hashPassword(password);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'patient',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      isActive: true,
    });

    const newPatient = await Patient.create({
      userId: newUser._id,
      patientId,
      name,
      email: email.toLowerCase(),
      phone,
      dateOfBirth,
      gender,
      bloodGroup,
      address: {
        street: data.street || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        country: 'USA',
      },
      emergencyContact: {
        name: data.emergencyName || '',
        relation: data.emergencyRelation || '',
        phone: data.emergencyPhone || '',
      },
      allergies: data.allergies ? (Array.isArray(data.allergies) ? data.allergies : data.allergies.split(',')) : [],
      medicalConditions: data.medicalConditions ? (Array.isArray(data.medicalConditions) ? data.medicalConditions : data.medicalConditions.split(',')) : [],
      status: 'Active',
    });

    // Record Audit Log
    await AuditLog.create({
      userId: newUser._id.toString(),
      userName: name,
      userRole: 'patient',
      action: 'PATIENT_REGISTERED',
      resource: 'Patient',
      resourceId: patientId,
      metadata: { email },
    });

    const safeUser = sanitizeUser(newUser.toObject());

    return Response.json({
      success: true,
      message: `Registration successful. Your permanent Patient ID is ${patientId}.`,
      user: { ...safeUser, patientProfile: newPatient, patientId },
    }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message || 'Error creating patient account.' },
      { status: 500 }
    );
  }
}
