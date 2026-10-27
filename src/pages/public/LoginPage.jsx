import React, { useEffect, useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  User,
  AlertCircle,
  Stethoscope,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { LifeCareLogo } from '../../components/ui/LifeCareLogo.jsx';

export function LoginPage({ onNavigate }) {
  const { login, loginAsDemo } = useAuth();
  const [activeTab, setActiveTab] = useState('staff'); // 'staff' (Doctor & Admin combined) or 'patient'
  const [email, setEmail] = useState('admin@lifecare.org');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoAccess, setShowDemoAccess] = useState(false);

  useEffect(() => {
    if (!showDemoAccess) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') setShowDemoAccess(false);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showDemoAccess]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
    if (tab === 'staff') {
      setEmail('admin@lifecare.org');
      setPassword('admin123');
    } else {
      setEmail('patient@lifecare.org');
      setPassword('patient123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'patient') {
        onNavigate('/patient/dashboard');
      } else {
        // Combined Doctor & Admin opens the unified Admin & Clinical dashboard
        onNavigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFastStaffLogin = () => {
    setError('');
    setShowDemoAccess(false);
    loginAsDemo('admin');
    onNavigate('/admin/dashboard');
  };

  const handleFastPatientLogin = () => {
    setError('');
    setShowDemoAccess(false);
    loginAsDemo('patient');
    onNavigate('/patient/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50/50">
      <div className="w-full max-w-md space-y-6">
        {/* Branding header with LifeCare Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <LifeCareLogo size={46} showText={true} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Sign In to LifeCare Portal
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Unified healthcare portal for patient records, clinical encounters, and hospital operations
          </p>
        </div>

        {/* Combined Login Tab Switcher */}
        <div className="bg-slate-200/80 p-1 rounded-xl grid grid-cols-2 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleTabSwitch('staff')}
            className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'staff'
                ? 'bg-white text-rose-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span>Doctor & Admin Staff</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('patient')}
            className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'patient'
                ? 'bg-white text-rose-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-rose-600" />
            <span>Patient Portal</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowDemoAccess(true)}
          className="mx-auto inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-800 transition-colors hover:bg-rose-50"
        >
          <Stethoscope className="h-4 w-4" />
          Demo Access
        </button>

        {/* Standard Login Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pb-1 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              {activeTab === 'staff'
                ? 'Doctor & Admin Staff Credentials'
                : 'Patient Account Credentials'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {activeTab === 'staff' ? 'dr.chandna@lifecare.org' : 'patient@lifecare.org'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activeTab === 'staff'
                      ? 'admin@lifecare.org or dr.chandna@lifecare.org'
                      : 'patient@lifecare.org'
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="text-rose-600 hover:text-rose-800 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>
                {loading
                  ? 'Authenticating...'
                  : activeTab === 'staff'
                  ? 'Sign In as Doctor & Admin Staff'
                  : 'Sign In to Patient Portal'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have a patient account?{' '}
            <button
              onClick={() => onNavigate('/register')}
              className="font-bold text-rose-600 hover:underline"
            >
              Register as New Patient
            </button>
          </div>
        </div>
      </div>

      {showDemoAccess && (
        <div className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-[2px]">
          <button
            type="button"
            aria-label="Close demo access panel"
            onClick={() => setShowDemoAccess(false)}
            className="absolute inset-0 h-full w-full cursor-default"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-access-title"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Demo Accounts
                </p>
                <h2 id="demo-access-title" className="mt-1 text-lg font-bold text-slate-900">
                  1-Click Fast Demonstration Access
                </h2>
                <p className="mt-1 text-xs text-slate-500">No typing needed</p>
              </div>
              <button
                type="button"
                aria-label="Close demo access"
                onClick={() => setShowDemoAccess(false)}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 p-6">
              <button
                type="button"
                onClick={handleFastStaffLogin}
                className="flex w-full items-center gap-4 rounded-lg border border-rose-200 p-4 text-left transition-colors hover:bg-rose-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-900">Dr. Chandna</span>
                  <span className="mt-0.5 block text-xs text-slate-600">Doctor &amp; Admin Staff</span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-rose-700" />
              </button>

              <button
                type="button"
                onClick={handleFastPatientLogin}
                className="flex w-full items-center gap-4 rounded-lg border border-slate-200 p-4 text-left transition-colors hover:bg-slate-50"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <User className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-slate-900">James Wilson</span>
                  <span className="mt-0.5 block text-xs text-slate-600">Verified Patient</span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-slate-500" />
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
