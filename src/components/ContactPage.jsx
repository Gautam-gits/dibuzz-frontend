import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Badge, Button, Card } from './ui';
import { SERVICES } from '../data/services';

// EmailJS (public values, same account the old contact form used)
const EMAILJS_SERVICE_ID = 'service_dvq7cia';
const EMAILJS_TEMPLATE_ID = 'template_nxmxr2p';
const EMAILJS_PUBLIC_KEY = 'ZeHTHsGc56AVZeghm';

const EMPTY = { name: '', phone: '', email: '', businessName: '', service: '', message: '' };
const INPUT =
  'w-full rounded-control border border-line bg-white px-4 py-3 text-sm text-navy outline-none focus:border-brand focus:ring-2 focus:ring-soft';

export function ContactPage({ companyInfo = {} }) {
  const location = useLocation();
  const presetService = new URLSearchParams(location.search).get('service') || '';
  const [form, setForm] = useState({ ...EMPTY, service: presetService });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (presetService) setForm((current) => ({ ...current, service: presetService }));
  }, [presetService]);

  const phone = companyInfo.phone || '+91 9128458850';
  const address = companyInfo.address || '511-A, 5th FLOOR, ASHIANA PLAZA, BUDH MARG, PATNA - 800001';
  const whatsapp = (companyInfo.whatsapp || phone).replace(/\D/g, '').slice(-10);

  const setField = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSending(true);
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          service: form.service || 'General enquiry',
          name: form.name,
          phone: form.phone,
          email: form.email,
          business_name: form.businessName,
          message: form.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setSent(true);
      setForm(EMPTY);
    } catch (sendError) {
      console.error('Contact form failed:', sendError);
      setError('Something went wrong while sending your message. Please try again, or write to support@dibuzz.in.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-page">
      <section className="mx-auto max-w-4xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
        <Badge className="px-4 py-2">Contact</Badge>
        <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-5xl">
          Let us talk about <span className="text-brand">your project.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          Share a few details and the DIBUZZ team will get back to you. For support with programs or certificates, write to support@dibuzz.in.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <Card className="p-6 sm:p-8">
          {sent ? (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ok-bg">
                <CheckCircle2 className="h-9 w-9 text-ok" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold text-navy">Thank you</h2>
              <p className="mt-2 text-muted">Your message has been sent. We will get back to you soon.</p>
              <Button variant="secondary" className="mt-6" onClick={() => setSent(false)}>Send another message</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div role="alert" className="rounded-control bg-bad-bg p-3 text-sm font-semibold text-bad">{error}</div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-navy">
                  Full name
                  <input required value={form.name} onChange={setField('name')} placeholder="Your full name" className={`${INPUT} mt-1 font-normal`} />
                </label>
                <label className="block text-sm font-bold text-navy">
                  Phone number
                  <input required type="tel" value={form.phone} onChange={setField('phone')} placeholder="Your mobile number" className={`${INPUT} mt-1 font-normal`} />
                </label>
                <label className="block text-sm font-bold text-navy">
                  Email (optional)
                  <input type="email" value={form.email} onChange={setField('email')} placeholder="you@email.com" className={`${INPUT} mt-1 font-normal`} />
                </label>
                <label className="block text-sm font-bold text-navy">
                  Business name (optional)
                  <input value={form.businessName} onChange={setField('businessName')} placeholder="Your business name" className={`${INPUT} mt-1 font-normal`} />
                </label>
              </div>
              <label className="block text-sm font-bold text-navy">
                What do you need?
                <select value={form.service} onChange={setField('service')} className={`${INPUT} mt-1 font-normal`}>
                  <option value="">General enquiry</option>
                  {SERVICES.map((service) => (
                    <option key={service.title} value={service.title}>{service.title}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-bold text-navy">
                Message
                <textarea required rows="5" value={form.message} onChange={setField('message')} placeholder="Please describe your requirement…" className={`${INPUT} mt-1 resize-none font-normal`} />
              </label>
              <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                {sending ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          )}
        </Card>

        <Card className="h-fit space-y-5 p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-navy">Contact details</h2>
          <div className="flex items-start gap-3 text-sm text-muted">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
            <span>{address}</span>
          </div>
          <a href={`tel:${phone}`} className="flex items-center gap-3 text-sm font-semibold text-navy hover:text-brand">
            <Phone className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" /> {phone}
          </a>
          <a href="mailto:support@dibuzz.in" className="flex items-center gap-3 text-sm font-semibold text-navy hover:text-brand">
            <Mail className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" /> support@dibuzz.in
          </a>
          <a href={`https://wa.me/91${whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-semibold text-navy hover:text-brand">
            <MessageCircle className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" /> WhatsApp
          </a>
          <div className="flex flex-wrap gap-4 border-t border-line pt-4 text-sm font-semibold">
            {companyInfo.linkedin && <a href={companyInfo.linkedin} target="_blank" rel="noreferrer" className="text-brand hover:underline">LinkedIn</a>}
            {companyInfo.instagram && <a href={companyInfo.instagram} target="_blank" rel="noreferrer" className="text-brand hover:underline">Instagram</a>}
            {companyInfo.youtube && <a href={companyInfo.youtube} target="_blank" rel="noreferrer" className="text-brand hover:underline">YouTube</a>}
          </div>
        </Card>
      </section>
    </div>
  );
}
