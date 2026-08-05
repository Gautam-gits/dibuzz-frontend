import React from 'react';
import { ShieldCheck, ArrowRight, Star, GraduationCap, Briefcase, ClipboardCheck, TrendingUp, Compass, Building2 } from 'lucide-react';

export function Hero({ setActiveTab, onOpenAuthModal, companyInfo, courses = [], internships = [], users = [], transactions = [] }) {
  const courseCount = courses.length || 0;
  const internshipCount = internships.length || 0;
  const avgRating   = '4.8';

  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 w-full max-w-full">
      
      {/* Main Full-Width Hero Section */}
      <div className="relative min-h-0 sm:min-h-[480px] lg:min-h-[520px] flex items-center py-6 sm:py-12">
        
        {/* Hero Left Content Overlay */}
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex-1 max-w-2xl space-y-4">
            
            {/* Government & Corporate Accreditation Logos (MCA & MSME) */}
            <div className="inline-flex max-w-full items-center gap-3 sm:gap-5 py-2 px-3.5 sm:px-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xs mb-1">
              <img 
                src="/mca-logo.svg" 
                alt="Ministry of Corporate Affairs Govt of India" 
                className="h-7 sm:h-9 w-auto object-contain max-w-[85px] sm:max-w-none" 
                title="Ministry of Corporate Affairs (Govt. of India)"
              />
              <div className="h-5 sm:h-7 w-px bg-slate-200"></div>
              <img 
                src="/msme-logo.png" 
                alt="MSME Govt of India" 
                className="h-7 sm:h-9 w-auto object-contain max-w-[85px] sm:max-w-none" 
                title="MSME Govt. Recognized"
              />
            </div>

            {/* Company Name & Slogan Headlines */}
            <div className="space-y-1.5 font-heading leading-tight">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-100 text-sky-800 text-[10px] sm:text-xs font-mono font-black uppercase tracking-wider mb-1">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                <span>OFFICIAL DIGITAL EDUCATION & TRAINING PORTAL</span>
              </div>
              
              <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight break-words">
                {companyInfo.name || "DIBUZZ DIGITAL PRIVATE LIMITED"}
              </h1>

              <p className="text-base sm:text-2xl font-extrabold text-sky-600 tracking-tight pt-1">
                KNOW MORE. CHOOSE WISELY. BUILD A BETTER FUTURE.
              </p>
            </div>

            {/* Subtitle Paragraph */}
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-medium pt-1 max-w-xl">
              Accurate insights on admissions, placements, courses, and certifications to help students and parents make <strong className="text-slate-900 font-extrabold">confident decisions</strong> for a successful tomorrow with <strong className="text-slate-900 font-extrabold">{companyInfo.name || "DIBUZZ DIGITAL PRIVATE LIMITED"}</strong>.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => setActiveTab('courses')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('internships')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-white bg-slate-900 hover:bg-slate-800 shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <Briefcase className="w-4 h-4 text-sky-400" />
                <span>Live 3rd Sem Internships</span>
              </button>

              <button
                onClick={() => setActiveTab('verify')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-extrabold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Verify Certificate</span>
              </button>
            </div>

            {/* Visible Hero Image Card for Mobile View with Company Branding Overlay */}
            <div className="block sm:hidden pt-3">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
                <img
                  src="/hero-student-clean.jpg?v=3"
                  alt="DIBUZZ DIGITAL PRIVATE LIMITED"
                  className="w-full h-44 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white font-heading">
                  <span className="px-2 py-0.5 rounded bg-sky-600 text-white text-[9px] font-mono font-bold uppercase mb-1 inline-block">
                    Official Portal
                  </span>
                  <p className="text-xs font-black drop-shadow-sm leading-snug">{companyInfo.name || "DIBUZZ DIGITAL PRIVATE LIMITED"}</p>
                  <p className="text-[10px] text-sky-300 font-medium mt-0.5">Govt. MCA & MSME Recognized (UDYAM-BR-26-0242688)</p>
                </div>
            </div>

          </div>
          
          {/* Right side image - Desktop Only */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-slide-in-right z-10 hidden sm:block">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="/hero-student-clean.jpg?v=3"
                alt="DIBUZZ Student Success"
                className="w-full h-full object-cover object-[center_top]"
                style={{ maxHeight: '600px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
          </div>

        </div>

      </div>

      {/* 4 Feature Columns Bar */}
      <div className="bg-slate-50 border-t border-b border-slate-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            
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

      {/* Stats Cards Bar */}
      <div className="py-8 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5 max-w-5xl mx-auto">

            {/* Stat 1 — Live Programs */}
            <div className="edumantra-card p-3 sm:p-6 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-sky-300 transition-all">
              <div className="text-xl sm:text-4xl font-black text-sky-600 font-heading">{courseCount}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Live Programs</div>
            </div>

            {/* Stat 2 — Internship Tracks */}
            <div className="edumantra-card p-3 sm:p-6 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all">
              <div className="text-xl sm:text-4xl font-black text-emerald-600 font-heading">{internshipCount}</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Internship Tracks</div>
            </div>

            {/* Stat 3 — Govt. Recognized */}
            <div className="edumantra-card p-3 sm:p-6 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-violet-300 transition-all">
              <div className="text-xl sm:text-4xl font-black text-violet-600 font-heading">MCA</div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Govt. Registered</div>
            </div>

            {/* Stat 4 — Average Rating */}
            <div className="edumantra-card p-3 sm:p-6 text-center bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md hover:border-amber-300 transition-all">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-xl sm:text-4xl font-heading">
                <span>{avgRating}</span>
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-500" />
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-bold uppercase tracking-wider">Average Rating</div>
            </div>

          </div>
        </div>
      </div>
      </div>

    </section>
  );
}
