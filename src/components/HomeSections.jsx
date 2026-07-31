import React, { useState } from 'react';
import { ShieldCheck, Award, Building2, Sparkles, CheckCircle2, ChevronDown, GraduationCap, Briefcase, Code, Rocket, Users, Target } from 'lucide-react';

export function HomeSections({ companyInfo, setActiveTab }) {
  const [openFaq, setOpenFaq] = useState(0);

  const features = [
    {
      icon: ShieldCheck,
      title: "ISO 9001:2015 & MCA Certified",
      desc: "Get nationally and internationally verifiable digital certificates with unique Certificate ID & QR code verification.",
      color: "emerald"
    },
    {
      icon: Code,
      title: "Live Capstone Project Sprints",
      desc: "Work on real-world production codebases, REST API microservices, and modern UI frameworks with senior tech leads.",
      color: "sky"
    },
    {
      icon: Briefcase,
      title: "Guaranteed Internship Program",
      desc: "Access paid stipend opportunities (up to ₹20,000/mo) and free academic credit skill internships.",
      color: "amber"
    },
    {
      icon: Users,
      title: "1-on-1 Dedicated Mentor Support",
      desc: "Never get stuck on bugs! Get instant code reviews, 1-on-1 doubt clearing, and personalized guidance.",
      color: "purple"
    },
    {
      icon: Rocket,
      title: "100% Placement Drives",
      desc: "Resume optimization, LinkedIn branding, mock interview rounds, and direct referral drives with top tech companies.",
      color: "orange"
    },
    {
      icon: Target,
      title: "Flexible & Self-Paced LMS",
      desc: "Lifetime access to cohort lecture recordings, downloadable code repositories, and tax receipts.",
      color: "indigo"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Select Your Career Track",
      desc: "Choose from Full Stack MERN, Data Science & AI, Python Automation, or DCA computer certification."
    },
    {
      number: "02",
      title: "Learn with Live Sprints",
      desc: "Attend interactive live mentor cohorts and master industry tools step-by-step."
    },
    {
      number: "03",
      title: "Build Real Portfolio & Internships",
      desc: "Complete 5+ capstone projects and join live corporate or academic credit internships."
    },
    {
      number: "04",
      title: "Get Certified & Hired",
      desc: "Verify your ISO certificate online and get placed at top tech leaders."
    }
  ];

  const faqs = [
    {
      q: "Are DIBUZZ DIGITAL certificates verifiable online?",
      a: "Yes! Every certificate issued by DIBUZZ DIGITAL PRIVATE LIMITED contains a unique Certificate ID. Anyone (recruiters, colleges, or companies) can verify the certificate instantly on our official 'Verify Certificate' portal."
    },
    {
      q: "What is the difference between Paid Stipend and Free Academic Internships?",
      a: "Paid Stipend internships offer monthly stipends up to ₹20,000/month for active development roles. Free Academic credit internships are designed for college students needing project credit certificates."
    },
    {
      q: "Do I get lifetime access to course recordings and study material?",
      a: "Yes! All enrolled students receive lifetime access to course syllabus modules, class notes, source code repositories, and downloadable GST Tax Receipts."
    },
    {
      q: "What are the eligibility criteria for joining these programs?",
      a: "Our programs cater to all levels! Whether you are a BCA/MCA, B.Tech, Diploma student, or working professional switching into IT, our curriculum starts from core fundamentals to advanced level."
    },
    {
      q: "How can I contact the Admissions office?",
      a: `You can reach out directly to our admissions team at ${companyInfo.phone} or email us at ${companyInfo.admissionsEmail}.`
    }
  ];

  return (
    <div className="space-y-16 py-12">
      
      {/* 1. WHY CHOOSE DIBUZZ SECTION */}
      <section className="bg-slate-50 py-16 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-xs">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>The DIBUZZ Digital Advantage</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              Why 15,000+ Students Trust DIBUZZ DIGITAL
            </h2>
            <p className="text-slate-600 text-xs sm:text-base mt-2 font-medium">
              We combine industry-relevant hands-on learning with corporate accreditations to guarantee real career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="edumantra-card bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between group hover:border-sky-300 transition-all">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors font-heading">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-sky-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Included in all programs</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 2. ABOUT US & CORPORATE ACCREDITATIONS (EMBEDDED ON HOME PAGE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>Corporate Identity & Trust</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight font-heading">
                About {companyInfo.name}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                {companyInfo.name} is a premier MCA Govt. Registered and ISO 9001:2015 certified IT education and software training institute. Our mission is to bridge the gap between academic education and industry software standards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 text-[10px]">GOVT MCA REGISTRATION</span>
                  <p className="font-bold text-emerald-400">CIN: {companyInfo.cin || 'U73100BR2025PTC080924'}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-slate-400 text-[10px]">ISO QUALITY CERTIFICATION</span>
                  <p className="font-bold text-sky-300">ISO 9001:2015 QMS Certified</p>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('verify')}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-sky-600 hover:bg-sky-700 text-white shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Any Certificate</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('about')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                >
                  Read Full Corporate Details &rarr;
                </button>
              </div>
            </div>

            {/* Visual Box */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4 font-mono text-xs">
              <h3 className="font-bold text-amber-300 text-sm font-heading">Our Core Accreditation Pillars</h3>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Ministry of Corporate Affairs (MCA)</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Incorporated private limited entity compliant with Indian corporate law.</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50 flex items-start gap-3">
                  <Award className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">ISO 9001:2015 Certification</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">International Quality Management System for technical training syllabus.</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50 flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Skill & Academic Credit Internships</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Offering academic internship certificates for B.Tech, BCA, MCA & Diploma students.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. 4-STEP LEARNING ROADMAP */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              Your 4-Step Journey to Tech Placement
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 font-medium">
              From zero coding experience to corporate readiness in just 16 weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="edumantra-card bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group">
                <span className="text-3xl font-black text-sky-600 font-mono opacity-80 block mb-2">
                  {step.number}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-heading mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
            Everything you need to know about admissions, certificates, and internships.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-slate-900 text-xs sm:text-sm flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-sky-600 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              {openFaq === idx && (
                <div className="p-4 sm:p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 font-normal">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
