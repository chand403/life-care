import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { HospitalProvider } from './context/HospitalContext.jsx';

// Navigation Components
import { PublicNavbar } from './components/navigation/PublicNavbar.jsx';
import { DashboardLayout } from './components/navigation/DashboardLayout.jsx';

// Public Pages
import { LandingPage } from './pages/public/LandingPage.jsx';
import { AboutPage } from './pages/public/AboutPage.jsx';
import { DoctorsDirectoryPage } from './pages/public/DoctorsDirectoryPage.jsx';
import { DoctorProfilePage } from './pages/public/DoctorProfilePage.jsx';
import { GalleryPage } from './pages/public/GalleryPage.jsx';
import { LoginPage } from './pages/public/LoginPage.jsx';
import { RegisterPage } from './pages/public/RegisterPage.jsx';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage.jsx';

// Patient Pages
import { PatientDashboard } from './pages/patient/PatientDashboard.jsx';
import { PatientProfilePage } from './pages/patient/PatientProfilePage.jsx';
import { PatientAppointmentsPage } from './pages/patient/PatientAppointmentsPage.jsx';
import { PatientReportsPage } from './pages/patient/PatientReportsPage.jsx';
import { PatientMedicalRecordsPage } from './pages/patient/PatientMedicalRecordsPage.jsx';

// Doctor Pages
import { DoctorDashboard } from './pages/doctor/DoctorDashboard.jsx';
import { DoctorAppointmentsPage } from './pages/doctor/DoctorAppointmentsPage.jsx';
import { DoctorPatientsPage } from './pages/doctor/DoctorPatientsPage.jsx';
import { DoctorReportsPage } from './pages/doctor/DoctorReportsPage.jsx';
import { DoctorProfilePage as DoctorClinicalProfilePage } from './pages/doctor/DoctorProfilePage.jsx';
import { CreateReportPage } from './pages/doctor/CreateReportPage.jsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { AdminPatientsPage } from './pages/admin/AdminPatientsPage.jsx';
import { AdminDoctorsPage } from './pages/admin/AdminDoctorsPage.jsx';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage.jsx';
import { AdminReportsPage } from './pages/admin/AdminReportsPage.jsx';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage.jsx';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.jsx';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage.jsx';

