import React, { useState } from 'react';
import { Menu, X, ArrowRight, User, Stethoscope, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { LifeCareLogo } from '../ui/LifeCareLogo.jsx';

export function PublicNavbar({ currentRoute, onNavigate }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Patient Gallery', route: '/gallery' },
    { label: 'Dr. Chandna', route: '/doctors/DOC-CHANDNA' },
    { label: 'About LifeCare', route: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Brand Wordmark with Official Stethoscope + Red Cross Logo */}
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-left group"
          >
            <LifeCareLogo size={36} showText={true} />
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => onNavigate(link.route)}
                className={`transition-colors hover:text-rose-600 ${
                  currentRoute === link.route ? 'text-rose-600 font-bold border-b-2 border-rose-600 pb-1' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions (Patient & Unified Staff Login) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate(user.role === 'patient' ? '/patient/dashboard' : '/admin/dashboard')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors shadow-2xs"
                >
                  {user.role === 'patient' ? (
                    <User className="w-3.5 h-3.5 text-rose-600" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span>
                    {user.role === 'patient' ? 'Patient Portal' : 'Dr. Chandna (Staff Console)'}
                  </span>
                  <ArrowRight className="w-3 h-3 text-rose-600" />
                </button>
                <button
                  onClick={logout}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-rose-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('/register')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs"
                >
                  <span>Patient Register</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => {
                  onNavigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                  currentRoute === link.route ? 'bg-rose-50 text-rose-700' : 'text-slate-700'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  onNavigate(user.role === 'patient' ? '/patient/dashboard' : '/admin/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-xs font-bold text-white bg-rose-600 rounded-xl"
              >
                Open Dashboard ({user.name.split(' ')[0]})
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    onNavigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Sign In (Patient or Staff)
                </button>
                <button
                  onClick={() => {
                    onNavigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-rose-600 rounded-xl"
                >
                  Patient Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
