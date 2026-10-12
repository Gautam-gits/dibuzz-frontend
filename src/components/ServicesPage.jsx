import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge, Button } from './ui';
import { Reveal } from './Reveal';
import { SERVICES } from '../data/services';

export function ServicesPage() {
  return (
    <div className="bg-page">
      <section className="mx-auto max-w-4xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
        <Badge className="px-4 py-2">Services</Badge>
        <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-5xl">
          Digital services shaped around <span className="text-brand">real business goals.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
          From websites and brands to campaigns and business tools, we help you build what moves your business forward.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={(index % 3) * 110}>
              <Link
                to={`/contact?service=${encodeURIComponent(service.title)}`}
                className="group flex h-full flex-col rounded-card border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-xl hover:shadow-brand/10"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-control bg-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <service.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-lg font-extrabold leading-snug text-navy">{service.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{service.desc}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand">
                  Talk to us
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-card bg-sidebar p-8 text-white">
          <div>
            <h2 className="text-2xl font-extrabold">Have a project in mind?</h2>
            <p className="mt-1 text-white/75">Tell us what you need and we will get back to you.</p>
          </div>
          <Button as={Link} to="/contact" className="bg-white !text-brand hover:!bg-soft">Start a project</Button>
        </div>
      </section>
    </div>
  );
}
