import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, BookOpen, Building, Check, Eye, EyeOff,
  GraduationCap, Hash, Lock, Mail, Phone, User, X
} from 'lucide-react';
import { Logo } from './Logo';

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.4-.19-2.06H12v3.9h5.24a4.48 4.48 0 0 1-1.94 2.94v2.53h3.15c1.84-1.69 2.9-4.19 2.9-7.31Z" />
      <path fill="#34A853" d="M12 21.75c2.62 0 4.82-.87 6.43-2.37l-3.15-2.53c-.87.59-1.99.94-3.28.94-2.52 0-4.66-1.7-5.43-3.99H3.31v2.61A9.72 9.72 0 0 0 12 21.75Z" />
      <path fill="#FBBC05" d="M6.57 13.8A5.85 5.85 0 0 1 6.27 12c0-.62.11-1.22.3-1.8V7.59H3.31A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.06 1.06 4.41l3.26-2.61Z" />
      <path fill="#EA4335" d="M12 6.21c1.42 0 2.7.49 3.7 1.45l2.78-2.78C16.81 3.32 14.62 2.25 12 2.25a9.72 9.72 0 0 0-8.69 5.34l3.26 2.61C7.34 7.91 9.48 6.21 12 6.21Z" />
    </svg>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">{label}</span>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />}
        {children}
      </div>
    </label>
  );
}

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100';
const iconInputClass = `${inputClass} pl-10 pr-3`;

