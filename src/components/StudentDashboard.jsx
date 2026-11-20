import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, CalendarDays, CheckCircle2, ClipboardList, Download, GraduationCap, LoaderCircle, Menu, PlayCircle, RefreshCw, Sparkles, User, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CoursePlayer } from './CoursePlayer';
import { STATUS_LABEL, STATUS_TONE } from './ApplyFlow';
import { programImage, programSlug } from '../lib/programs';
import { Badge, Button, Card, EmptyState, Spinner } from '@/ui';

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
    <article className="student-course-card group grid overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 shadow-[0_18px_60px_rgba(15,35,75,0.08)] md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
      <div className="relative min-h-52 overflow-hidden bg-gradient-to-br from-[#dbeafe] via-[#eff6ff] to-white">
        {image ? (
          <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <GraduationCap className="absolute inset-0 m-auto h-14 w-14 text-blue-700/60" aria-hidden="true" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06234b]/50 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-extrabold text-[#06234b] shadow-sm backdrop-blur">
          <BookOpen className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
          {progress?.moduleCount || 0} modules
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge tone={tone} className="px-3 py-1.5">{statusLabel}</Badge>
          {progress?.total > 0 && <span className="text-sm font-bold text-[#5b6b82]">{progress.done}/{progress.total} lessons</span>}
        </div>
        <h3 className="mt-4 font-heading text-2xl font-extrabold leading-tight tracking-tight text-[#06234b] sm:text-3xl">{program.title}</h3>

        {waiting ? (
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            Your application is accepted. The DIBUZZ team will confirm your enrollment next, and your lessons will open here.
          </p>
        ) : loading ? (
          <div className="mt-5 space-y-3">
            <div className="h-3 w-3/4 animate-pulse rounded bg-blue-100" />
            <div className="h-2 w-full animate-pulse rounded bg-blue-100" />
          </div>
        ) : progress && progress.total > 0 ? (
          <>
            <p className="mt-2 text-sm font-medium text-[#5b6b82]">{progress.moduleLabel}</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-blue-100">
              <div className="student-progress-bar h-full rounded-full bg-gradient-to-r from-[#0a6fd6] to-[#00a4eb]" style={{ width: `${progress.percent}%` }} />
            </div>
            <p className="mt-2 text-xs font-bold text-[#5b6b82]">{progress.percent}% complete</p>

            {progress.next ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Up next</p>
                  <p className="mt-1 truncate font-bold text-[#06234b]">{progress.next.title}</p>
                  <p className="text-xs text-[#5b6b82]">{TYPE_LABEL[progress.next.type] || 'Lesson'}</p>
                </div>
                <Button className="bg-[#0a6fd6] text-white shadow-lg shadow-blue-200 hover:bg-[#075bb3]" onClick={() => onContinue(program)}><PlayCircle className="h-4 w-4" /> Continue</Button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <p className="text-sm font-semibold text-green-600">
                  You completed every lesson. The DIBUZZ team will review your progress and issue your certificate.
                </p>
                <Button variant="secondary" onClick={() => onContinue(program)}>Review lessons</Button>
              </div>
            )}
          </>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            No lessons have been added to this program yet. Please check back soon.
          </p>
        )}
      </div>
    </article>
  );
}

