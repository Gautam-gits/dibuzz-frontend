import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';

const passwordIsStrong = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const checkRecoverySession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setScreen('update');
    };

    checkRecoverySession();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setScreen('update');
        setError('');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const requestReset = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Enter the email address for your DIBUZZ account.');
      return;
    }

    setBusy(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: `${window.location.origin}/reset-password` }
    );
    setBusy(false);

    if (resetError) {
      setError(resetError.message || 'We could not send the reset email. Please try again.');
      return;
    }

    setScreen('sent');
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Enter and confirm your new password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }
    if (!passwordIsStrong(password)) {
      setError('Use 8+ characters with uppercase, lowercase, a number and a special character.');
      return;
    }

    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);

    if (updateError) {
      setError(updateError.message || 'We could not update your password. Request a new link and try again.');
      return;
    }

    await supabase.auth.signOut();
    setScreen('complete');
  };

  const Input = ({ icon: Icon, children }) => (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      {children}
    </div>
  );

  const inputClass = 'w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

  return (
    <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-6xl items-center justify-center px-4 py-12">
      <section className="w-full max-w-[460px] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-7 text-center">
          <div className="mb-4 flex justify-center"><Logo size="normal" /></div>
          <h1 className="font-heading text-2xl font-black tracking-tight text-slate-950">
            {screen === 'update' ? 'Set a new password' : screen === 'complete' ? 'Password updated' : 'Reset your password'}
          </h1>
          <p className="mt-2 text-sm leading-5 text-slate-500">
            {screen === 'update'
              ? 'Choose a strong password for your DIBUZZ account.'
              : screen === 'complete'
                ? 'Your password has been changed successfully.'
                : 'Enter your email and we will send a secure reset link.'}
          </p>
        </div>

        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-xs font-semibold leading-5 text-red-700">{error}</div>}

        {screen === 'request' && (
          <form className="space-y-5" onSubmit={requestReset}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Email address</span>
              <Input icon={Mail}><input className={inputClass} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></Input>
            </label>
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400 cursor-pointer"><KeyRound className="h-4 w-4" />{busy ? 'Sending link…' : 'Send reset link'}</button>
          </form>
        )}

        {screen === 'sent' && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <p className="mt-4 text-sm leading-6 text-slate-600">If an account exists for <span className="font-bold text-slate-800">{email}</span>, a reset link has been sent. Check your inbox and spam folder.</p>
            <button type="button" onClick={() => setScreen('request')} className="mt-6 text-sm font-bold text-sky-700 hover:text-sky-900 cursor-pointer">Use a different email</button>
          </div>
        )}

        {screen === 'update' && (
          <form className="space-y-5" onSubmit={updatePassword}>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">New password</span>
              <Input icon={Lock}>
                <input className={`${inputClass} pr-11`} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a strong password" value={password} onChange={(event) => setPassword(event.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer" aria-label="Show or hide password">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </Input>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">Confirm new password</span>
              <Input icon={Lock}>
                <input className={`${inputClass} pr-11`} type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Repeat your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer" aria-label="Show or hide password">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </Input>
            </label>
            <p className="text-xs leading-5 text-slate-500">Use 8+ characters with uppercase, lowercase, a number and a special character.</p>
            <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400 cursor-pointer">{busy ? 'Updating password…' : 'Update password'}</button>
          </form>
        )}

        {screen === 'complete' && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <button type="button" onClick={() => navigate('/login')} className="mt-6 w-full rounded-xl bg-sky-600 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 cursor-pointer">Sign in with new password</button>
          </div>
        )}

        {screen !== 'complete' && <button type="button" onClick={() => navigate('/login')} className="mt-7 flex w-full items-center justify-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-800 cursor-pointer"><ArrowLeft className="h-4 w-4" /> Back to sign in</button>}
      </section>
    </div>
  );
}
