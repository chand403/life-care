# MedPulse Hospital Patient Record Management System

A role-based, production-ready Hospital Patient Record Management platform built with a modern healthcare interface, granular role-based authorization (Patient, Doctor, Admin), appointment scheduling with anti-double-booking protection, dynamic multi-drug prescription management, Cloudinary document and diagnostic file storage, digital receipt acknowledgement workflows, and compliance audit logging.

---

## 1. Key Roles & Capabilities

### Patient Portal
- **Demographic & Clinical Registration**: Generates permanent unique Patient ID (e.g. `PAT-2026-0001`), captures blood group, emergency contact, drug allergies, and medical history.
- **Appointment Scheduling**: Real-time slot picker with automated collision avoidance to prevent double-booking.
- **Report Receipt Verification**: Prominent **"Acknowledge / Received"** workflow for newly submitted medical reports; logs receipt timestamp, patient ID, and alerts the attending physician and administration.
- **Medical Records Timeline**: Chronological clinical history tracking encounters, diagnoses, medications, and lab attachments.
- **Printable Medical Reports**: Clean printable format with hospital letterhead and diagnostic findings.

### Doctor Portal
- **Clinical Dashboard**: Overview of today's schedule, upcoming encounters, pending report actions, and assigned patient roster.
- **Medical Report Creator**: Rich clinical note documentation (chief complaint, symptoms, diagnosis, vitals examination findings, treatment plan, lifestyle recommendations, follow-up date).
- **Dynamic Prescription Builder**: Dynamically add and remove medications with individual dosage, frequency, duration, and food/administration instructions.
- **Cloudinary Diagnostic Uploads**: Securely attach lab panels, ECGs, X-rays, and scans (PDF, JPG, PNG).
- **Encounter Management**: Confirm appointments, mark visits completed, or cancel consultations.

### Admin Portal
- **Executive Operations Console**: Key metrics (total patients, active physicians, today's appointments, completed visits, cancelled encounters, total reports).
- **Recharts Analytics**:
  - Longitudinal monthly patient admissions and appointments trajectory.
  - Doctor workload distribution across encounters and authored reports.
  - Encounter status ratio pie/doughnut visualization.
- **Patient Census Management**: Full directory with search, filters (blood group, gender, status), pagination, profile inspection, add patient, edit demographics, and deactivate/activate controls.
- **Physician Roster Management**: Manage credentials, departments, consultation fees, active availability days, and status.
- **Hospital Encounter Master**: Schedule oversight, confirmation overrides, and appointment rescheduling.
- **System Audit Trail**: Real-time compliance logging tracking user, action, resource, ID, and timestamps.
- **Organization Settings**: Facility name, emergency hotlines, and slot duration configuration.

---

## 2. Technology Stack

- **Language**: JavaScript (ESM & JSX) — Zero TypeScript files.
- **Frontend / UI**: React 19, Tailwind CSS, Lucide React icons.
- **Data Visualizations**: Recharts.
- **Data Models**: MongoDB with Mongoose schemas (User, Patient, Doctor, Appointment, MedicalReport, Notification, AuditLog).
- **Storage / Uploads**: Cloudinary integration utility for medical imaging and reports.
- **Security & Authorization**: Role-based access control (RBAC), password hashing utilities, sanitized client payloads.

---

## 3. Demo Credentials

The platform includes seed data ready for immediate testing:

| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@medpulse.org` | `admin123` | Full hospital console, patient & doctor management, analytics, audit logs |
| **Doctor** | `dr.jenkins@medpulse.org` | `doctor123` | Cardiology schedule, create medical reports, dynamic prescriptions |
| **Patient** | `patient@medpulse.org` | `patient123` | Patient ID `PAT-2026-0001`, appointment booking, report receipt acknowledgement |

*Tip: The dashboard sidebar and login page include **One-Click Demo Switcher** buttons to instantly jump between roles during evaluation.*

---

## 4. Environment Variables (`.env.local`)

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/medpulse_hospital

# NextAuth / JWT Secret
AUTH_SECRET=your_super_secret_jwt_encryption_key_here

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=medpulse-hospital
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Application URL
APP_URL=http://localhost:3000
```

---

## 5. Getting Started & Running Locally

### Install Dependencies
```bash
npm install
```

### Run Seed Script (MongoDB)
```bash
node scripts/seed.js
```

### Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
```

---

## 6. Medical Report Workflow Diagram

```
Patient books appointment (modality & slot anti-collision checked)
                     │
                     ▼
Doctor confirms appointment on clinical dashboard
                     │
                     ▼
Consultation takes place (in-person or telehealth)
                     │
                     ▼
Doctor opens encounter & creates Medical Report
  ├── Chief complaint & symptoms
  ├── Objective vitals & clinical examination
  ├── Primary diagnosis
  ├── Structured multi-drug prescription (medicine, dose, frequency, duration)
  └── Uploads lab panels / X-rays to Cloudinary
                     │
                     ▼
Doctor submits report  ──► Status = "Submitted"
  ├── Notification dispatched to Patient
  └── Audit Log recorded
                     │
                     ▼
Patient reviews report in Patient Portal
                     │
                     ▼
Patient clicks "Acknowledge / Mark as Received"
  ├── Status updated to "Received"
  ├── Receipt timestamp recorded
  ├── Doctor notified of patient acknowledgement
  └── Audit Log recorded
```

---

## 7. Security & Compliance

- **No Cross-Patient Leaks**: Attending doctors only have access to records of patients with scheduled or completed consultations with their practice.
- **Report Immutability**: Patients can never alter doctor-authored diagnoses, treatment plans, or prescriptions.
- **Sanitized Payloads**: Password hashes and administrative secrets are never transmitted to client endpoints.
- **Audit Logging**: Every report creation, appointment cancellation, and receipt acknowledgment is permanently recorded.
