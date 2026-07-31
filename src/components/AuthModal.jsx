import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

export function AuthModal({ initialMode = 'login', onClose, onLoginSuccess, onRegisterSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    const success = onLoginSuccess(email, password);
    if (!success) {
      setErrorMsg('Invalid email or password credentials. Please check and try again!');
    }
  };

  const handleRegister = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    if (!name || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    onRegisterSuccess({
      name,
      email,
      password,
      phone: phone || '+91 98765 00000',
      role: 'student'
    });
  };

  const quickPrimaryAdmin = () => {
    setEmail('mananjayprasad7@gmail.com');
    setPassword('Mananjay@2006');
    onLoginSuccess('mananjayprasad7@gmail.com', 'Mananjay@2006');
  };

  const quickCorporateAdmin = () => {
    setEmail('admin@dibuzz.com');
    setPassword('admin@dibuzz2026');
    onLoginSuccess('admin@dibuzz.com', 'admin@dibuzz2026');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 p-6 sm:p-8">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Logo size="normal" />
          </div>
          <h2 className="text-xl font-black text-slate-900 font-heading">
            {mode === 'login' ? 'Sign In to DIBUZZ Portal' : 'Create Student Account'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            {mode === 'login' ? 'Access your enrolled courses, certificates & admin master controls' : 'Join thousands of learners building careers with DIBUZZ'}
          </p>
        </div>

        {/* Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${mode === 'login' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${mode === 'register' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center font-bold">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  placeholder="mananjayprasad7@gmail.com or admin@dibuzz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 edumantra-input font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 edumantra-input font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick One Click Admin Buttons */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <p className="text-[10px] text-center uppercase tracking-widest text-slate-500 font-bold">One-Click Quick Admin Login</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={quickPrimaryAdmin}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-400 text-slate-700 text-[11px] font-semibold text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <div>
                    <p className="text-slate-900 font-bold">Mananjay (Owner)</p>
                    <p className="text-[9px] text-slate-500 truncate">mananjayprasad7@gmail.com</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={quickCorporateAdmin}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-400 text-slate-700 text-[11px] font-semibold text-left transition-all cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  <div>
                    <p className="text-slate-900 font-bold">Corporate Admin</p>
                    <p className="text-[9px] text-slate-500 truncate">admin@dibuzz.com</p>
                  </div>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Mananjay Prasad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 edumantra-input"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 edumantra-input"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 edumantra-input"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 edumantra-input"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <span>Create Free Account</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
