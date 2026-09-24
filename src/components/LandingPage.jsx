import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import {
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Code2,
  Edit3,
  GraduationCap,
  Handshake,
  Instagram,
  Landmark,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Palette,
  Phone,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Youtube,
} from 'lucide-react';

const SERVICES = [
  {
    icon: Code2,
    title: 'Website Design, UI/UX & Development',
    desc: 'Modern, mobile-friendly websites that build trust, explain your business clearly, and convert visitors into customers.',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing & Online Advertising',
    desc: 'Targeted campaigns that increase your reach, generate quality enquiries, and help grow your business.',
  },
  {
    icon: Edit3,
    title: 'Social Media Management',
    desc: 'Content planning, posting, creative design, and audience engagement to keep your brand active online.',
  },
  {
    icon: Palette,
    title: 'Branding & Creative Design',
    desc: 'Logo, brand identity, brochures, posters, and professional creatives that make your business memorable.',
  },
  {
    icon: Camera,
    title: 'Content, Photography & Promotional Creatives',
    desc: 'High-quality photos, videos, reels, and promotional designs that make your products and services stand out.',
  },
  {
    icon: Settings2,
    title: 'Business Apps, Automation & Online Payments',
    desc: 'Custom apps, booking systems, customer tools, payment features, and automation that simplify daily work.',
  },
];

function TrendingUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

const TRUST_POINTS = [
  { icon: Target, label: 'Business-Focused Strategy' },
  { icon: Sparkles, label: 'Creative Digital Solutions' },
  { icon: Handshake, label: 'Transparent Communication' },
  { icon: TrendingUpIcon, label: 'Growth-Oriented Support' },
];

const TEAM_MEMBERS = [
  {
    initials: 'GK',
    name: 'Gautam Kumar',
    role: 'Founder & Director',
    bio: 'Gautam leads Dibuzz Digital with a focus on practical digital strategy, strong branding, and client-focused solutions.',
  },
  {
    initials: 'DS',
    name: 'Dharambir Singh',
    role: 'Creatives & Branding',
    bio: 'Dharambir turns ideas into memorable visual identities, campaigns, and creative assets for growing businesses.',
  },
  {
    initials: 'SK',
    name: 'Sumit Kumar',
    role: 'Digital Strategy & Client Success',
    bio: 'Sumit supports digital growth planning and keeps client projects organised from brief to delivery.',
  },
];

const PROCESS = [
  {
    number: '01',
    title: 'Discuss',
    desc: 'We understand your business, audience, goals, and current challenges.',
  },
  {
    number: '02',
    title: 'Plan',
    desc: 'We shape the right digital strategy, scope, timeline, and creative direction.',
  },
  {
    number: '03',
    title: 'Create',
    desc: 'Our team designs, builds, and refines the solution with you.',
  },
  {
    number: '04',
    title: 'Grow',
    desc: 'We help you launch, improve visibility, and keep moving forward.',
  },
];

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  businessName: '',
  message: '',
};

// EmailJS credentials (Dibuzz Digital contact form)
const EMAILJS_SERVICE_ID = 'service_dvq7cia';
const EMAILJS_TEMPLATE_ID = 'template_nxmxr2p';
const EMAILJS_PUBLIC_KEY = 'ZeHTHsGc56AVZeghm';

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-sky-600">{eyebrow}</p>
      <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-base font-medium leading-relaxed text-slate-600 sm:text-lg">{description}</p>}
    </div>
  );
}

