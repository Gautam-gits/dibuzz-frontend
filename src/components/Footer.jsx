import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Phone, Mail, MapPin, Briefcase } from 'lucide-react';

export function Footer({ companyInfo, setActiveTab }) {
  const whatsappNum = (companyInfo.whatsapp || '9128458850').replace(/\D/g, '');
  const waUrl = `https://wa.me/91${whatsappNum.length > 10 ? whatsappNum.slice(-10) : whatsappNum}`;
  const phoneUrl = `tel:${companyInfo.phone || '+919128458850'}`;
  const mailUrl = `mailto:${companyInfo.email || 'contact@dibuzzdigital.com'}`;
  const linkedinUrl = companyInfo.linkedin || "https://www.linkedin.com/company/dibuzzdigital";

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs pt-6 sm:pt-12 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-6 sm:pb-12 border-b border-slate-200">
          
          {/* Column 1: Brand & Registration */}
          <div className="space-y-3 md:col-span-1">
            <Logo size="normal" />
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              {companyInfo.tagline}. Premier corporate IT training & internship institute.
            </p>
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 font-mono text-[10px] shadow-2xs">
              <p className="text-emerald-700 font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>CIN: {companyInfo.cin || 'U73100BR2025PTC080924'}</span>
              </p>
              <p className="text-sky-700 font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                <span>ISO 9001:2015 & MSME Certified</span>
              </p>
            </div>
          </div>

          {/* Column 2: Popular Programs */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-2 sm:mb-3 font-heading">Popular Bootcamps</h4>
            <ul className="space-y-1.5 font-semibold text-xs">
              <li><button onClick={() => setActiveTab('courses')} className="hover:text-sky-600 transition-colors cursor-pointer text-left">Full Stack MERN Sprint</button></li>
              <li><button onClick={() => setActiveTab('courses')} className="hover:text-sky-600 transition-colors cursor-pointer text-left">Data Science & AI Engineering</button></li>
              <li><button onClick={() => setActiveTab('courses')} className="hover:text-sky-600 transition-colors cursor-pointer text-left">Python Automation & Backend</button></li>
              <li><button onClick={() => setActiveTab('courses')} className="hover:text-sky-600 transition-colors cursor-pointer text-left">Diploma in Computer Applications (DCA)</button></li>
            </ul>
          </div>

          {/* Column 3: Portals */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-2 sm:mb-3 font-heading">Quick Portals</h4>
            <ul className="space-y-1.5 font-semibold text-xs">
              <li><button onClick={() => setActiveTab('internships')} className="hover:text-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer"><Briefcase className="w-3.5 h-3.5 text-emerald-600" /> Live Internships Portal</button></li>
              <li><button onClick={() => setActiveTab('verify')} className="hover:text-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verify Certificate</button></li>
              <li><button onClick={() => setActiveTab('about')} className="hover:text-sky-600 transition-colors cursor-pointer">About Corporate Entity</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-sky-600 transition-colors cursor-pointer">Student Learning Portal</button></li>
            </ul>
          </div>

          {/* Column 4: Contact & Social Logos */}
          <div className="space-y-2.5 font-semibold text-xs">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-2 sm:mb-3 font-heading">Contact & Support</h4>
            
            {/* Address */}
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
              <span className="text-[11px] sm:text-xs leading-snug">{companyInfo.address || '511-A, 5th FLOOR, ASHIANA PLAZA, BUDH MARG, PATNA - 800001'}</span>
            </div>

            {/* Mobile Phone */}
            <a href={phoneUrl} className="flex items-center gap-2 text-slate-700 hover:text-sky-600 transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <span className="text-xs font-bold">{companyInfo.phone || '+91 9128458850'}</span>
            </a>

            {/* Email */}
            <a href={mailUrl} className="flex items-center gap-2 text-slate-700 hover:text-sky-600 transition-colors">
              <Mail className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <span className="text-xs font-semibold truncate">{companyInfo.email || 'contact@dibuzzdigital.com'}</span>
            </a>

            {/* LinkedIn & Social Links Bar */}
            <div className="pt-1 flex items-center gap-2">
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-2xs transition-all flex items-center gap-1.5 text-[11px] font-bold"
                title="Follow on LinkedIn"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.239-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn</span>
              </a>

              <a 
                href={waUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition-all flex items-center gap-1.5 text-[11px] font-bold"
                title="Chat on WhatsApp"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-500 font-semibold">
          <p>© {new Date().getFullYear()} {companyInfo.name}. All Rights Reserved.</p>
          <div className="flex gap-3">
            <span className="hover:text-slate-900 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-900 cursor-pointer">Terms & Conditions</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
