import React from 'react';
import { Logo } from './Logo';
import { AnimatedSearchInput } from './AnimatedSearchInput';
import { User, LogOut, ShieldCheck, BookOpen, LayoutDashboard, Menu, X, PhoneCall, Briefcase, Info, Home, ChevronRight, Mail, Award } from 'lucide-react';

export function Navbar({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  openAuthModal, 
  logout, 
  searchQuery, 
  setSearchQuery,
  mobileMenuOpen,
  setMobileMenuOpen,
  companyInfo
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      
      {/* Top Corporate Strip */}
      <div className="bg-slate-900 text-white text-[10px] sm:text-[11px] py-1.5 px-3 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-mono">
          <div className="flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-none">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
            <span className="font-bold text-emerald-300 truncate">DIBUZZ DIGITAL PRIVATE LIMITED</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-slate-300 flex-shrink-0">
            {/* WhatsApp — 10 digit number, correct redirect */}
            <a
              href={`https://wa.me/91${(companyInfo.whatsapp || '9128458850').replace(/\D/g, '').slice(-10)}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 hover:text-emerald-300 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>WhatsApp: {(companyInfo.whatsapp || '+91 9128458850').replace(/\D/g, '').slice(-10)}</span>
            </a>
            <span className="hidden sm:inline text-slate-700">|</span>
            <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-1 hover:text-white transition-colors font-bold text-[11px]">
              <PhoneCall className="w-3 h-3 text-sky-400" />
              <span>{companyInfo.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}>
          <Logo size="normal" />
        </div>

        {/* Animated Typing Search Bar (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm">
          <AnimatedSearchInput
            searchQuery={searchQuery}
            setSearchQuery={(val) => {
              setSearchQuery(val);
              if (activeTab !== 'courses' && val) setActiveTab('courses');
            }}
          />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-6 font-bold text-xs text-slate-700">
          <button
            onClick={() => setActiveTab('home')}
            className={`py-1.5 transition-all cursor-pointer relative ${activeTab === 'home' ? 'text-sky-600 font-extrabold' : 'hover:text-sky-600'}`}
          >
            Home
            {activeTab === 'home' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full"></span>}
          </button>
          
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-1.5 transition-all cursor-pointer relative ${activeTab === 'courses' ? 'text-sky-600 font-extrabold' : 'hover:text-sky-600'}`}
          >
            Courses
            {activeTab === 'courses' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full"></span>}
          </button>

          <button
            onClick={() => setActiveTab('internships')}
            className={`py-1.5 transition-all cursor-pointer relative flex items-center gap-1 ${activeTab === 'internships' ? 'text-sky-600 font-extrabold' : 'hover:text-sky-600'}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Internships
            {activeTab === 'internships' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full"></span>}
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`py-1.5 transition-all cursor-pointer relative flex items-center gap-1 ${activeTab === 'verify' ? 'text-sky-600 font-extrabold' : 'hover:text-sky-600'}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verify Cert
            {activeTab === 'verify' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full"></span>}
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-1.5 transition-all cursor-pointer relative ${activeTab === 'about' ? 'text-sky-600 font-extrabold' : 'hover:text-sky-600'}`}
          >
            About
            {activeTab === 'about' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full"></span>}
          </button>
        </nav>

        {/* User CTAs */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
                {currentUser.role !== 'admin' && (
                  <button
                    onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-sky-600 text-white shadow-xs' : 'bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100'}`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                )}

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </button>
                )}

              <button
                onClick={logout}
                title="Logout"
                className="hidden sm:block p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-all cursor-pointer flex items-center gap-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}

          {/* Mobile Drawer Toggle (Hamburger Menu Icon) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center justify-center bg-slate-50 border border-slate-200"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-sky-600" /> : <Menu className="w-6 h-6 text-slate-800" />}
          </button>
        </div>

      </div>

      {/* App-like Side Navigation Drawer for Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative ml-auto w-full max-w-[320px] bg-white h-full shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-out">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}>
                <Logo size="small" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card inside Drawer */}
            <div className="p-4 bg-gradient-to-r from-sky-50 to-slate-50 border-b border-slate-200">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold border-2 border-white shadow-sm shrink-0 overflow-hidden">
                      {currentUser.profileImage ? (
                        <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-black text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-sky-100 text-sky-800">
                        {currentUser.role === 'admin' ? 'Administrator' : 'Verified Student'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {currentUser.role !== 'admin' && (
                      <button
                        onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                        className="flex-1 py-2 px-3 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>My Dashboard</span>
                      </button>
                    )}

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                        className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Panel</span>
                      </button>
                    )}

                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="py-2 px-3 rounded-xl bg-red-50 text-red-600 border border-red-200 font-bold text-xs flex items-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-600 font-medium">Sign in to access your portal:</p>
                  {/* Register button hidden — only Sign In shown */}
                  <button
                    onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 rounded-xl text-xs font-black text-white bg-sky-600 hover:bg-sky-700 shadow-sm text-center"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Animated Search inside Drawer */}
            <div className="p-4 border-b border-slate-100">
              <AnimatedSearchInput
                searchQuery={searchQuery}
                setSearchQuery={(val) => {
                  setSearchQuery(val);
                  if (activeTab !== 'courses' && val) {
                    setActiveTab('courses');
                    setMobileMenuOpen(false);
                  }
                }}
              />
            </div>

            {/* Main Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 block mb-1">Navigation</span>
              
              <button
                onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${activeTab === 'home' ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100' : 'text-slate-700 hover:bg-slate-50 font-bold'}`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-sky-600" />
                  <span className="text-xs">Home</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </button>

              <button
                onClick={() => { setActiveTab('courses'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${activeTab === 'courses' ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100' : 'text-slate-700 hover:bg-slate-50 font-bold'}`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span className="text-xs">All Programs & Courses</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </button>

              <button
                onClick={() => { setActiveTab('internships'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${activeTab === 'internships' ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100' : 'text-slate-700 hover:bg-slate-50 font-bold'}`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Live Internships</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800">
                  Stipend
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('verify'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${activeTab === 'verify' ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100' : 'text-slate-700 hover:bg-slate-50 font-bold'}`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Verify Certificate</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </button>

              <button
                onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all ${activeTab === 'about' ? 'bg-sky-50 text-sky-700 font-extrabold border border-sky-100' : 'text-slate-700 hover:bg-slate-50 font-bold'}`}
              >
                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-sky-600" />
                  <span className="text-xs">About Corporate Entity</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </button>
            </div>

            {/* Drawer Footer Contact Info */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 text-slate-600 text-[11px] space-y-2 font-mono">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Award className="w-4 h-4 text-sky-500" />
                <span>Govt MCA Registered</span>
              </div>
              <a href={`tel:${companyInfo.phone}`} className="flex items-center gap-2 hover:text-sky-600 transition-colors">
                <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                <span>{companyInfo.phone}</span>
              </a>
              <a href={`mailto:${companyInfo.email}`} className="flex items-center gap-2 hover:text-sky-600 transition-colors truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{companyInfo.email}</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
