import React from 'react';
import { Link } from 'react-router-dom';

const linkClass = 'text-sm text-white/70 transition-colors hover:text-white';

export function SiteFooter({ companyInfo = {} }) {
  const name = companyInfo.name || 'DIBUZZ DIGITAL PRIVATE LIMITED';
  const cin = companyInfo.cin || 'U73100BR2025PTC080924';
  const phone = companyInfo.phone || '+91 9128458850';
  const address = companyInfo.address || '511-A, 5th FLOOR, ASHIANA PLAZA, BUDH MARG, PATNA - 800001';
  const whatsapp = (companyInfo.whatsapp || phone).replace(/\D/g, '').slice(-10);

  return (
    <footer className="bg-sidebar text-white">
      <div className="h-1 bg-gradient-to-r from-brand via-sky-400 to-brand" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-3" aria-label="DIBUZZ home">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <img src="/logo-mark.png" alt="" className="h-8 w-8 object-contain" />
              </span>
              <span className="text-xl font-extrabold tracking-tight">DIBUZZ</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Digital services for businesses, and practical learning programs with verified completion certificates for students.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-sky-300">Explore</h4>
            <ul className="space-y-2.5">
              <li><Link to="/services" className={linkClass}>Services</Link></li>
              <li><Link to="/programs" className={linkClass}>Programs</Link></li>
              <li><Link to="/about" className={linkClass}>About</Link></li>
              <li><Link to="/contact" className={linkClass}>Contact</Link></li>
              <li><Link to="/verify" className={linkClass}>Verify Certificate</Link></li>
              <li><Link to="/dashboard" className={linkClass}>My Learning</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-sky-300">Contact</h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>{address}</li>
              <li><a href={`tel:${phone}`} className={linkClass}>{phone}</a></li>
              <li><a href="mailto:support@dibuzz.in" className={linkClass}>support@dibuzz.in</a></li>
              <li>
                <a href={`https://wa.me/91${whatsapp}`} target="_blank" rel="noreferrer" className={linkClass}>WhatsApp</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-extrabold uppercase tracking-wider text-sky-300">Company</h4>
            <p className="text-sm text-white/80">{name}</p>
            <p className="mt-1 text-xs text-white/60">CIN: {cin}</p>
            {companyInfo.msme && <p className="mt-1 text-xs text-white/60">Udyam: {companyInfo.msme}</p>}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {companyInfo.linkedin && <a href={companyInfo.linkedin} target="_blank" rel="noreferrer" className={linkClass}>LinkedIn</a>}
              {companyInfo.instagram && <a href={companyInfo.instagram} target="_blank" rel="noreferrer" className={linkClass}>Instagram</a>}
              {companyInfo.youtube && <a href={companyInfo.youtube} target="_blank" rel="noreferrer" className={linkClass}>YouTube</a>}
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-white/55">
          © {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
