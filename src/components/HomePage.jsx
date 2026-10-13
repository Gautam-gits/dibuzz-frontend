import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge, Button, Spinner } from './ui';
import { ProgramCard } from './ProgramsPage';
import { Reveal } from './Reveal';
import { PROCESS, SERVICES } from '../data/services';

const WORDS = ['websites', 'brands', 'campaigns', 'business tools'];
const MARQUEE = ['Websites', 'Branding', 'Campaigns', 'Social media', 'Product design', 'Business tools', 'Learning programs'];

// Clicking a service opens the contact form with that service already selected
const serviceLink = (title) => `/contact?service=${encodeURIComponent(title)}`;

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => setIndex((value) => (value + 1) % WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span key={index} className="anim-word inline-block border-b-2 border-brand/40 font-extrabold text-brand">
      {WORDS[index]}
    </span>
  );
}

function ServiceSlider() {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);

  const slide = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    const step = card ? card.offsetWidth + 20 : 320;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    const atStart = track.scrollLeft <= 8;
    if (direction > 0 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
    else if (direction < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    else track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const id = setInterval(() => slide(1), 3500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Our services"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className="mb-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => slide(-1)}
          aria-label="Previous service"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-navy"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => slide(1)}
          aria-label="Next service"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-navy"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div ref={trackRef} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
        {SERVICES.map((service) => (
          <Link
            key={service.title}
            to={serviceLink(service.title)}
            className="group flex shrink-0 basis-[86%] snap-start flex-col rounded-card border border-white/15 bg-white/10 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-2xl hover:shadow-black/20 sm:basis-[47%] lg:basis-[calc(33.333%-14px)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-control bg-white/15 text-sky-300 transition-colors group-hover:bg-soft group-hover:text-brand">
              <service.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-6 text-xl font-extrabold leading-snug text-white transition-colors group-hover:text-navy">
              {service.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70 transition-colors group-hover:text-muted">
              {service.desc}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition-colors group-hover:text-brand">
              Talk to us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function HomePage({ internships = [], loading = false }) {
  const featured = useMemo(
    () => internships.filter((item) => item.isActive !== false).slice(0, 3),
    [internships]
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-soft/80 to-page">
        <div aria-hidden="true" className="anim-blob pointer-events-none absolute -left-28 top-6 h-80 w-80 rounded-full bg-brand/15 blur-3xl" />
        <div aria-hidden="true" className="anim-blob pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sky-300/25 blur-3xl" style={{ animationDelay: '-6s' }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <div className="anim-fade-up">
              <Badge className="px-4 py-2">Digital products · Creative growth</Badge>
            </div>
            <h1 className="anim-fade-up mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-5xl lg:text-6xl" style={{ animationDelay: '120ms' }}>
              Digital work that helps your{' '}
              <span className="text-brand">business move forward.</span>
            </h1>
            <p className="anim-fade-up mt-6 max-w-xl text-lg leading-relaxed text-muted" style={{ animationDelay: '240ms' }}>
              DIBUZZ partners with ambitious businesses to create useful websites, thoughtful brands,
              high-performing campaigns, and practical digital systems.
            </p>
            <p className="anim-fade-up mt-5 flex min-h-8 flex-wrap items-center gap-2 text-base font-semibold text-navy" style={{ animationDelay: '320ms' }}>
              Right now we are building <RotatingWord />
            </p>
            <div className="anim-fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: '420ms' }}>
              <Button as={Link} to="/contact" className="group px-6 shadow-lg shadow-brand/25 hover:-translate-y-0.5">
                Start a project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              <Button as={Link} to="/programs" variant="secondary" className="px-6 hover:-translate-y-0.5">Internship</Button>
            </div>
          </div>

          <div className="anim-fade-up relative" style={{ animationDelay: '300ms' }}>
            <div className="anim-float rounded-[28px] bg-gradient-to-br from-[#16305e] to-[#2f63b5] p-7 text-white shadow-2xl shadow-navy/30 sm:p-9">
              <div className="flex items-center justify-between gap-4 text-xs font-semibold tracking-wide text-white/85">
                <span>DIBUZZ DIGITAL</span>
                <span>PROJECT WORKSPACE</span>
              </div>
              <p className="mt-14 text-3xl font-medium leading-tight sm:text-4xl">Ideas, strategy, design, and delivery.</p>
              <p className="mt-4 text-sm text-white/85 sm:text-base">A partner for practical digital progress.</p>
              <div className="mt-8 h-2 rounded-full bg-white/20" aria-hidden="true">
                <div className="anim-grow h-full rounded-full bg-sky-300" />
              </div>
            </div>
            <span className="anim-float-slow absolute -left-4 top-10 hidden rounded-full bg-white px-4 py-2 text-xs font-extrabold text-brand shadow-xl sm:block" aria-hidden="true">Design</span>
            <span className="anim-float absolute -right-3 bottom-12 hidden rounded-full bg-white px-4 py-2 text-xs font-extrabold text-brand shadow-xl sm:block" aria-hidden="true" style={{ animationDelay: '-2s' }}>Delivery</span>
          </div>
        </div>
      </section>

      {/* Moving words strip */}
      <div className="overflow-hidden border-y border-white/10 bg-sidebar py-4" aria-hidden="true">
        <div className="anim-marquee flex w-max gap-10 whitespace-nowrap text-xs font-bold uppercase tracking-[0.22em] text-white/70 sm:text-sm">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((word, index) => (
            <span key={`${word}-${index}`} className="flex items-center gap-10">
              {word}
              <span className="text-sky-300">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* How we help: sliding service cards on a dark background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sidebar via-[#0e2f63] to-[#16408a]">
        <div aria-hidden="true" className="anim-blob pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">Services</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">How we help</h2>
              <p className="mt-2 max-w-xl text-white/70">Practical digital services shaped around real business goals. Tap a service to talk to us about it.</p>
            </div>
            <Button as={Link} to="/services" variant="secondary" className="border-white/30 bg-transparent text-white hover:bg-white hover:text-navy">
              View services
            </Button>
          </Reveal>
          <Reveal delay={150} className="mt-8">
            <ServiceSlider />
          </Reveal>
        </div>
      </section>

      {/* Featured programs (real data) */}
      {(loading || featured.length > 0) && (
        <section className="bg-page">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Featured Internships</h2>
                <p className="mt-2 text-muted">Practical internships for students, with verified completion certificates.</p>
              </div>
              <Button as={Link} to="/programs" variant="secondary">View all Internships</Button>
            </Reveal>
            {loading && featured.length === 0 ? (
              <div className="flex justify-center py-16"><Spinner /></div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((item, index) => (
                  <Reveal key={item.id} delay={index * 120}>
                    <ProgramCard item={item} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* How we work */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">How we work</h2>
            <p className="mt-2 text-muted">Four simple steps from first conversation to growth.</p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, index) => (
              <Reveal key={step.number} delay={index * 120}>
                <div className="group h-full rounded-card border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-xl hover:shadow-brand/10">
                  <p className="text-4xl font-extrabold text-soft transition-colors group-hover:text-brand">{step.number}</p>
                  <h3 className="mt-3 text-lg font-extrabold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Verify certificate callout */}
      <section className="bg-page">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Reveal className="relative overflow-hidden rounded-card bg-gradient-to-r from-brand to-[#2f63b5] p-7 text-white sm:p-10">
            <div aria-hidden="true" className="anim-blob pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-2xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-white/20">
                  <BadgeCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold">Check a DIBUZZ certificate</h2>
                  <p className="mt-1 text-white/85">Every certificate has a number that anyone can verify.</p>
                </div>
              </div>
              <Button as={Link} to="/verify" className="bg-white !text-brand hover:!bg-soft">Verify certificate</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
