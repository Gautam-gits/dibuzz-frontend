import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Search } from 'lucide-react';
import { Badge, Button, EmptyState, Spinner } from './ui';
import { STATUS_LABEL, STATUS_TONE, useApplyFlow } from './ApplyFlow';
import { isFree, priceLabel, programImage, programSlug, semesterLabel } from '../lib/programs';

export function ProgramCard({ item, application }) {
  const image = programImage(item);
  const semester = semesterLabel(item);
  const free = isFree(item);

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-brand/10">
      <Link to={`/programs/${programSlug(item)}`} className="relative block h-40 bg-gradient-to-br from-soft to-white" aria-label={item.title}>
        {image ? (
          <img src={image} alt="" loading="lazy" width="640" height="400" className="h-full w-full object-cover" />
        ) : (
          <GraduationCap className="absolute right-4 top-4 h-6 w-6 text-brand/40" aria-hidden="true" />
        )}
        {semester && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-navy shadow-sm">
            {semester}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold leading-snug tracking-tight text-navy">
          <Link to={`/programs/${programSlug(item)}`} className="hover:text-brand">{item.title}</Link>
        </h3>
        <p className="mt-2 text-sm text-muted">
          {[item.duration, item.mode].filter(Boolean).join(' · ')}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="min-w-0">
            <p className="font-extrabold text-navy">{free ? 'Free program' : priceLabel(item)}</p>
            {application && (
              <Badge tone={STATUS_TONE[application.status] || 'brand'} className="mt-1">
                {STATUS_LABEL[application.status] || 'Applied'}
              </Badge>
            )}
          </div>
          <Button as={Link} to={`/programs/${programSlug(item)}`} variant="secondary" className="shrink-0 whitespace-nowrap">
            View details
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProgramsPage({ internships = [], loading = false, currentUser, onOpenAuthModal }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const { byProgram, modal } = useApplyFlow({ currentUser, onOpenAuthModal });

  const programs = useMemo(() => internships.filter((item) => item.isActive !== false), [internships]);

  const semesters = useMemo(() => {
    const found = new Set(programs.map(semesterLabel).filter(Boolean));
    return [...found].sort();
  }, [programs]);

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return programs.filter((item) => {
      if (filter === 'free' && !isFree(item)) return false;
      if (filter === 'paid' && isFree(item)) return false;
      if (filter.endsWith('semester') && semesterLabel(item) !== filter) return false;
      if (!text) return true;
      const skills = Array.isArray(item.skills) ? item.skills.join(' ') : '';
      return `${item.title} ${item.description || ''} ${skills}`.toLowerCase().includes(text);
    });
  }, [programs, query, filter]);

  const chips = [
    { value: 'all', label: 'All programs' },
    ...semesters.map((value) => ({ value, label: value.replace(/^./, (c) => c.toUpperCase()) })),
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' },
  ];

  return (
    <div className="bg-page">
      <section className="mx-auto max-w-4xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
        <Badge className="px-4 py-2">Industry-ready programs</Badge>
        <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-6xl">
          Build real skills.
          <span className="block text-brand">Earn verified experience.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Explore practical training and internship programs designed to help students learn, build, and move forward with confidence.
        </p>

        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            document.getElementById('explore')?.scrollIntoView();
          }}
          className="mx-auto mt-9 flex max-w-3xl items-center gap-2 rounded-2xl border border-line bg-white p-2 shadow-lg shadow-navy/5"
        >
          <Search className="ml-3 hidden h-5 w-5 shrink-0 text-muted sm:block" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Python, Web Development, AutoCAD…"
            aria-label="Search programs"
            className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-base text-navy outline-none placeholder:text-muted"
          />
          <Button type="submit" className="shrink-0">Find programs</Button>
        </form>
      </section>

      <section id="explore" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-navy">Explore programs</h2>
        <p className="mt-1 text-muted">Choose a path that fits your semester and goals.</p>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter programs">
          {chips.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => setFilter(chip.value)}
              aria-pressed={filter === chip.value}
              className={`min-h-11 shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-5 text-sm font-semibold transition-colors ${
                filter === chip.value
                  ? 'border-brand bg-soft text-brand'
                  : 'border-line bg-white text-muted hover:text-navy'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {loading && programs.length === 0 ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : visible.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <ProgramCard key={item.id} item={item} application={byProgram[item.id]} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={programs.length === 0 ? 'No programs yet' : 'No programs match'}
            text={programs.length === 0 ? 'New programs will appear here once they are published.' : 'Try a different search or filter.'}
            action={programs.length > 0 ? <Button variant="secondary" onClick={() => { setQuery(''); setFilter('all'); }}>Clear search</Button> : null}
          />
        )}
      </section>
      {modal}
    </div>
  );
}
