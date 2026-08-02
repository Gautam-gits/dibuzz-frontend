import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Phone, Mail, MapPin, Briefcase, ExternalLink } from 'lucide-react';

export function Footer({ companyInfo, setActiveTab }) {
  const whatsappNum = (companyInfo.whatsapp || '9128458850').replace(/\D/g, '').slice(-10);
  const waUrl = `https://wa.me/91${whatsappNum}`;
  const phoneUrl = `tel:${companyInfo.phone || '+919128458850'}`;
  const linkedinUrl = "https://www.linkedin.com/in/dibuzz-digital-private-limited-87a25a426/";

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-xs pt-8 sm:pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Responsive Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-slate-200">
          
          {/* Column 1: Brand & Registration Info */}
          <div className="space-y-3">
            <Logo size="normal" />
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              Premier digital training & corporate internship institute under Indian corporate law.
            </p>
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5 font-mono text-[10px] shadow-2xs">
              <p className="text-slate-800 font-bold flex items-center justify-between">
                <span>CIN:</span>
                <span className="text-sky-700 font-extrabold">{companyInfo.cin || 'U73100BR2025PTC080924'}</span>
              </p>
              <p className="text-slate-800 font-bold flex items-center justify-between">
                <span>MSME:</span>
                <span className="text-emerald-700 font-extrabold">UDYAM-BR-26-0242688</span>
              </p>
            </div>
          </div>

          {/* Column 2: Popular Training Tracks */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-3 font-heading uppercase tracking-wider">Popular Tracks</h4>
            <ul className="space-y-2 font-medium text-xs">
              <li><button onClick={() => setActiveTab('courses')} className="hover:text-sky-600 transition-colors cursor-pointer text-left">Full Stack MERN Sprint</button></li>
              <li><button onClick={() => setActiveTab('courses')} className="hover:text-sky-600 transition-colors cursor-pointer text-left">Data Science & AI Engineering</button></li>
              <li><button onClick={() => setActiveTab('courses')} className="hover:text-sky-600 transition-colors cursor-pointer text-left">Python Automation & Backend</button></li>
              <li><button onClick={() => setActiveTab('courses')} className="hover:text-sky-600 transition-colors cursor-pointer text-left">DCA Computer Course</button></li>
            </ul>
          </div>

          {/* Column 3: Quick Student Portals */}
          <div>
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-3 font-heading uppercase tracking-wider">Student Portals</h4>
            <ul className="space-y-2 font-medium text-xs">
              <li><button onClick={() => setActiveTab('internships')} className="hover:text-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-slate-800"><Briefcase className="w-3.5 h-3.5 text-emerald-600" /> 3rd Sem Internships</button></li>
              <li><button onClick={() => setActiveTab('verify')} className="hover:text-emerald-700 transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-slate-800"><ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> Verify MCA Certificate</button></li>
              <li><button onClick={() => setActiveTab('about')} className="hover:text-sky-600 transition-colors cursor-pointer">About Entity</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-sky-600 transition-colors cursor-pointer">Student Portal</button></li>
            </ul>
          </div>

          {/* Column 4: Contact & Social Buttons */}
          <div className="space-y-3 font-medium text-xs">
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-3 font-heading uppercase tracking-wider">Contact Office</h4>
            
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span className="text-[11px] leading-snug">{companyInfo.address || '511-A, 5th FLOOR, ASHIANA PLAZA, BUDH MARG, PATNA - 800001'}</span>
            </div>

            {/* Phone */}
            <a href={`tel:${companyInfo.phone || '+919128458850'}`} className="flex items-center gap-2 text-slate-700 hover:text-sky-600 transition-colors">
              <Phone className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <span className="text-xs font-bold font-mono">{companyInfo.phone || '+91 9128458850'}</span>
            </a>

            {/* Support Email only */}
            <a href="mailto:support@dibuzz.in" className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition-colors">
              <Mail className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="text-xs font-semibold truncate font-mono">support@dibuzz.in</span>
            </a>

            {/* Social Buttons */}
            <div className="pt-1 flex items-center gap-2">
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 shadow-2xs transition-all flex items-center gap-1.5 text-[11px] font-bold"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a 
                href={waUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs transition-all flex items-center gap-1.5 text-[11px] font-bold"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-medium text-center sm:text-left">
          <p>© {new Date().getFullYear()} {companyInfo.name || "DIBUZZ DIGITAL PRIVATE LIMITED"}. All Rights Reserved.</p>
          <p className="font-mono text-[10px]">CIN: {companyInfo.cin || 'U73100BR2025PTC080924'}</p>
        </div>

      </div>
    </footer>
  );
}