export function AuthModal({ initialMode = 'login', onClose, onLoginSuccess, onRegisterSuccess, onAuthenticationComplete, onGoogleAuth, onForgotPassword }) {
  const [mode, setMode] = useState(initialMode);
  const [registerStep, setRegisterStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [collegeRegNo, setCollegeRegNo] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [course, setCourse] = useState('');
  const [branch, setBranch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successState, setSuccessState] = useState(null);
  const successTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(successTimer.current), []);

  const showSuccessThenContinue = (result) => {
    setSuccessState({
      message: result.message || 'You are signed in successfully.',
      destinationLabel: result.destinationLabel || 'your dashboard'
    });
    successTimer.current = window.setTimeout(() => onAuthenticationComplete?.(result), 1100);
  };

  const resetForm = (nextMode) => {
    setMode(nextMode);
    setRegisterStep(1);
    setErrorMsg('');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setConfirmPassword('');
    setCollegeRegNo('');
    setCollegeName('');
    setCourse('');
    setBranch('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const passwordIsStrong = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    if (!email || !password) return setErrorMsg('Enter your email address and password.');

    setIsSubmitting(true);
    try {
      const result = await onLoginSuccess(email, password);
      if (result?.success) showSuccessThenContinue(result);
      else setErrorMsg(result?.message || 'We could not sign you in. Please try again.');
    } catch {
      setErrorMsg('We could not sign you in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueRegistration = (event) => {
    event.preventDefault();
    setErrorMsg('');
    if (!name || !email || !password || !confirmPassword) return setErrorMsg('Complete all fields to continue.');
    if (password !== confirmPassword) return setErrorMsg('Your passwords do not match.');
    if (!passwordIsStrong(password)) return setErrorMsg('Use 8+ characters with uppercase, lowercase, a number and a special character.');
    setRegisterStep(2);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    if (!phone || !collegeName || !course || !branch || !collegeRegNo) return setErrorMsg('Complete all student details to create your account.');

    setIsSubmitting(true);
    try {
      const result = await onRegisterSuccess({
        name, email, password, phone, collegeRegNo, collegeName, course, branch, profileImage: null
      });
      if (result?.success) showSuccessThenContinue(result);
      else setErrorMsg(result?.message || 'Your account could not be created. Please try again.');
    } catch {
      setErrorMsg('Your account could not be created. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const result = await onGoogleAuth?.();
      if (!result?.success) setErrorMsg(result?.message || 'Google sign-in could not be started. Please try again.');
    } catch {
      setErrorMsg('Google sign-in could not be started. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeMode = (nextMode) => {
    if (nextMode !== mode) resetForm(nextMode);
  };

  const title = mode === 'login'
    ? 'Welcome back'
    : registerStep === 1 ? 'Create your account' : 'A few student details';
  const subtitle = mode === 'login'
    ? 'Sign in to continue your learning journey.'
    : registerStep === 1 ? 'Start with Google or your email address.' : 'This helps us personalise your learning profile.';

  const GoogleButton = ({ label }) => (
    <button type="button" disabled={isSubmitting} onClick={handleGoogleAuth} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer">
      <GoogleMark /> {isSubmitting ? 'Opening Google…' : label}
    </button>
  );

  const Divider = () => (
    <div className="my-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
      <span className="h-px flex-1 bg-slate-200" />or with email<span className="h-px flex-1 bg-slate-200" />
    </div>
  );

  const PasswordField = ({ label, confirmation = false }) => {
    const visible = confirmation ? showConfirmPassword : showPassword;
    const setVisible = confirmation ? setShowConfirmPassword : setShowPassword;
    const value = confirmation ? confirmPassword : password;
    const setValue = confirmation ? setConfirmPassword : setPassword;
    return (
      <Field label={label} icon={Lock}>
        <input className={`${iconInputClass} pr-11`} type={visible ? 'text' : 'password'} autoComplete={confirmation ? 'new-password' : mode === 'login' ? 'current-password' : 'new-password'} placeholder={confirmation ? 'Repeat your password' : mode === 'login' ? 'Enter your password' : 'Create a strong password'} value={value} onChange={(event) => setValue(event.target.value)} />
        <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer" aria-label="Show or hide password">{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
      </Field>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-3 sm:p-6 backdrop-blur-sm">
      <section className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[520px] flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:p-7" aria-modal="true" role="dialog" aria-labelledby="auth-title">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 cursor-pointer" aria-label="Close sign in"><X className="h-5 w-5" /></button>

        <div className="mb-6 text-center">
          <div className="mb-3 flex justify-center"><Logo size="normal" /></div>
          <h2 id="auth-title" className="font-heading text-2xl font-black tracking-tight text-slate-950">{title}</h2>
          <p className="mt-2 text-sm leading-5 text-slate-500">{subtitle}</p>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          <button type="button" onClick={() => changeMode('login')} className={`rounded-lg py-2.5 text-sm font-bold transition cursor-pointer ${mode === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Sign in</button>
          <button type="button" onClick={() => changeMode('register')} className={`rounded-lg py-2.5 text-sm font-bold transition cursor-pointer ${mode === 'register' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Create account</button>
        </div>

        {errorMsg && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs font-semibold leading-5 text-red-700">{errorMsg}</div>}

        {mode === 'login' ? (
          <>
            <GoogleButton label="Continue with Google" />
            <Divider />
            <form className="space-y-4" onSubmit={handleLogin}>
              <Field label="Email address" icon={Mail}><input className={iconInputClass} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
              <PasswordField label="Password" />
              <div className="-mt-1 text-right"><button type="button" onClick={onForgotPassword} className="text-xs font-bold text-sky-700 transition hover:text-sky-900 cursor-pointer">Forgot your password?</button></div>
              <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400 cursor-pointer">{isSubmitting ? 'Signing in…' : 'Sign in'} <ArrowRight className="h-4 w-4" /></button>
            </form>
          </>
        ) : registerStep === 1 ? (
          <>
            <GoogleButton label="Sign up with Google" />
            <Divider />
            <form className="space-y-4" onSubmit={continueRegistration}>
              <Field label="Full name" icon={User}><input className={iconInputClass} autoComplete="name" placeholder="Your full name" value={name} onChange={(event) => setName(event.target.value)} /></Field>
              <Field label="Email address" icon={Mail}><input className={iconInputClass} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
              <PasswordField label="Create password" />
              <PasswordField label="Confirm password" confirmation />
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 cursor-pointer">Continue <ArrowRight className="h-4 w-4" /></button>
            </form>
          </>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="mb-5 flex items-center gap-2 text-xs font-bold text-sky-700"><Check className="h-4 w-4" /> Account details saved <span className="ml-auto text-slate-400">Step 2 of 2</span></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Phone number" icon={Phone}><input className={iconInputClass} type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={phone} onChange={(event) => setPhone(event.target.value)} /></Field>
              <Field label="College name" icon={Building}><input className={iconInputClass} placeholder="Your college name" value={collegeName} onChange={(event) => setCollegeName(event.target.value)} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Course" icon={GraduationCap}><input className={iconInputClass} placeholder="e.g. BCA" value={course} onChange={(event) => setCourse(event.target.value)} /></Field>
              <Field label="Branch" icon={BookOpen}><input className={iconInputClass} placeholder="e.g. CSE" value={branch} onChange={(event) => setBranch(event.target.value)} /></Field>
            </div>
            <Field label="College registration no." icon={Hash}><input className={iconInputClass} placeholder="Your registration number" value={collegeRegNo} onChange={(event) => setCollegeRegNo(event.target.value)} /></Field>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => { setRegisterStep(1); setErrorMsg(''); }} className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 cursor-pointer"><ArrowLeft className="h-4 w-4" /> Back</button>
              <button type="submit" disabled={isSubmitting} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400 cursor-pointer">{isSubmitting ? 'Creating account…' : 'Create account'} <ArrowRight className="h-4 w-4" /></button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">
          {mode === 'login' ? 'New to DIBUZZ?' : 'Already have an account?'}{' '}
          <button type="button" onClick={() => changeMode(mode === 'login' ? 'register' : 'login')} className="font-bold text-sky-700 hover:text-sky-800 cursor-pointer">{mode === 'login' ? 'Create an account' : 'Sign in'}</button>
        </p>

        {successState && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-white px-7 text-center animate-fade-in-up" role="status" aria-live="polite">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg shadow-emerald-100">
              <Check className="h-8 w-8" strokeWidth={3} />
            </div>
            <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">Signed in successfully</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">{successState.message}</p>
            <p className="mt-5 flex items-center gap-2 text-xs font-bold text-sky-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
              Taking you to {successState.destinationLabel}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
