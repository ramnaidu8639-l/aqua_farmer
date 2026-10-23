import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, Anchor, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const { login, register, authError, switchDemoPersona } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('Bhimavaram, Andhra Pradesh');
  const [farmType, setFarmType] = useState('Shrimp Farming (Vannamei)');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);

    if (mode === 'login') {
      const ok = await login(email, password);
      if (ok) {
        onClose();
      }
    } else {
      if (!name || !email || !password || !mobile || !location) {
        setLocalError('Please fill out all required fields');
        setSubmitting(false);
        return;
      }
      const ok = await register({
        name,
        email,
        password,
        mobile,
        location,
        farm_type: farmType,
      });
      if (ok) {
        onClose();
      }
    }
    setSubmitting(false);
  };

  const error = localError || authError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-sky-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-br from-sky-950 via-teal-900 to-sky-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-lg bg-teal-400 text-sky-950 flex items-center justify-center font-black">
              AF
            </span>
            <span className="text-xs uppercase tracking-widest text-teal-300 font-bold">Aqua Farmers Portal</span>
          </div>

          <h3 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Farmer Sign In' : 'Join Aqua Farmers'}
          </h3>
          <p className="text-xs text-sky-200 mt-1">
            {mode === 'login'
              ? 'Access real-time verified prices, local advisories & farm records'
              : 'Register to customize your local mandi rates and seasonal alerts'}
          </p>
        </div>

        {/* Quick Demo Switcher Strip */}
        <div className="p-3 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-slate-500">Quick Demo Logins:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                switchDemoPersona('farmer_ramesh');
                onClose();
              }}
              className="px-2 py-0.5 rounded bg-white border border-sky-200 text-sky-800 font-medium hover:bg-sky-100 transition text-[11px]"
            >
              Farmer Ramesh
            </button>
            <button
              onClick={() => {
                switchDemoPersona('admin_rao');
                onClose();
              }}
              className="px-2 py-0.5 rounded bg-sky-900 text-white font-medium hover:bg-sky-800 transition text-[11px]"
            >
              Admin Rao
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Farmer Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Naidu"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98480 12345"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Farm Type</label>
                  <div className="relative">
                    <Anchor className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <select
                      value={farmType}
                      onChange={(e) => setFarmType(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    >
                      <option value="Shrimp Farming (Vannamei)">Shrimp (Vannamei)</option>
                      <option value="Shrimp Farming (Monodon)">Shrimp (Monodon)</option>
                      <option value="Freshwater Major Carp (Rohu/Catla)">Freshwater Fish</option>
                      <option value="Tilapia / Pangasius">Tilapia / Biofloc</option>
                      <option value="Coastal Polyculture">Polyculture</option>
                      <option value="Hatchery / Nursery Operator">Hatchery Operator</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Farm Location / District</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bhimavaram, West Godavari, AP"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@aquafarmers.in"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            {mode === 'register' && (
              <span className="text-[10px] text-slate-400 mt-1 block">
                Stored securely using cryptographic SHA-256 / Werkzeug password hashing
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-60 mt-2"
          >
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In to Dashboard' : 'Register Account'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setLocalError(null);
              }}
              className="text-xs text-sky-700 hover:text-sky-900 font-semibold"
            >
              {mode === 'login'
                ? "Don't have an account yet? Register as a Farmer"
                : 'Already registered? Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
