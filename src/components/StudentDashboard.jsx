import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, BookOpen, ClipboardList, Download, GraduationCap, LoaderCircle, RefreshCw, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CoursePlayer } from './CoursePlayer';
import { Badge, Button, Card, EmptyState, Spinner } from './ui';
import { STATUS_LABEL, STATUS_TONE } from './ApplyFlow';
import { programImage, programSlug } from '../lib/programs';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const TYPE_LABEL = { video: 'Video', pdf: 'PDF', link: 'Link', notes: 'Notes' };

const NAV = [
  { id: 'learning', label: 'My Learning', icon: BookOpen },
  { id: 'applications', label: 'Applications', icon: ClipboardList },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'profile', label: 'Profile', icon: User },
];

// A student can open the content when enrolled/completed, or accepted into a free program.
const hasAccess = (application) =>
  ['enrolled', 'completed'].includes(application.status) ||
  (application.status === 'accepted' && !application.internship?.paymentRequired);

const waitingForEnrollment = (application) =>
  application.status === 'accepted' && Boolean(application.internship?.paymentRequired);

function buildProgress(program, modules, resources, doneSet) {
  const programModules = modules.filter((module) => String(module.internship_id) === String(program.id));
  const flat = [];
  programModules.forEach((module, moduleIndex) => {
    resources
      .filter((resource) => resource.module_id === module.id)
      .forEach((resource) => flat.push({ ...resource, moduleIndex, moduleTitle: module.title }));
  });
  const total = flat.length;
  const done = flat.filter((resource) => doneSet.has(resource.id)).length;
  const next = flat.find((resource) => !doneSet.has(resource.id)) || null;
  const focus = next || flat[flat.length - 1] || null;
  return {
    total,
    done,
    percent: total ? Math.round((done / total) * 100) : 0,
    next,
    moduleCount: programModules.length,
    moduleLabel: focus ? `Module ${focus.moduleIndex + 1} of ${programModules.length} · ${focus.moduleTitle}` : '',
  };
}

