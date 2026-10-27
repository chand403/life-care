# LifeCare Hospital Patient Record Management System

A browser-based hospital management demo with patient, doctor, and administrator portals. It includes seeded sample records, appointment scheduling, medical reports, prescriptions, notifications, audit logs, and a patient photo gallery.

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
- **Demo Data**: Seed records in `src/data/mockData.js`, persisted in browser `localStorage` by `src/services/storage.js`.
- **Storage / Uploads**: Browser-local demo storage. MongoDB models, API routes, and Cloudinary utilities in the repository are not connected to the Vite client runtime.

---

## 3. Demo Credentials

The browser demo includes these accounts:

| Role | Email | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Staff (Doctor & Admin)** | `admin@lifecare.org` | `admin123` | Hospital console, patient records, appointments, reports, gallery, audit logs |
| **Staff alias** | `dr.chandna@lifecare.org` | `doctor123` | Same combined staff portal |
| **Patient** | `patient@lifecare.org` | `patient123` | Patient ID `PAT-2026-0001`, appointments, reports, and prescriptions |

*Tip: The dashboard sidebar and login page include **One-Click Demo Switcher** buttons to instantly jump between roles during evaluation.*

---

## 4. Demo Data and Persistence

No environment file or database is required to run the Vite app. The initial sample data is copied into `localStorage` in the current browser profile and changes remain local to that browser; they are not shared across devices or users. Clearing this site's storage restores the initial demo records on the next load.

The `app/api`, `models`, and `scripts` directories are not mounted by the Vite server. Adding MongoDB or Cloudinary credentials alone does not connect those services to this client app.

---

## 5. Getting Started & Running Locally

### Install Dependencies
```bash
npm install
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

- This is a demo, not a production medical-record system. Demo accounts, credentials, and records are client-side and must not be treated as secure authentication or authorization.
- Do not enter real patient, medical, or other sensitive personal information.
- A production deployment needs a connected backend with server-side authentication, authorization, protected persistent storage, and appropriately secured file uploads. The current browser-local audit log is not a compliance record.