export function StudentDashboard({ currentUser, internships = [] }) {
  const [tab, setTab] = useState('learning');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const learningStats = useMemo(() => {
    const active = learning.filter(hasAccess);
    const lessonsDone = active.reduce((sum, application) => sum + (progressMap[application.internship_id]?.done || 0), 0);
    const certificatesEarned = certificates.filter((certificate) => certificate.status === 'issued').length;
    return { active: active.length, certificatesEarned, lessonsDone };
  }, [learning, progressMap, certificates]);

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

  // Keep dashboard totals current when an admin issues a certificate, an
  // application changes, or the student marks a lesson complete elsewhere.
  useEffect(() => {
    if (!userId) return undefined;

    const channel = supabase
      .channel(`student-dashboard-${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'certificates', filter: `student_id=eq.${userId}` }, loadCertificates)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'internship_applications', filter: `student_id=eq.${userId}` }, loadApplications)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resource_progress', filter: `student_id=eq.${userId}` }, () => {
        setProgressTick((value) => value + 1);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadApplications, loadCertificates]);

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
    setSidebarOpen(false);
  };

  return (
    <div className="student-dashboard flex min-h-[calc(100vh-4rem)] flex-col bg-[#f5f8fd] md:flex-row">
      {/* Desktop navigation drawer */}
      <button
        type="button"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? 'Close dashboard navigation' : 'Open dashboard navigation'}
        aria-expanded={sidebarOpen}
        className={`fixed top-20 z-[110] hidden h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-white text-[#06234b] shadow-lg shadow-blue-950/10 transition-all duration-300 hover:bg-blue-50 md:flex ${sidebarOpen ? 'left-[19rem]' : 'left-6'}`}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {sidebarOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-[90] hidden bg-[#06234b]/35 backdrop-blur-sm md:block" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-[100] hidden w-72 bg-[#06234b] p-5 pt-8 shadow-[14px_0_45px_rgba(6,35,75,0.28)] transition-transform duration-300 ease-out md:flex md:flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 px-3 pt-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-blue-200">DIBUZZ</p>
          <p className="mt-1 font-heading text-xl font-extrabold text-white">Student space</p>
        </div>
        <div className="mb-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00a4eb] to-[#0a6fd6] text-lg font-extrabold text-white shadow-lg shadow-blue-950/30">
            {currentUser.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold text-white">{currentUser.name}</p>
            <p className="truncate text-xs text-white/60">{currentUser.email}</p>
          </div>
        </div>
        <nav aria-label="My Learning sections" className="space-y-2">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(item.id)}
              aria-current={tab === item.id ? 'page' : undefined}
              className={`flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-2xl px-4 text-left text-sm font-bold transition-all duration-200 ${
                tab === item.id ? 'bg-white text-[#06234b] shadow-lg shadow-blue-950/20' : 'text-white/70 hover:translate-x-1 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-blue-300/20 bg-gradient-to-br from-blue-500/25 to-cyan-400/10 p-4">
          <Sparkles className="h-5 w-5 text-cyan-200" aria-hidden="true" />
          <p className="mt-3 text-sm font-extrabold text-white">Keep the momentum</p>
          <p className="mt-1 text-xs leading-relaxed text-blue-100/75">Every completed lesson moves you closer to your certificate.</p>
        </div>
      </aside>

      <main className="relative min-w-0 flex-1 overflow-hidden px-4 pb-28 pt-6 sm:px-8 md:pb-12 md:pt-8">
        <div className="student-orb student-orb-one" aria-hidden="true" />
        <div className="student-orb student-orb-two" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl">
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
                  <div className="student-hero overflow-hidden rounded-[2rem] bg-[#06234b] px-6 py-7 text-white shadow-[0_20px_70px_rgba(6,35,75,0.22)] sm:px-9 sm:py-9">
                    <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-200"><Sparkles className="h-4 w-4" /> My learning</div>
                        <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Welcome back, {firstName}.</h1>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">Pick up a lesson, track your progress, and turn small wins into real momentum.</p>
                      </div>
                      <Button as={Link} to="/programs" variant="secondary" className="border-white/20 bg-white text-[#06234b] hover:bg-blue-50">Browse programs <ArrowRight className="h-4 w-4" /></Button>
                    </div>
                    <div className="relative z-10 mt-7 grid gap-3 sm:grid-cols-3">
                      {[
                        { label: 'Active programs', value: learningStats.active, icon: BookOpen },
                        { label: 'Lessons completed', value: learningStats.lessonsDone, icon: CheckCircle2 },
                        { label: 'Certificates earned', value: learningStats.certificatesEarned, icon: Award, onClick: () => goTo('certificates') },
                      ].map(({ label, value, icon: Icon, onClick }) => {
                        const content = <>
                          <Icon className="h-4 w-4 text-cyan-200" aria-hidden="true" />
                          <p className="mt-3 text-2xl font-extrabold">{value}</p>
                          <p className="mt-0.5 text-xs font-semibold text-blue-100/75">{label}</p>
                        </>;

                        return onClick ? (
                          <button
                            key={label}
                            type="button"
                            onClick={onClick}
                            className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                            aria-label="View my certificates"
                          >
                            {content}
                          </button>
                        ) : (
                          <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">{content}</div>
                        );
                      })}
                    </div>
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
                      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">Your journey</p>
                      <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[#06234b]">Applications</h1>
                      <p className="mt-1 text-[#5b6b82]">Track every program you have applied to.</p>
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
                          <Card key={application.id} className="student-panel group border-white/80 bg-white/90 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="text-lg font-extrabold leading-snug text-neutral-900">
                                  {application.internship ? (
                                    <Link to={`/programs/${programSlug(application.internship)}`} className="hover:text-blue-600">
                                      {application.internship.title}
                                    </Link>
                                  ) : 'Program'}
                                </h3>
                                <p className="mt-1 text-sm text-neutral-500">{application.internship?.duration || ''}</p>
                              </div>
                              <Badge tone={STATUS_TONE[application.status] || 'brand'}>
                                {STATUS_LABEL[application.status] || 'Applied'}
                              </Badge>
                            </div>
                            <dl className="mt-5 space-y-3 border-t border-blue-100 pt-4 text-sm">
                              <div className="flex justify-between gap-4">
                                <dt className="text-neutral-500">Application number</dt>
                                <dd className="font-mono font-bold text-blue-600">{application.application_number || '—'}</dd>
                              </div>
                              <div className="flex justify-between gap-4">
                                <dt className="flex items-center gap-1.5 text-neutral-500"><CalendarDays className="h-3.5 w-3.5" /> Applied on</dt>
                                <dd className="font-semibold text-neutral-900">{formatDate(application.applied_at)}</dd>
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
                      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">Your achievements</p>
                      <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[#06234b]">Certificates</h1>
                      <p className="mt-1 text-[#5b6b82]">Download the verified completion certificates issued to you.</p>
                    </div>
                    <Button variant="secondary" onClick={loadCertificates} disabled={certLoading}>
                      <RefreshCw className={`h-4 w-4 ${certLoading ? 'animate-spin' : ''}`} aria-hidden="true" /> Refresh
                    </Button>
                  </div>

                  {certError && (
                    <div role="alert" className="mt-6 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{certError}</div>
                  )}

                  <div className="mt-8">
                    {certLoading && certificates.length === 0 ? (
                      <div className="flex justify-center py-16"><Spinner /></div>
                    ) : certificates.length > 0 ? (
                      <div className="grid gap-5 sm:grid-cols-2">
                        {certificates.map((certificate) => {
                          const valid = certificate.status === 'issued';
                          return (
                            <Card key={certificate.id} className={`student-panel flex flex-col border-white/80 bg-white/90 ${valid ? '' : 'opacity-80'}`}>
                              <div className="mb-4 flex items-start justify-between gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                                  <Award className="h-6 w-6 text-green-600" aria-hidden="true" />
                                </div>
                                <Badge tone={valid ? 'ok' : 'bad'}>{valid ? 'Valid' : 'Revoked'}</Badge>
                              </div>
                              <h3 className="text-lg font-extrabold leading-snug text-neutral-900">{certificate.program_name}</h3>
                              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
                                {certificate.certificate_type === 'course' ? 'Course completion' : 'Program completion'}
                              </p>
                              <dl className="mt-4 space-y-1.5 text-sm">
                                <div className="flex justify-between gap-4">
                                  <dt className="text-neutral-500">Certificate number</dt>
                                  <dd className="font-mono font-bold text-blue-600">{certificate.certificate_number}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt className="text-neutral-500">Issued on</dt>
                                  <dd className="font-semibold text-neutral-900">{formatDate(certificate.issued_date)}</dd>
                                </div>
                              </dl>
                              <Button
                                className="mt-6 w-full bg-[#0a6fd6] text-white shadow-lg shadow-blue-200 hover:bg-[#075bb3] focus-visible:ring-[#0a6fd6]"
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
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">Account</p>
                  <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-[#06234b]">Profile</h1>
                  <p className="mt-1 text-[#5b6b82]">The details saved with your account.</p>
                  <Card className="student-panel mt-8 border-white/80 bg-white/90">
                    <dl className="divide-y divide-neutral-200 text-sm">
                      {[
                        ['Full name', currentUser.name],
                        ['Email', currentUser.email],
                        ['Phone', currentUser.phone],
                        ['College', currentUser.collegeName],
                        ['Course', currentUser.course],
                        ['Branch', currentUser.branch],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4 py-3">
                          <dt className="text-neutral-500">{label}</dt>
                          <dd className="text-right font-semibold text-neutral-900">{value || '—'}</dd>
                        </div>
                      ))}
                    </dl>
                  </Card>
                  <p className="mt-4 text-sm text-neutral-500">
                    To change these details, write to <a className="font-semibold text-blue-600" href="mailto:support@dibuzz.in">support@dibuzz.in</a>.
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
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-white/10 bg-[#06234b]/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(6,35,75,0.18)] backdrop-blur md:hidden"
      >
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(item.id)}
            aria-current={tab === item.id ? 'page' : undefined}
            className={`relative flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors ${
              tab === item.id ? 'text-white' : 'text-white/55'
            }`}
          >
            {tab === item.id && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-cyan-300" />}
            <item.icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
