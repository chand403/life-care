import React, { createContext, useContext, useState, useEffect } from 'react';
import { hospitalStorage } from '../services/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const savedUser = hospitalStorage.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.id === Date.now() ? null : null));
    }, 4000);
  };

  const login = async (email, password) => {
    try {
      const loggedIn = hospitalStorage.login(email, password);
      setUser(loggedIn);
      showToast(`Welcome back to LifeCare, ${loggedIn.name}!`, 'success');
      return loggedIn;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Combined Doctor & Admin Login
  const loginAsDemo = (role) => {
    if (role === 'patient') {
      return login('patient@lifecare.org', 'patient123');
    } else {
      // Unified Staff: Doctor & Admin (Dr. Chandna)
      return login('admin@lifecare.org', 'admin123');
    }
  };

  const register = async (patientData) => {
    try {
      const registered = hospitalStorage.registerPatient(patientData);
      setUser(registered);
      showToast(`Welcome to LifeCare! Your permanent Patient ID is ${registered.patientId}`, 'success');
      return registered;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const logout = () => {
    hospitalStorage.logout();
    setUser(null);
    showToast('You have been logged out securely.', 'info');
  };

  const updateUserProfile = (updates) => {
    if (!user) return;
    if (user.role === 'patient') {
      const updatedPatient = hospitalStorage.updatePatient(user.patientId, updates, user);
      const updatedUser = { ...user, patientProfile: updatedPatient, name: updates.name || user.name };
      setUser(updatedUser);
      hospitalStorage.setCurrentUser(updatedUser);
      showToast('Patient record saved successfully', 'success');
    } else {
      const updatedDoctor = hospitalStorage.updateDoctor('DOC-CHANDNA', updates, user);
      const updatedUser = { ...user, doctorProfile: updatedDoctor, name: updates.name || user.name };
      setUser(updatedUser);
      hospitalStorage.setCurrentUser(updatedUser);
      showToast('Dr. Chandna credentials updated', 'success');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginAsDemo,
        register,
        logout,
        updateUserProfile,
        showToast,
      }}
    >
      {children}
      {/* Toast Notification Banner with LifeCare Crimson Theme */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-300">
          <div
            className={`p-4 rounded-xl shadow-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
              toastMessage.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : toastMessage.type === 'info'
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  toastMessage.type === 'error'
                    ? 'bg-rose-600'
                    : toastMessage.type === 'info'
                    ? 'bg-sky-400'
                    : 'bg-rose-600'
                }`}
              />
              <span>{toastMessage.message}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs opacity-70 hover:opacity-100 px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