function LearningCard({ application, progress, loading, onContinue }) {
  const program = application.internship;
  const image = programImage(program);
  const waiting = waitingForEnrollment(application);
  const complete = progress && progress.total > 0 && progress.percent === 100;

  let statusLabel = 'Not started';
  let tone = 'brand';
  if (waiting) {
    statusLabel = 'Accepted';
    tone = 'ok';
  } else if (complete) {
    statusLabel = 'Completed';
    tone = 'ok';
  } else if (progress && progress.done > 0) {
    statusLabel = 'In progress';
  }

  return (
    <article className="grid overflow-hidden rounded-card border border-line bg-white md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="relative min-h-44 bg-gradient-to-br from-soft to-white">
        {image ? (
          <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <GraduationCap className="absolute inset-0 m-auto h-12 w-12 text-navy/70" aria-hidden="true" />
        )}
      </div>

      <div className="p-6 sm:p-8">
        <Badge tone={tone} className="px-4 py-2">{statusLabel}</Badge>
        <h3 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-navy">{program.title}</h3>

        {waiting ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Your application is accepted. The DIBUZZ team will confirm your enrollment next, and your lessons will open here.
          </p>
        ) : loading ? (
          <div className="mt-5 space-y-3">
            <div className="h-3 w-3/4 animate-pulse rounded bg-soft" />
            <div className="h-2 w-full animate-pulse rounded bg-soft" />
          </div>
        ) : progress && progress.total > 0 ? (
          <>
            <p className="mt-2 text-sm text-muted">{progress.moduleLabel}</p>
            <div
              className="mt-4 h-2.5 overflow-hidden rounded-full bg-soft"
              role="progressbar"
              aria-valuenow={progress.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${program.title} progress`}
            >
              <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${progress.percent}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted">
              {progress.percent}% complete · {progress.done} of {progress.total} lessons
            </p>

            {progress.next ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-control border border-line p-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Next</p>
                  <p className="mt-1 truncate font-bold text-navy">{progress.next.title}</p>
                  <p className="text-xs text-muted">{TYPE_LABEL[progress.next.type] || 'Lesson'}</p>
                </div>
                <Button onClick={() => onContinue(program)}>Continue learning</Button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <p className="text-sm font-semibold text-ok">
                  You completed every lesson. The DIBUZZ team will review your progress and issue your certificate.
                </p>
                <Button variant="secondary" onClick={() => onContinue(program)}>Review lessons</Button>
              </div>
            )}
          </>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-muted">
            No lessons have been added to this program yet. Please check back soon.
          </p>
        )}
      </div>
    </article>
  );
}

export function StudentDashboard({ currentUser, internships = [] }) {
  const [tab, setTab] = useState('learning');
  const [openCourse, setOpenCourse] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [progressMap, setProgressMap] = useState({});
  const [progressLoading, setProgressLoading] = useState(true);
  const [progressTick, setProgressTick] = useState(0);

  const [certificates, setCertificates] = useState([]);
  const [certLoading, setCertLoading] = useState(false);
  const [certError, setCertError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const userId = currentUser?.id;

  const loadApplications = useCallback(async () => {
    if (!userId) return;
    setApplicationsLoading(true);
    const { data, error } = await supabase
      .from('internship_applications')
      .select('*')
      .eq('student_id', userId)
      .order('applied_at', { ascending: false });
    if (!error) setApplications(data || []);
    setApplicationsLoading(false);
  }, [userId]);

  const loadCertificates = useCallback(async () => {
    if (!userId) return;
    setCertLoading(true);
    setCertError('');
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('student_id', userId)
      .order('created_at', { ascending: false });
    if (error) setCertError(error.message);
    else setCertificates(data || []);
    setCertLoading(false);
  }, [userId]);

  useEffect(() => {
    loadApplications();
    loadCertificates();
  }, [loadApplications, loadCertificates]);

  const applicationCards = useMemo(
    () =>
      applications.map((application) => ({
        ...application,
        internship: internships.find((item) => String(item.id) === String(application.internship_id)),
      })),
    [applications, internships]
  );

  const learning = useMemo(
    () => applicationCards.filter((application) => application.internship && (hasAccess(application) || waitingForEnrollment(application))),
    [applicationCards]
  );

  const learningIdsKey = learning.filter(hasAccess).map((application) => application.internship_id).join(',');

  // Progress for every program the student can open
  useEffect(() => {
    let active = true;
    const run = async () => {
      const ids = learningIdsKey ? learningIdsKey.split(',').map(Number) : [];
      if (!userId || ids.length === 0) {
        if (active) {
          setProgressMap({});
          setProgressLoading(false);
        }
        return;
      }
      setProgressLoading(true);
      const { data: modules } = await supabase.from('internship_modules').select('*').in('internship_id', ids).order('sort_order');
      const moduleIds = (modules || []).map((module) => module.id);
      let resources = [];
      let doneIds = [];
      if (moduleIds.length) {
        const result = await supabase.from('internship_resources').select('*').in('module_id', moduleIds).order('sort_order');
        resources = result.data || [];
        if (resources.length) {
          const progress = await supabase
            .from('resource_progress')
            .select('resource_id')
            .eq('student_id', userId)
            .in('resource_id', resources.map((resource) => resource.id));
          doneIds = (progress.data || []).map((row) => row.resource_id);
        }
      }
      if (!active) return;
      const doneSet = new Set(doneIds);
      const next = {};
      ids.forEach((id) => {
        next[id] = buildProgress({ id }, modules || [], resources, doneSet);
      });
      setProgressMap(next);
      setProgressLoading(false);
    };
    run();
    return () => {
      active = false;
    };
  }, [learningIdsKey, userId, progressTick]);

  const downloadCertificate = async (certificate) => {
    if (!certificate.file_path) {
      setCertError('The PDF file is not available for this certificate yet.');
      return;
    }
    setDownloadingId(certificate.id);
    setCertError('');
    const { data, error } = await supabase.storage
      .from('certificates')
      .createSignedUrl(certificate.file_path, 120, { download: `${certificate.certificate_number}.pdf` });
    setDownloadingId(null);
    if (error) {
      setCertError(error.message);
      return;
    }
    const link = document.createElement('a');
    link.href = data.signedUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!currentUser) return null;

  const firstName = currentUser.name?.split(' ')[0] || 'Student';
  const goTo = (id) => {
    setOpenCourse(null);
    setTab(id);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-page md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-64 shrink-0 bg-sidebar p-5 md:sticky md:top-16 md:flex md:h-[calc(100vh-4rem)] md:flex-col">
        <div className="mb-6 flex items-center gap-3 rounded-card bg-white/5 p-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-extrabold text-white">
            {currentUser.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold text-white">{currentUser.name}</p>
            <p className="truncate text-xs text-white/60">{currentUser.email}</p>
          </div>
        </div>
        <nav aria-label="My Learning sections" className="space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
              aria-current={tab === item.id ? 'page' : undefined}
              className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-control px-4 text-left text-sm font-semibold transition-colors ${
                tab === item.id ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 px-4 pb-28 pt-8 sm:px-8 md:pb-12">
        <div className="mx-auto max-w-5xl">
          {openCourse ? (
            <CoursePlayer
              internship={openCourse}
              currentUser={currentUser}
              onBack={() => {
                setOpenCourse(null);
                setProgressTick((value) => value + 1);
              }}
            />
          ) : (
            <>
              {tab === 'learning' && (
                <section>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted">My Learning</p>
                      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                        Welcome back, {firstName}
                      </h1>
                      <p className="mt-1 text-muted">Continue from where you left off.</p>
                    </div>
                    <Button as={Link} to="/programs" variant="secondary">Browse programs</Button>
                  </div>

                  <div className="mt-8 space-y-6">
                    {applicationsLoading ? (
                      <div className="flex justify-center py-16"><Spinner /></div>
                    ) : learning.length > 0 ? (
                      learning.map((application) => (
                        <LearningCard
                          key={application.id}
                          application={application}
                          progress={progressMap[application.internship_id]}
                          loading={progressLoading && hasAccess(application)}
                          onContinue={setOpenCourse}
                        />
                      ))
                    ) : (
                      <EmptyState
                        title="No programs yet"
                        text="When you join a program, or your application is accepted, it will appear here."
                        action={<Button as={Link} to="/programs">Explore programs</Button>}
                      />
                    )}
                  </div>
                </section>
              )}

              {tab === 'applications' && (
                <section>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-extrabold tracking-tight text-navy">Applications</h1>
                      <p className="mt-1 text-muted">Track every program you have applied to.</p>
                    </div>
                    <Button variant="secondary" onClick={loadApplications}>
                      <RefreshCw className="h-4 w-4" aria-hidden="true" /> Refresh
                    </Button>
                  </div>

                  <div className="mt-8">
                    {applicationsLoading ? (
                      <div className="flex justify-center py-16"><Spinner /></div>
                    ) : applicationCards.length > 0 ? (
                      <div className="grid gap-5 md:grid-cols-2">
                        {applicationCards.map((application) => (
                          <Card key={application.id}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="text-lg font-extrabold leading-snug text-navy">
                                  {application.internship ? (
                                    <Link to={`/programs/${programSlug(application.internship)}`} className="hover:text-brand">
                                      {application.internship.title}
                                    </Link>
                                  ) : 'Program'}
                                </h3>
                                <p className="mt-1 text-sm text-muted">{application.internship?.duration || ''}</p>
                              </div>
                              <Badge tone={STATUS_TONE[application.status] || 'brand'}>
                                {STATUS_LABEL[application.status] || 'Applied'}
                              </Badge>
                            </div>
                            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
                              <div className="flex justify-between gap-4">
                                <dt className="text-muted">Application number</dt>
                                <dd className="font-mono font-bold text-brand">{application.application_number || '—'}</dd>
                              </div>
                              <div className="flex justify-between gap-4">
                                <dt className="text-muted">Applied on</dt>
                                <dd className="font-semibold text-navy">{formatDate(application.applied_at)}</dd>
                              </div>
                            </dl>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="No applications yet"
                        text="Programs you apply to will be tracked here."
                        action={<Button as={Link} to="/programs">Explore programs</Button>}
                      />
                    )}
                  </div>
                </section>
              )}

              {tab === 'certificates' && (
                <section>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-extrabold tracking-tight text-navy">Certificates</h1>
                      <p className="mt-1 text-muted">Download the verified completion certificates issued to you.</p>
                    </div>
                    <Button variant="secondary" onClick={loadCertificates} disabled={certLoading}>
                      <RefreshCw className={`h-4 w-4 ${certLoading ? 'animate-spin' : ''}`} aria-hidden="true" /> Refresh
                    </Button>
                  </div>

                  {certError && (
                    <div role="alert" className="mt-6 rounded-control bg-bad-bg p-3 text-sm font-semibold text-bad">{certError}</div>
                  )}

                  <div className="mt-8">
                    {certLoading && certificates.length === 0 ? (
                      <div className="flex justify-center py-16"><Spinner /></div>
                    ) : certificates.length > 0 ? (
                      <div className="grid gap-5 sm:grid-cols-2">
                        {certificates.map((certificate) => {
                          const valid = certificate.status === 'issued';
                          return (
                            <Card key={certificate.id} className={`flex flex-col ${valid ? '' : 'opacity-80'}`}>
                              <div className="mb-4 flex items-start justify-between gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-control bg-ok-bg">
                                  <Award className="h-6 w-6 text-ok" aria-hidden="true" />
                                </div>
                                <Badge tone={valid ? 'ok' : 'bad'}>{valid ? 'Valid' : 'Revoked'}</Badge>
                              </div>
                              <h3 className="text-lg font-extrabold leading-snug text-navy">{certificate.program_name}</h3>
                              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">
                                {certificate.certificate_type === 'course' ? 'Course completion' : 'Program completion'}
                              </p>
                              <dl className="mt-4 space-y-1.5 text-sm">
                                <div className="flex justify-between gap-4">
                                  <dt className="text-muted">Certificate number</dt>
                                  <dd className="font-mono font-bold text-brand">{certificate.certificate_number}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt className="text-muted">Issued on</dt>
                                  <dd className="font-semibold text-navy">{formatDate(certificate.issued_date)}</dd>
                                </div>
                              </dl>
                              <Button
                                className="mt-6 w-full"
                                onClick={() => downloadCertificate(certificate)}
                                disabled={!valid || !certificate.file_path || downloadingId === certificate.id}
                              >
                                {downloadingId === certificate.id ? (
                                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                                ) : (
                                  <Download className="h-4 w-4" aria-hidden="true" />
                                )}
                                {valid ? 'Download PDF' : 'Certificate revoked'}
                              </Button>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyState
                        title="No certificates yet"
                        text="Complete a program to earn your verified completion certificate."
                      />
                    )}
                  </div>
                </section>
              )}

              {tab === 'profile' && (
                <section>
                  <h1 className="text-3xl font-extrabold tracking-tight text-navy">Profile</h1>
                  <p className="mt-1 text-muted">The details saved with your account.</p>
                  <Card className="mt-8">
                    <dl className="divide-y divide-line text-sm">
                      {[
                        ['Full name', currentUser.name],
                        ['Email', currentUser.email],
                        ['Phone', currentUser.phone],
                        ['College', currentUser.collegeName],
                        ['Course', currentUser.course],
                        ['Branch', currentUser.branch],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4 py-3">
                          <dt className="text-muted">{label}</dt>
                          <dd className="text-right font-semibold text-navy">{value || '—'}</dd>
                        </div>
                      ))}
                    </dl>
                  </Card>
                  <p className="mt-4 text-sm text-muted">
                    To change these details, write to <a className="font-semibold text-brand" href="mailto:support@dibuzz.in">support@dibuzz.in</a>.
                  </p>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {/* Bottom navigation (phones) */}
      <nav
        aria-label="My Learning sections"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-white/10 bg-sidebar pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(item.id)}
            aria-current={tab === item.id ? 'page' : undefined}
            className={`flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
              tab === item.id ? 'text-white' : 'text-white/60'
            }`}
          >
            <item.icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
