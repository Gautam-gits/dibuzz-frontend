import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, ShieldCheck, ArrowRight, Building, Hash, BookOpen, GraduationCap, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';

export function AuthModal({ initialMode = 'login', onClose, onLoginSuccess, onRegisterSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [collegeRegNo, setCollegeRegNo] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [course, setCourse] = useState('');
  const [branch, setBranch] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const success = await onLoginSuccess(email, password);
    setIsSubmitting(false);
    if (!success) {
      setErrorMsg('Invalid email or password credentials. Please check and try again!');
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    
    if (!name || !email || !password || !phone || !collegeName || !course || !branch || !collegeRegNo) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setErrorMsg('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('email, phone')
        .or(`email.eq.${email},phone.eq.${phone}`);

      if (checkError) {
        throw checkError;
      }

      if (existingProfiles && existingProfiles.length > 0) {
        const match = existingProfiles[0];
        if (match.email === email) {
          setErrorMsg('Email is already registered. Please sign in instead.');
        } else {
          setErrorMsg('Phone number is already registered.');
        }
        setIsSubmitting(false);
        return;
      }

      onRegisterSuccess({
        name,
        email,
        password,
        phone,
        collegeRegNo,
        collegeName,
        course,
        branch,
        profileImage,
        role: 'student'
      });
    } catch (err) {
      setErrorMsg('Error connecting to database. Please try again.');
      console.error(err);
    }
    
    setIsSubmitting(false);
  };

  const quickPrimaryAdmin = () => {
    setEmail('mananjayprasad7@gmail.com');
    setPassword('Mananjay@2006');
    onLoginSuccess('mananjayprasad7@gmail.com', 'Mananjay@2006');
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
            onClick={() => { setMode('login'); setErrorMsg(''); setEmail(''); setPassword(''); setName(''); setPhone(''); }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${mode === 'login' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); setEmail(''); setPassword(''); }}}
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
                  placeholder="your.email@gmail.com"
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
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 edumantra-input font-medium"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={quickPrimaryAdmin}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-sky-400 text-slate-700 text-[11px] font-semibold text-left transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <div>
                    <p className="text-slate-900 font-bold text-center">Mananjay (Owner)</p>
                    <p className="text-[9px] text-slate-500 text-center">mananjayprasad7@gmail.com</p>
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
                  placeholder="Enter your full name"
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
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 edumantra-input"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 edumantra-input"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">College Name</label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter your college name"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 edumantra-input"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registration No.</label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter your registration no."
                    value={collegeRegNo}
                    onChange={(e) => setCollegeRegNo(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 edumantra-input"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter your course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 edumantra-input"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Branch</label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter your branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 edumantra-input"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Profile Photo</label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full pl-9 pr-4 py-1.5 text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-extrabold text-white shadow-xs transition-all flex items-center justify-center gap-2 text-sm ${isSubmitting ? 'bg-sky-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700 cursor-pointer'}`}
            >
              <span>{isSubmitting ? 'Processing...' : 'Create Free Account'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
