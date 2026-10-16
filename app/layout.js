import './globals.css';

export const metadata = {
  title: 'MedPulse Hospital Patient Record Management System',
  description: 'Production-ready hospital patient record management system featuring role-based portals for patients, doctors, and administrators with appointment booking, medical records, and digital prescription workflows.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
