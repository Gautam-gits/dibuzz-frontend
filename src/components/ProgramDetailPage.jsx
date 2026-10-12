import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, ExternalLink, GraduationCap, Lock, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getEmbedUrl, getYouTubeThumb } from '../lib/resourceUtils';
import { Badge, Button, EmptyState, Spinner } from './ui';
import { STATUS_LABEL, STATUS_TONE, useApplyFlow } from './ApplyFlow';
import {
  canEnrollNow,
  ctaLabel,
  findProgramBySlug,
  isFree,
  needsApproval,
  priceLabel,
  programImage,
  semesterLabel,
} from '../lib/programs';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'content', label: 'Program content' },
  { id: 'learn', label: 'What you will learn' },
];

const INCLUDES = [
  'Guided modules and resources',
  'Progress tracking in My Learning',
  'Verified completion certificate',
];

// Public outline: module + lesson titles for everyone, links only for free demo lessons.
function useOutline(programId) {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    if (!programId) return undefined;
    let active = true;
    (async () => {
      const { data, error } = await supabase.rpc('program_outline', { p_internship_id: programId });
      if (active) setRows(error ? [] : data || []);
    })();
    return () => {
      active = false;
    };
  }, [programId]);

  const modules = useMemo(() => {
    const map = new Map();
    (rows || []).forEach((row) => {
      if (!map.has(row.module_id)) {
        map.set(row.module_id, { id: row.module_id, title: row.module_title, lessons: [] });
      }
      if (row.resource_id) {
        map.get(row.module_id).lessons.push({
          id: row.resource_id,
          title: row.resource_title,
          type: row.resource_type,
          preview: row.is_preview,
          url: row.url,
          body: row.body,
        });
      }
    });
    return [...map.values()];
  }, [rows]);

  return { modules, loading: rows === null };
}