function AppContent() {
  const { user } = useAuth();

  // Route state initialized from window.location.hash or '/'
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash ? hash.split('?')[0] : '/';
  });

  // Keep browser URL hash synchronized with application state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setCurrentRoute(hash.split('?')[0]);
      } else {
        setCurrentRoute('/');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
    setCurrentRoute(path.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Guard: Protected paths require login & matched roles
  const isPatientRoute = currentRoute.startsWith('/patient');
  const isDoctorRoute = currentRoute.startsWith('/doctor');
  const isAdminRoute = currentRoute.startsWith('/admin');
  const isDashboardRoute = isPatientRoute || isDoctorRoute || isAdminRoute;

  // Auto-redirect if unauthenticated user attempts private route
  if (isDashboardRoute && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <PublicNavbar currentRoute={currentRoute} onNavigate={navigate} />
        <LoginPage onNavigate={navigate} />
      </div>
    );
  }

  // Cross-role protection (Requirement 2 & 23)
  if (isPatientRoute && user?.role !== 'patient' && user?.role !== 'admin') {
    return (
      <DashboardLayout
        currentRoute={currentRoute}
        onNavigate={navigate}
        breadcrumbs={['Access Restricted']}
      >
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-800">Access Restricted</h3>
          <p className="text-xs text-slate-500 mt-1">This section is reserved for patients.</p>
          <button
            onClick={() => navigate(`/${user.role}/dashboard`)}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
          >
            Go to My Portal
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (isDoctorRoute && user?.role !== 'doctor' && user?.role !== 'admin') {
    return (
      <DashboardLayout
        currentRoute={currentRoute}
        onNavigate={navigate}
        breadcrumbs={['Access Restricted']}
      >
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-800">Physician Access Only</h3>
          <p className="text-xs text-slate-500 mt-1">
            Clinical report creation and patient medical records are restricted to attending physicians.
          </p>
          <button
            onClick={() => navigate(`/${user.role}/dashboard`)}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
          >
            Go to My Portal
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (isAdminRoute && user?.role !== 'admin' && user?.role !== 'doctor') {
    return (
      <DashboardLayout
        currentRoute={currentRoute}
        onNavigate={navigate}
        breadcrumbs={['Access Restricted']}
      >
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <h3 className="text-base font-bold text-slate-800">Administrator Access Required</h3>
          <p className="text-xs text-slate-500 mt-1">Hospital configuration and staff rosters require staff credentials.</p>
          <button
            onClick={() => navigate(`/${user.role}/dashboard`)}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
          >
            Go to My Portal
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // --- Dynamic Route Rendering ---

  // 1. Doctor Profile Page (`/doctors/:doctorId`)
  if (currentRoute.startsWith('/doctors/') && currentRoute.length > 9) {
    const docId = currentRoute.replace('/doctors/', '');
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <PublicNavbar currentRoute={currentRoute} onNavigate={navigate} />
        <main className="flex-1">
          <DoctorProfilePage doctorId={docId} onNavigate={navigate} />
        </main>
      </div>
    );
  }

  // 2. Doctor Report Create Page (`/doctor/reports/create/:patientId`)
  if (currentRoute.startsWith('/doctor/reports/create/')) {
    const parts = currentRoute.replace('/doctor/reports/create/', '').split('?');
    const patId = parts[0];
    const hashQuery = window.location.hash.split('?')[1] || '';
    const params = new URLSearchParams(hashQuery);
    const appointmentId = params.get('appointmentId') || '';

    return (
      <DashboardLayout
        currentRoute={currentRoute}
        onNavigate={navigate}
        breadcrumbs={['Reports', 'New Consultation Report']}
      >
        <CreateReportPage
          patientId={patId}
          appointmentId={appointmentId}
          onNavigate={navigate}
        />
      </DashboardLayout>
    );
  }

  // 3. Patient Portal
  if (isPatientRoute) {
    let breadcrumb = 'Dashboard';
    let content = <PatientDashboard onNavigate={navigate} />;

    if (currentRoute === '/patient/profile') {
      breadcrumb = 'My Health Profile';
      content = <PatientProfilePage />;
    } else if (currentRoute === '/patient/appointments' || currentRoute === '/patient/appointments/book') {
      breadcrumb = 'Appointments';
      content = <PatientAppointmentsPage onNavigate={navigate} />;
    } else if (currentRoute === '/patient/reports') {
      breadcrumb = 'Medical Reports & Prescriptions';
      content = <PatientReportsPage />;
    } else if (currentRoute === '/patient/medical-records') {
      breadcrumb = 'Clinical Timeline';
      content = <PatientMedicalRecordsPage />;
    } else if (currentRoute === '/patient/doctors') {
      breadcrumb = 'Hospital Specialists';
      content = <DoctorsDirectoryPage onNavigate={navigate} />;
    }

    return (
      <DashboardLayout
        currentRoute={currentRoute}
        onNavigate={navigate}
        breadcrumbs={[breadcrumb]}
      >
        {content}
      </DashboardLayout>
    );
  }

  // 4. Doctor Portal
  if (isDoctorRoute) {
    let breadcrumb = 'Clinical Dashboard';
    let content = <DoctorDashboard onNavigate={navigate} />;

    if (currentRoute === '/doctor/appointments') {
      breadcrumb = 'Consultation Schedule';
      content = <DoctorAppointmentsPage onNavigate={navigate} />;
    } else if (currentRoute === '/doctor/patients') {
      breadcrumb = 'Assigned Patients';
      content = <DoctorPatientsPage onNavigate={navigate} />;
    } else if (currentRoute === '/doctor/reports') {
      breadcrumb = 'Medical Reports & Prescriptions';
      content = <DoctorReportsPage onNavigate={navigate} />;
    } else if (currentRoute === '/doctor/profile') {
      breadcrumb = 'Physician Profile & Fees';
      content = <DoctorClinicalProfilePage />;
    }

    return (
      <DashboardLayout
        currentRoute={currentRoute}
        onNavigate={navigate}
        breadcrumbs={[breadcrumb]}
      >
        {content}
      </DashboardLayout>
    );
  }

  // 5. Admin Portal
  if (isAdminRoute) {
    let breadcrumb = 'Hospital Overview';
    let content = <AdminDashboard onNavigate={navigate} />;

    if (currentRoute === '/admin/patients') {
      breadcrumb = 'Patients Management';
      content = <AdminPatientsPage onNavigate={navigate} />;
    } else if (currentRoute === '/admin/doctors') {
      breadcrumb = 'Medical Staff Management';
      content = <AdminDoctorsPage onNavigate={navigate} />;
    } else if (currentRoute === '/admin/appointments') {
      breadcrumb = 'Hospital Encounters';
      content = <AdminAppointmentsPage />;
    } else if (currentRoute === '/admin/reports') {
      breadcrumb = 'Medical Reports Oversight';
      content = <AdminReportsPage />;
    } else if (currentRoute === '/admin/audit-logs') {
      breadcrumb = 'System Audit Trail';
      content = <AdminAuditLogsPage />;
    } else if (currentRoute === '/admin/settings') {
      breadcrumb = 'Organization Settings';
      content = <AdminSettingsPage />;
    } else if (currentRoute === '/admin/gallery') {
      breadcrumb = 'Patient Photo Gallery Editor';
      content = <AdminGalleryPage onNavigate={navigate} />;
    }

    return (
      <DashboardLayout
        currentRoute={currentRoute}
        onNavigate={navigate}
        breadcrumbs={[breadcrumb]}
      >
        {content}
      </DashboardLayout>
    );
  }

  // 6. Public Landing & Informational Pages
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNavbar currentRoute={currentRoute} onNavigate={navigate} />
      <main className="flex-1">
        {currentRoute === '/about' && <AboutPage onNavigate={navigate} />}
        {currentRoute === '/doctors' && <DoctorsDirectoryPage onNavigate={navigate} />}
        {currentRoute === '/gallery' && <GalleryPage onNavigate={navigate} />}
        {currentRoute === '/login' && <LoginPage onNavigate={navigate} />}
        {currentRoute === '/register' && <RegisterPage onNavigate={navigate} />}
        {currentRoute === '/forgot-password' && <ForgotPasswordPage onNavigate={navigate} />}
        {(currentRoute === '/' || currentRoute === '') && (
          <LandingPage onNavigate={navigate} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HospitalProvider>
        <AppContent />
      </HospitalProvider>
    </AuthProvider>
  );
}
