import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, GraduationCap, MapPin, Phone, Mail } from 'lucide-react';
import { Badge, Button, Card, Spinner } from './ui';
import { initialsOf, useTeam } from '../lib/useTeam';

function TeamCard({ member }) {
  return (
    <article className="rounded-card border border-line bg-white p-6">
      {member.photo_url ? (
        <img
          src={member.photo_url}
          alt={member.name}
          loading="lazy"
          className="h-24 w-24 rounded-full border border-line object-cover"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-soft text-2xl font-extrabold text-brand" aria-hidden="true">
          {initialsOf(member.name)}
        </div>
      )}
      <h3 className="mt-5 text-lg font-extrabold text-navy">{member.name}</h3>
      <p className="text-sm font-semibold text-brand">{member.role}</p>
      {member.bio && <p className="mt-3 text-sm leading-relaxed text-muted">{member.bio}</p>}
    </article>
  );
}

export function AboutPage({ companyInfo = {} }) {
  const { members, loading } = useTeam();
  const name = companyInfo.name || 'DIBUZZ DIGITAL PRIVATE LIMITED';
  const cin = companyInfo.cin || 'U73100BR2025PTC080924';
  const udyam = companyInfo.msme || 'UDYAM-BR-26-0242688';
  const address = companyInfo.address || '511-A, 5th FLOOR, ASHIANA PLAZA, BUDH MARG, PATNA - 800001';
  const phone = companyInfo.phone || '+91 9128458850';

  return (
    <div className="bg-page">
      <section className="mx-auto max-w-4xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
        <Badge className="px-4 py-2">About us</Badge>
        <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-5xl">
          Digital services for businesses. <span className="text-brand">Practical programs for students.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          {name} helps businesses with websites, branding, and digital growth, and runs practical learning programs that end in verified completion certificates.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-4 pb-14 sm:grid-cols-2 sm:px-6 lg:px-8">
        <Card className="p-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-control bg-soft text-brand">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-navy">For businesses</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Websites, product design, campaigns, branding, and business tools shaped around real goals.</p>
          <Button as={Link} to="/services" variant="secondary" className="mt-5">View services</Button>
        </Card>
        <Card className="p-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-control bg-soft text-brand">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-navy">For students</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Internships and courses with guided lessons, progress tracking, and certificates anyone can verify.</p>
          <Button as={Link} to="/programs" variant="secondary" className="mt-5">Explore programs</Button>
        </Card>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-navy">Meet the team</h2>
          <p className="mt-2 text-muted">The people behind DIBUZZ.</p>
          {loading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : members.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => <TeamCard key={member.id} member={member} />)}
            </div>
          ) : (
            <p className="mt-8 text-muted">Team details will be added soon.</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-navy">Registrations and recognitions</h2>
        <p className="mt-2 text-muted">Official registration details of {name}.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Card className="flex items-start gap-5 p-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-control border border-line bg-white p-2.5">
              <img src="/mca-logo.svg" alt="Ministry of Corporate Affairs logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-navy">MCA registered</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">Incorporated under the Companies Act with the Ministry of Corporate Affairs, Government of India.</p>
              <p className="mt-3 font-mono text-xs font-bold text-ok">CIN: {cin}</p>
            </div>
          </Card>
          <Card className="flex items-start gap-5 p-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-control border border-line bg-white p-2.5">
              <img src="/msme.png" alt="MSME, Government of India logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-navy">MSME recognized</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">Registered under the Micro, Small and Medium Enterprises (MSME) framework, Government of India.</p>
              <p className="mt-3 font-mono text-xs font-bold text-ok">Udyam: {udyam}</p>
            </div>
          </Card>
        </div>

        <Card className="mt-5 grid gap-5 p-6 sm:grid-cols-3">
          <div className="flex items-start gap-3 text-sm text-muted">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" /> <span>{address}</span>
          </div>
          <a href={`tel:${phone}`} className="flex items-center gap-3 text-sm font-semibold text-navy hover:text-brand">
            <Phone className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" /> {phone}
          </a>
          <a href="mailto:support@dibuzz.in" className="flex items-center gap-3 text-sm font-semibold text-navy hover:text-brand">
            <Mail className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" /> support@dibuzz.in
          </a>
        </Card>

        <div className="mt-8 text-center">
          <Button as={Link} to="/contact">Contact us</Button>
        </div>
      </section>
    </div>
  );
}