export function LandingPage({ setActiveTab, companyInfo }) {
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const companyName = companyInfo?.name || 'DIBUZZ DIGITAL PRIVATE LIMITED';
  const companyPhone = companyInfo?.phone || '+91 9128458850';
  const companyAddress = companyInfo?.address || '511-A, 5th FLOOR, ASHIANA PLAZA, BUDH MARG, PATNA - 800001';

  const openContactForm = (service) => {
    setSelectedService(service);
    setFormData(EMPTY_FORM);
    setSubmitted(false);
    setSendError('');
  };

  const closeContactForm = () => {
    setSelectedService('');
    setFormData(EMPTY_FORM);
    setSubmitted(false);
    setSendError('');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setSendError('');
    setIsSending(true);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          service: selectedService,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          business_name: formData.businessName,
          message: formData.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setSubmitted(true);
    } catch (error) {
      console.error('EmailJS send failed:', error);
      setSendError("Something went wrong sending your message. Please try again, or call us directly.");
    } finally {
      setIsSending(false);
    }
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7fbff] font-sans text-slate-900 selection:bg-sky-200">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-sky-100/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <button onClick={() => scrollToSection('top')} className="flex min-w-0 items-center gap-2.5 text-left">
            <img
              src="/logo.png"
              onError={(event) => {
                event.target.onerror = null;
                event.target.src = '/logo.jpeg';
              }}
              alt="Dibuzz Digital logo"
              className="h-10 w-10 flex-none rounded-xl bg-white object-contain shadow-sm sm:h-11 sm:w-11"
            />
            <span className="min-w-0">
              <span className="block truncate text-base font-black leading-none tracking-tight text-slate-950 sm:text-lg">
                {companyName.split(' ')[0]}
              </span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.22em] text-sky-600">Digital</span>
            </span>
          </button>

          <nav className="hidden items-center gap-5 lg:flex">
            <button onClick={() => scrollToSection('services')} className="text-sm font-bold text-slate-600 transition-colors hover:text-sky-600">Services</button>
            <button onClick={() => scrollToSection('about')} className="text-sm font-bold text-slate-600 transition-colors hover:text-sky-600">About</button>
            <button onClick={() => scrollToSection('team')} className="text-sm font-bold text-slate-600 transition-colors hover:text-sky-600">Team</button>
            <button onClick={() => scrollToSection('contact')} className="text-sm font-bold text-slate-600 transition-colors hover:text-sky-600">Contact</button>
          </nav>

          <a
            href="#home"
            onClick={() => setActiveTab?.('home')}
            className="flex flex-none items-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-black text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-sky-700 sm:px-4"
          >
            <GraduationCap className="h-4 w-4 text-sky-300" />
            <span className="hidden sm:inline">Internship Portal</span>
            <span className="sm:hidden">Internship</span>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative flex min-h-[690px] items-center overflow-hidden pt-[76px] sm:min-h-[720px]">
          <div className="absolute inset-0 bg-slate-50">
            <img
              src="/hero-background-v2.png"
              alt=""
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f7fbff]/95 via-[#f7fbff]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f7fbff]/70 via-transparent to-transparent" />
          </div>
          <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-sky-300/25 blur-3xl" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-700 shadow-sm backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
                Strategy · Design · Development
              </div>

              <h1 className="mt-7 text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Digital solutions that
                <span className="block bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 bg-clip-text text-transparent">grow businesses.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-slate-700 sm:text-xl">
                Dibuzz Digital helps businesses build a strong online presence, attract the right customers, and simplify daily operations.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => openContactForm('General Consultation')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-sky-600/25 transition-all hover:-translate-y-1 hover:bg-sky-700"
                >
                  Get a Free Consultation <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollToSection('services')}
                  className="flex items-center justify-center rounded-xl border border-slate-200 bg-white/85 px-6 py-4 text-sm font-black text-slate-700 shadow-sm backdrop-blur transition-all hover:bg-white hover:text-sky-700"
                >
                  Explore Our Services
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-20 -mt-7 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl grid-cols-2 overflow-hidden rounded-2xl border border-sky-100 bg-white/95 shadow-xl shadow-sky-950/5 backdrop-blur sm:grid-cols-4">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex min-h-[110px] flex-col items-center justify-center gap-2 border-b border-r border-sky-100 px-3 text-center last:border-r-0 sm:border-b-0">
                <Icon className="h-5 w-5 text-sky-600" />
                <span className="text-[10px] font-black uppercase leading-snug tracking-wide text-slate-700 sm:text-xs">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="relative overflow-hidden py-24 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_12%,rgba(14,165,233,0.14),transparent_28%),radial-gradient(circle_at_90%_82%,rgba(37,99,235,0.12),transparent_32%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="What We Do"
              title="Digital Solutions That Grow Your Business"
              description="From a strong online presence to smarter business operations, we provide complete digital solutions tailored to your goals."
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICES.map(({ icon: Icon, title, desc }) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => openContactForm(title)}
                  className="group flex min-h-72 flex-col items-start rounded-[1.75rem] border border-sky-100/80 bg-white/90 p-7 text-left shadow-sm shadow-sky-950/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:bg-white hover:shadow-2xl hover:shadow-sky-900/10 sm:p-8"
                >
                  <div className="mb-6 flex h-15 w-15 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-sky-600 shadow-sm transition-all group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-black leading-tight text-slate-950 transition-colors group-hover:text-sky-700">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
                  <span className="mt-auto pt-6 text-xs font-black uppercase tracking-wider text-sky-600">Enquire now <ChevronRight className="inline h-4 w-4" /></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-white py-24 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">About Dibuzz Digital</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">A practical digital partner for ambitious businesses.</h2>
              <p className="mt-6 text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
                We combine strategy, design, marketing, and technology to help businesses communicate better, work smarter, and grow with confidence.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                From your first website to an end-to-end digital presence, our approach stays simple: understand the goal, create the right solution, and deliver work that makes an impact.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Target, text: 'Goal-led strategy' },
                  { icon: Lightbulb, text: 'Thoughtful creativity' },
                  { icon: Handshake, text: 'Reliable support' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="rounded-2xl border border-sky-100 bg-[#f7fbff] p-4">
                    <Icon className="h-5 w-5 text-sky-600" />
                    <p className="mt-3 text-xs font-black uppercase tracking-wide text-slate-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sky-100 to-indigo-100 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-2xl shadow-sky-950/10">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85"
                  alt="Creative team collaborating"
                  className="h-[360px] w-full object-cover sm:h-[460px]"
                />
                <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-lg backdrop-blur">
                  <p className="text-xs font-black uppercase tracking-widest text-sky-600">Built for growth</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">Ideas, design, technology, and support—all working together.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Why Choose Us"
              title="Creative work, clear thinking, and dependable delivery."
              description="A focused partner for businesses that want their digital presence to look professional and work harder."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Business-Focused', 'Every recommendation starts with your actual business goal.'],
                ['Modern & Creative', 'Visual systems and campaigns designed to stand out clearly.'],
                ['Transparent Process', 'Straightforward communication from first conversation to delivery.'],
                ['Growth Mindset', 'Solutions made to support your next stage, not just today.'],
              ].map(([title, desc], index) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <span className="text-sm font-black text-sky-300">0{index + 1}</span>
                  <h3 className="mt-5 text-lg font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Leadership & Team"
              title="People who bring the ideas to life."
              description="A focused team combining strategy, creative thinking, and delivery support."
            />
            <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM_MEMBERS.map((member, index) => (
                <article key={member.name} className="rounded-[1.75rem] border border-sky-100 bg-white p-7 text-center shadow-sm shadow-sky-950/5">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-100 to-indigo-100 text-2xl font-black text-sky-800">
                    {member.initials}
                  </div>
                  <p className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-sky-600">Team Member 0{index + 1}</p>
                  <h3 className="mt-2 text-xl font-black text-slate-950">{member.name}</h3>
                  <p className="mt-1 text-sm font-bold text-sky-700">{member.role}</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{member.bio}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-white py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Visit or Contact Us"
              title="Let's start with a conversation."
              description="Tell us where you want to go, and we will help you find the right digital path."
            />

            <div className="grid overflow-hidden rounded-[2rem] border border-sky-100 bg-[#f7fbff] shadow-xl shadow-sky-950/5 lg:grid-cols-2">
              <div className="p-7 sm:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-black text-slate-950">Contact Office</h3>
                <p className="mt-3 max-w-md text-base font-medium leading-relaxed text-slate-600">{companyAddress}</p>

                <div className="mt-8 space-y-4">
                  <a href="tel:+919128458850" className="flex items-center gap-3 text-sm font-bold text-slate-700 transition-colors hover:text-sky-700">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm"><Phone className="h-4 w-4" /></span>
                    {companyPhone}
                  </a>
                  <a href="mailto:support@dibuzz.in" className="flex items-center gap-3 text-sm font-bold text-slate-700 transition-colors hover:text-sky-700">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm"><Mail className="h-4 w-4" /></span>
                    support@dibuzz.in
                  </a>
                  <a href="https://wa.me/919128458850" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-bold text-slate-700 transition-colors hover:text-sky-700">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm"><MessageCircle className="h-4 w-4" /></span>
                    WhatsApp us
                  </a>
                </div>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=511-A%2C%205th%20FLOOR%2C%20ASHIANA%20PLAZA%2C%20BUDH%20MARG%2C%20PATNA%20-%20800001"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-sky-700"
                >
                  Get Directions <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              <div className="relative min-h-[320px] overflow-hidden bg-slate-950 p-7 text-white sm:p-10">
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="relative">
                  <Landmark className="h-10 w-10 text-sky-300" />
                  <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-sky-300">Patna, Bihar</p>
                  <h3 className="mt-3 text-3xl font-black leading-tight">A local office with a digital-first outlook.</h3>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-300">
                    Meet us at our Patna office or reach out online. We are ready to discuss your next website, campaign, brand, or business solution.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                <ShieldCheck className="h-7 w-7 text-emerald-700" />
                <h3 className="mt-4 text-lg font-black text-slate-950">MCA Registered</h3>
                <p className="mt-2 text-sm font-medium text-slate-600">CIN: U73100BR2025PTC080924</p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-6">
                <Building2 className="h-7 w-7 text-sky-700" />
                <h3 className="mt-4 text-lg font-black text-slate-950">MSME Recognized</h3>
                <p className="mt-2 text-sm font-medium text-slate-600">UDYAM-BR-26-0242688</p>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="How We Work"
              title="A simple process, from first idea to real progress."
              description="We keep the path clear, collaborative, and focused on what matters to your business."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((step) => (
                <div key={step.number} className="relative rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-sm font-black text-white shadow-lg shadow-sky-500/20">{step.number}</span>
                  <h3 className="mt-6 text-xl font-black text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-14 text-white shadow-2xl shadow-slate-950/20 sm:px-12 sm:py-16">
            <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
            <div className="absolute -bottom-16 left-1/3 h-56 w-56 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">Ready When You Are</p>
                <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">Ready to grow your business online?</h2>
                <p className="mt-5 text-base leading-relaxed text-slate-300">Let's discuss your goals and create a digital solution that fits your business.</p>
              </div>
              <button
                onClick={() => openContactForm('General Consultation')}
                className="flex w-full flex-none items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition-all hover:-translate-y-1 hover:bg-sky-50 sm:w-auto"
              >
                Request a Free Consultation <ArrowRight className="h-4 w-4 text-sky-600" />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-sky-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm font-black text-slate-950">{companyName}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Ideas, brands, and digital growth.</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/dibuzzdigital" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-xl bg-sky-50 p-2.5 text-sky-700 transition-colors hover:bg-sky-100"><Instagram className="h-4 w-4" /></a>
            <a href="https://www.linkedin.com/in/dibuzz-digital-private-limited-87a25a426/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-xl bg-sky-50 p-2.5 text-sky-700 transition-colors hover:bg-sky-100"><Linkedin className="h-4 w-4" /></a>
            <a href="https://www.youtube.com/@dibuzzdigital" target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-xl bg-sky-50 p-2.5 text-sky-700 transition-colors hover:bg-sky-100"><Youtube className="h-4 w-4" /></a>
          </div>
        </div>
      </footer>

      {selectedService && (
        <div role="dialog" aria-modal="true" aria-labelledby="contact-form-title" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button type="button" onClick={closeContactForm} aria-label="Close contact form" className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900">
              <X className="h-5 w-5" />
            </button>

            {!submitted ? (
              <>
                <div className="mb-6 pr-10">
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-sky-600">Free Consultation</p>
                  <h2 id="contact-form-title" className="text-2xl font-black text-slate-950">Let's discuss your requirements</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">Tell us about your business needs and our team will guide you.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Interested Service</label>
                    <input value={selectedService} disabled className="w-full cursor-not-allowed rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-bold text-sky-800" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className="mb-1.5 block text-xs font-bold text-slate-700">Full Name *</label>
                      <input id="contact-name" name="name" required value={formData.name} onChange={handleFormChange} placeholder="Your full name" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-bold text-slate-700">Mobile Number *</label>
                      <input id="contact-phone" name="phone" type="tel" required value={formData.phone} onChange={handleFormChange} placeholder="Your mobile number" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-email" className="mb-1.5 block text-xs font-bold text-slate-700">Email Address</label>
                      <input id="contact-email" name="email" type="email" value={formData.email} onChange={handleFormChange} placeholder="you@email.com" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                    </div>
                    <div>
                      <label htmlFor="contact-business" className="mb-1.5 block text-xs font-bold text-slate-700">Business Name</label>
                      <input id="contact-business" name="businessName" value={formData.businessName} onChange={handleFormChange} placeholder="Your business name" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="mb-1.5 block text-xs font-bold text-slate-700">Tell us what you need *</label>
                    <textarea id="contact-message" name="message" required rows="4" value={formData.message} onChange={handleFormChange} placeholder="Please describe your requirement..." className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100" />
                  </div>

                  {sendError && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-xs font-bold text-red-600">{sendError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-sky-600/20 transition-all hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSending ? 'Sending...' : 'Request a Free Consultation'} <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><CheckCircle2 className="h-9 w-9" /></div>
                <h2 className="text-2xl font-black text-slate-950">Message sent!</h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-600">Thanks for reaching out — our team will get back to you shortly.</p>
                <button type="button" onClick={closeContactForm} className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Default export so the file can be dropped straight into a bundler/preview
// as a standalone app. In your real project, import { LandingPage } instead
// and pass your own setActiveTab/companyInfo props.
export default function App() {
  return (
    <LandingPage
      setActiveTab={() => {}}
      companyInfo={{
        name: 'DIBUZZ DIGITAL PRIVATE LIMITED',
        phone: '+91 9128458850',
        address: '511-A, 5th FLOOR, ASHIANA PLAZA, BUDH MARG, PATNA - 800001',
      }}
    />
  );
}
