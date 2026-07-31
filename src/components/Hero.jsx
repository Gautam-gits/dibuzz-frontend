import React from 'react';
import { ShieldCheck, Award, ArrowRight, Star, Users, Sparkles, GraduationCap, Briefcase, BookOpen, ClipboardCheck, TrendingUp, Compass } from 'lucide-react';

export function Hero({ setActiveTab, onOpenAuthModal, companyInfo, courses = [], users = [], transactions = [] }) {
  const studentCount = users.filter(u => u.role === 'student').length;
  const courseCount = courses.length;
  const txnCount = transactions.length;

  const avgRating = courses.length > 0 
    ? (courses.reduce((acc, c) => acc + (Number(c.rating) || 5), 0) / courses.length).toFixed(1) 
    : '0.0';

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 w-full max-w-full">
      
      {/* Main Full-Width Hero Section */}
      <div className="relative min-h-0 sm:min-h-[480px] lg:min-h-[520px] flex items-center py-6 sm:py-12">
        
        {/* Right Side Background Image with Gradient Fade into Left Side */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/hero-student.jpg"
            alt="Students & Tech Mentors"
            className="w-full h-full object-cover object-center opacity-25 sm:opacity-100 sm:object-right lg:object-center"
          />
          {/* Gradient Mask: Fades from Solid White on Left to Translucent on Right */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/90 to-white/60 lg:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/50 sm:to-transparent"></div>
        </div>

        {/* Hero Left Content Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-4">
            
            {/* Company Name & Slogan Headlines */}
            <div className="space-y-1.5 font-heading leading-tight">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-sky-700 font-mono block">
                OFFICIAL DIGITAL EDUCATION & TRAINING PORTAL
              </span>
              
              <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight break-words">
                {companyInfo.name || "DIBUZZ DIGITAL PRIVATE LIMITED"}
              </h1>

              <p className="text-base sm:text-2xl font-extrabold text-sky-600 tracking-tight pt-1">
                KNOW MORE. CHOOSE WISELY. BUILD A BETTER FUTURE.
              </p>
            </div>

            {/* Subtitle Paragraph */}
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-medium pt-1 max-w-xl">
              Accurate insights on admissions, placements, courses, and certifications to help students and parents make <strong className="text-slate-900 font-extrabold">confident decisions</strong> for a successful tomorrow with {companyInfo.name}.
            </p>

            {/* CTAs - Mobile Friendly Full Width */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => setActiveTab('courses')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('internships')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-white bg-slate-900 hover:bg-slate-800 shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <Briefcase className="w-4 h-4 text-sky-400" />
                <span>Live Internships</span>
              </button>

              <button
                onClick={() => setActiveTab('verify')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Verify Certificate</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* 4 Feature Columns Bar (Mobile Responsive Grid) */}
      <div className="bg-slate-50 border-t border-b border-slate-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            
            {/* Feature 1: Explore Bootcamps */}
            <div 
              onClick={() => setActiveTab('courses')}
              className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-sky-300 transition-all cursor-pointer group"
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm font-heading">Explore Bootcamps</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug font-normal">
                  Discover and compare IT programs across India based on curriculum & rankings.
                </p>
              </div>
            </div>

            {/* Feature 2: Admission Guidance */}
            <div 
              onClick={() => setActiveTab('courses')}
              className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-sky-300 transition-all cursor-pointer group"
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <ClipboardCheck className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm font-heading">Admission Guidance</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug font-normal">
                  Step-by-step assistance on eligibility, applications, deadlines & counseling.
                </p>
              </div>
            </div>

            {/* Feature 3: Placement Insights */}
            <div 
              onClick={() => setActiveTab('internships')}
              className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-sky-300 transition-all cursor-pointer group"
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm font-heading">Placement Insights</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug font-normal">
                  Access placement records, top recruiters, stipends and average salary packages.
                </p>
              </div>
            </div>

            {/* Feature 4: Courses & Careers */}
            <div 
              onClick={() => setActiveTab('courses')}
              className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-sky-300 transition-all cursor-pointer group"
            >
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Compass className="w-5 sm:w-6 h-5 sm:h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm font-heading">Courses & Careers</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug font-normal">
                  Explore courses and career options to choose the right path for your future.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Real Dynamic Stats Cards */}
      <div className="py-8 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5 max-w-5xl mx-auto">
            <div className="edumantra-card p-3 sm:p-6 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs">
              <div className="text-xl sm:text-4xl font-black text-slate-900 font-heading">{studentCount}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Registered Students</div>
            </div>

            <div className="edumantra-card p-3 sm:p-6 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs">
              <div className="text-xl sm:text-4xl font-black text-sky-600 font-heading">{courseCount}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Live Programs</div>
            </div>

            <div className="edumantra-card p-3 sm:p-6 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs">
              <div className="text-xl sm:text-4xl font-black text-sky-700 font-heading">{txnCount}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Verified Payments</div>
            </div>

            <div className="edumantra-card p-3 sm:p-6 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-xl sm:text-4xl font-heading">
                <span>{avgRating}</span>
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-500" />
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
