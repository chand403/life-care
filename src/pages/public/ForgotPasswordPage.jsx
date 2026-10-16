import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { LifeCareLogo } from '../../components/ui/LifeCareLogo.jsx';

export function ForgotPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <LifeCareLogo size={42} showText={true} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Reset Portal Access Password
          </h1>
          <p className="text-xs text-slate-500">
            Enter the email registered to your patient, doctor, or staff account
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-xs font-bold text-emerald-900">Recovery Instructions Dispatched</h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              If an active hospital account matches <strong>{email}</strong>, a secure password reset link has been dispatched.
            </p>
            <button
              onClick={() => onNavigate('/login')}
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-rose-800 hover:underline"
            >
              <span>Return to Login</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@lifecare.org"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <span>Send Reset Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-xs">
          <button
            onClick={() => onNavigate('/login')}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