function DemoPlayer({ lesson }) {
  const embed = getEmbedUrl(lesson.url);
  return (
    <div id="demo-player" className="mb-5 overflow-hidden rounded-card border border-line bg-white">
      {embed ? (
        <div className="aspect-video bg-black">
          <iframe
            src={embed}
            title={lesson.title}
            className="h-full w-full"
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          />
        </div>
      ) : lesson.type === 'notes' ? (
        <div className="whitespace-pre-wrap p-5 text-sm leading-relaxed text-navy">{lesson.body}</div>
      ) : (
        <div className="p-5">
          <Button as="a" href={lesson.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" aria-hidden="true" /> Open demo
          </Button>
        </div>
      )}
      <p className="flex items-center gap-2 border-t border-line px-5 py-3 text-sm font-bold text-navy">
        {lesson.title} <Badge tone="ok">Free demo</Badge>
      </p>
    </div>
  );
}

function ActionArea({ program, application, start, busy }) {
  const full = program.openings !== null && program.openings !== undefined && Number(program.openings) <= 0;
  const active = application && (
    ['enrolled', 'completed'].includes(application.status)
    || (application.status === 'accepted' && !program.paymentRequired)
  );
  const waitingForEnrollment = application && application.status === 'accepted' && program.paymentRequired;

  if (active) {
    return (
      <div className="space-y-2">
        <Badge tone={STATUS_TONE[application.status]}>{STATUS_LABEL[application.status]}</Badge>
        <Button as={Link} to="/dashboard" className="w-full">Continue in My Learning</Button>
      </div>
    );
  }
  if (waitingForEnrollment) {
    return (
      <div className="space-y-2">
        <Badge tone="ok">Accepted</Badge>
        <p className="text-sm text-muted">Your application is accepted. The DIBUZZ team will confirm your enrollment next.</p>
      </div>
    );
  }
  if (application) {
    return (
      <Button variant="secondary" className="w-full" onClick={() => start(program)}>
        Application {(STATUS_LABEL[application.status] || 'Applied').toLowerCase()} · view
      </Button>
    );
  }
  if (full) {
    return <Button disabled className="w-full">Program full</Button>;
  }
  if (!canEnrollNow(program)) {
    return <Button disabled className="w-full">Payments opening soon</Button>;
  }
  return (
    <Button className="w-full" disabled={busy} onClick={() => start(program)}>
      {busy ? 'Please wait…' : ctaLabel(program)}
    </Button>
  );
}

export function ProgramDetailPage({ slug, internships = [], loading = false, currentUser, onOpenAuthModal }) {
  const [tab, setTab] = useState('overview');
  const [playingId, setPlayingId] = useState(null);
  const { byProgram, start, modal, busy } = useApplyFlow({ currentUser, onOpenAuthModal });
  const program = findProgramBySlug(internships, slug);
  const { modules, loading: outlineLoading } = useOutline(program?.id);

  useEffect(() => {
    if (program) document.title = `${program.title} | DIBUZZ`;
  }, [program]);

  if (!program || program.isActive === false) {
    if (loading && internships.length === 0) {
      return <div className="flex min-h-[50vh] items-center justify-center"><Spinner /></div>;
    }
    return (
      <EmptyState
        title="Program not found"
        text="This program is not available. It may have been unpublished."
        action={<Button as={Link} to="/programs">Browse programs</Button>}
      />
    );
  }

  const demos = modules.flatMap((module) => module.lessons.filter((lesson) => lesson.preview));
  const playing = demos.find((lesson) => lesson.id === playingId) || null;
  const firstDemo = demos[0] || null;
  const thumb = firstDemo ? getYouTubeThumb(firstDemo.url) : '';

  const playDemo = (id) => {
    setPlayingId(id);
    setTab('content');
    setTimeout(() => document.getElementById('demo-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  };

  const application = byProgram[program.id];
  const image = programImage(program);
  const semester = semesterLabel(program);
  const free = isFree(program);
  const skills = Array.isArray(program.skills) ? program.skills : [];
  const facts = [
    ['Duration', program.duration],
    ['Mode', program.mode],
    ['Program type', program.type],
    ['Last date to apply', program.lastDateToApply && program.lastDateToApply !== '2026' ? program.lastDateToApply : ''],
  ].filter(([, value]) => value);

  let joinText = 'Applications are reviewed by the DIBUZZ team. Once accepted, you learn inside My Learning.';
  if (!needsApproval(program)) {
    joinText = free
      ? 'Enroll for free and start learning inside My Learning.'
      : 'Enroll online and start learning inside My Learning. Online payment opens soon.';
  }

  return (
    <div className="bg-page pb-28 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-muted">
          <Link to="/" className="hover:text-brand">Home</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <Link to="/programs" className="hover:text-brand">Programs</Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          <span className="text-navy">{program.title}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <Badge className="px-4 py-2">
              {free ? 'Free program' : 'Paid program'}{semester ? ` · ${semester}` : ''}
            </Badge>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-5xl">
              {program.title}
            </h1>
            {program.description && (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{program.description}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {[program.duration, program.mode, 'Certificate eligible'].filter(Boolean).map((chip) => (
                <span key={chip} className="rounded-full bg-soft px-4 py-2 text-sm font-semibold text-navy">{chip}</span>
              ))}
            </div>

            <div role="tablist" aria-label="Program sections" className="mt-10 flex gap-6 overflow-x-auto border-b border-line">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  role="tab"
                  type="button"
                  aria-selected={tab === item.id}
                  onClick={() => setTab(item.id)}
                  className={`-mb-px min-h-11 shrink-0 cursor-pointer whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition-colors ${
                    tab === item.id ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-navy'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {tab === 'overview' && (
              <div role="tabpanel" className="pt-6">
                <dl className="divide-y divide-line rounded-card border border-line bg-white">
                  {facts.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                      <dt className="text-muted">{label}</dt>
                      <dd className="text-right font-semibold text-navy">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-sm text-muted">{joinText}</p>
              </div>
            )}

            {tab === 'content' && (
              <div role="tabpanel" className="pt-6">
                {playing && <DemoPlayer lesson={playing} />}
                {outlineLoading ? (
                  <div className="flex justify-center py-10"><Spinner /></div>
                ) : modules.length === 0 ? (
                  <p className="text-muted">The program content will be added soon.</p>
                ) : (
                  <>
                    <div className="space-y-3">
                      {modules.map((module, index) => (
                        <div key={module.id} className="overflow-hidden rounded-card border border-line bg-white">
                          <div className="flex items-center justify-between gap-4 px-5 py-4">
                            <p className="font-bold text-navy">
                              <span className="mr-3 text-muted">{String(index + 1).padStart(2, '0')}</span>
                              {module.title}
                            </p>
                            <span className="shrink-0 text-sm text-muted">
                              {module.lessons.length} {module.lessons.length === 1 ? 'lesson' : 'lessons'}
                            </span>
                          </div>
                          {module.lessons.length > 0 && (
                            <ul className="divide-y divide-line border-t border-line">
                              {module.lessons.map((lesson) => (
                                <li key={lesson.id}>
                                  {lesson.preview ? (
                                    <button
                                      type="button"
                                      onClick={() => playDemo(lesson.id)}
                                      className={`flex min-h-11 w-full cursor-pointer items-center gap-3 px-5 py-3 text-left text-sm font-semibold hover:bg-soft ${
                                        lesson.id === playingId ? 'bg-soft text-brand' : 'text-navy'
                                      }`}
                                    >
                                      <Play className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                                      <span className="min-w-0 flex-1">{lesson.title}</span>
                                      <Badge tone="ok">Demo</Badge>
                                    </button>
                                  ) : (
                                    <div className="flex min-h-11 items-center gap-3 px-5 py-3 text-sm text-muted">
                                      <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                                      <span className="min-w-0 flex-1">{lesson.title}</span>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-muted">
                      {demos.length > 0
                        ? 'Demo lessons are free to watch. The locked lessons open after you join the program.'
                        : 'Lessons open after you join the program.'}
                    </p>
                  </>
                )}
              </div>
            )}

            {tab === 'learn' && (
              <div role="tabpanel" className="pt-6">
                {skills.length > 0 ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {skills.map((skill, index) => (
                      <li key={`${skill}-${index}`} className="flex items-center gap-3 rounded-control border border-line bg-white px-4 py-3 text-sm font-semibold text-navy">
                        <Check className="h-4 w-4 shrink-0 text-ok" aria-hidden="true" /> {skill}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">Learning outcomes for this program will be added soon.</p>
                )}
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-card border border-line bg-white shadow-xl shadow-navy/5">
              <div className="relative h-44 bg-gradient-to-br from-soft to-white">
                {thumb || image ? (
                  <img src={thumb || image} alt="" width="640" height="400" className="h-full w-full object-cover" />
                ) : (
                  <GraduationCap className="absolute inset-0 m-auto h-12 w-12 text-brand/40" aria-hidden="true" />
                )}
                {firstDemo && (
                  <>
                    <button
                      type="button"
                      onClick={() => playDemo(firstDemo.id)}
                      aria-label="Play free demo"
                      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-navy/30 transition-colors hover:bg-navy/40"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand shadow-lg">
                        <Play className="ml-1 h-6 w-6" fill="currentColor" aria-hidden="true" />
                      </span>
                    </button>
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-navy shadow-sm">
                      Free demo
                    </span>
                  </>
                )}
              </div>
              <div className="p-6">
                <p className="text-3xl font-extrabold tracking-tight text-navy">{free ? 'Free' : priceLabel(program)}</p>
                <div className="mt-4">
                  <ActionArea program={program} application={application} start={start} busy={busy} />
                </div>
                <ul className="mt-6 space-y-3 text-sm text-muted">
                  {INCLUDES.map((line) => (
                    <li key={line} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden="true" /> {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <p className="text-xl font-extrabold text-navy">{free ? 'Free' : priceLabel(program)}</p>
        <div className="min-w-0 max-w-[230px] flex-1">
          <ActionArea program={program} application={application} start={start} busy={busy} />
        </div>
      </div>
      {modal}
    </div>
  );
}
