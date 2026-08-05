import React from 'react';
import { ShieldCheck, Award, Building2, MapPin, Mail, Phone, Sparkles, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';

export function AboutSection({ companyInfo }) {
  const whatsappNum = (companyInfo.whatsapp || '9128458850').replace(/\D/g, '').slice(-10);
  const waUrl = `https://wa.me/91${whatsappNum}`;
  const phoneUrl = `tel:${companyInfo.phone || '+919128458850'}`;
  const mailUrl = `mailto:support@dibuzz.in`;
  const linkedinUrl = companyInfo.linkedin || "https://www.linkedin.com/in/dibuzz-digital-private-limited-87a25a426/";

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-4 h-4 text-sky-600" />
            <span>Corporate Identity & Accreditations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            About {companyInfo.name}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto font-medium">
            {companyInfo.tagline}. Premier corporate IT training & internship institute.
          </p>
        </div>

        {/* Corporate Accreditation Grid with MCA & MSME Logos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="edumantra-card p-6 bg-white space-y-3">
            <div className="w-20 h-20 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-center p-2.5">
              <img src="/mca-logo.svg" alt="Ministry of Corporate Affairs Logo" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 font-heading">MCA Govt Registered</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Incorporated under Companies Act, Ministry of Corporate Affairs (MCA), Govt. of India.
            </p>
            <p className="text-[11px] font-mono text-emerald-700 font-bold">CIN: {companyInfo.cin || 'U73100BR2025PTC080924'}</p>
          </div>

          <div className="edumantra-card p-6 bg-white space-y-3">
            <div className="w-20 h-20 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-center p-2.5">
              <img src="/msme-logo.png" alt="MSME Govt of India Logo" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 font-heading">MSME Govt Recognized</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Registered under Micro, Small and Medium Enterprises (MSME), Govt. of India for skill & digital training.
            </p>
            <p className="text-[11px] font-mono text-emerald-700 font-bold">UDYAM-BR-26-0242688</p>
          </div>

          <div className="edumantra-card p-6 bg-white space-y-3">
            <div className="w-20 h-20 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center">
              <Award className="w-10 h-10" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 font-heading">Semester Training Division</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Specialized online sprints for 3rd, 5th & 7th Semester engineering and diploma students.
            </p>
            <p className="text-[11px] font-mono text-sky-700 font-bold">Coming Soon</p>
          </div>
        </div>

        {/* Contact Info & Direct Social Badges */}
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-5">
            {/* Logo inside Contact Details */}
            <div className="flex items-center gap-3">
              <Logo size="xlarge" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              At {companyInfo.name}, we bridge the gap between academic education and high-paying tech careers. Our curriculum is developed by senior engineers from top Indian tech firms.
            </p>

            {/* Official Contact Badges with Logos */}
            <div className="space-y-3 text-xs text-slate-700 font-semibold">
              
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-700 flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Head Office Address</span>
                  <span className="text-xs text-slate-900 font-bold leading-snug">{companyInfo.address || '511-A, 5th FLOOR, ASHIANA PLAZA, BUDH MARG, PATNA - 800001'}</span>
                </div>
              </div>

              {/* Phone & Mobile */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700 flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Mobile / Support</span>
                  <a href={phoneUrl} className="text-xs text-slate-900 font-bold hover:text-sky-600 transition-colors">
                    {companyInfo.phone || '+91 9128458850'}
                  </a>
                </div>
              </div>

              {/* WhatsApp Logo & Link */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 flex-shrink-0">
                  <svg className="w-4 h-4 fill-emerald-700" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Official WhatsApp</span>
                  <a href={waUrl} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 font-extrabold hover:underline inline-flex items-center gap-1">
                    <span>{whatsappNum}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Official Email</span>
                  <a href={mailUrl} className="text-xs text-slate-900 font-bold hover:text-sky-600 transition-colors">
                    support@dibuzz.in
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700 flex-shrink-0">
                  <svg className="w-4 h-4 fill-sky-700" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.239-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">LinkedIn Profile</span>
                  <a href="https://www.linkedin.com/in/dibuzz-digital-private-limited-87a25a426/" target="_blank" rel="noreferrer" className="text-[11px] text-sky-700 font-bold hover:underline inline-flex items-center gap-1 break-all">
                    <span>https://www.linkedin.com/in/dibuzz-digital-private-limited-87a25a426/</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Inquiry Request Form */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs shadow-xs">
            <h4 className="font-extrabold text-slate-900 text-sm font-heading">Contact Admissions Office</h4>
            <input
              type="text"
              placeholder="Your Full Name"
              className="w-full p-2.5 edumantra-input text-xs"
            />
            <input
              type="email"
              placeholder="Your Email Address"
              className="w-full p-2.5 edumantra-input text-xs"
            />
            <textarea
              rows={3}
              placeholder="How can we help you?"
              className="w-full p-2.5 edumantra-input text-xs"
            />
            <button
              onClick={() => alert('Thank you for reaching out! An admissions counselor will contact you shortly.')}
              className="w-full py-2.5 rounded-xl font-extrabold bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition-all cursor-pointer"
            >
              Submit Callback Request
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
