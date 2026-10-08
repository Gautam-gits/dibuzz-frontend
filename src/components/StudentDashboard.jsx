import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  ClipboardList,
  Compass,
  Download,
  LayoutDashboard,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { InternshipSection } from './InternshipSection';
import { CoursePlayer } from './CoursePlayer';

const formatDate = (value) => {
  if (!value) return '—';

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const STATUS_STYLE = {
  applied: 'bg-sky-100 text-sky-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  payment_pending: 'bg-amber-100 text-amber-700',
  enrolled: 'bg-violet-100 text-violet-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-700',
};

const STATUS_LABEL = {
  applied: 'Applied',
  accepted: 'Accepted',
  rejected: 'Rejected',
  payment_pending: 'Payment Pending',
  enrolled: 'Enrolled',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function StudentDashboard({
  currentUser,
  internships = [],
  companyInfo,
  onOpenAuthModal,
}) {
  const [dashboardTab, setDashboardTab] = useState('overview');
  const [openCourse, setOpenCourse] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);

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

    if (!error) {
      setApplications(data || []);
    }

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

    if (error) {
      setCertError(error.message);
    } else {
      setCertificates(data || []);
    }

    setCertLoading(false);
  }, [userId]);

  useEffect(() => {
    loadApplications();
    loadCertificates();
  }, [loadApplications, loadCertificates]);

  const applicationCards = useMemo(() => {
    return applications.map((application) => ({
      ...application,
      internship: internships.find(
        (item) => String(item.id) === String(application.internship_id)
      ),
    }));
  }, [applications, internships]);

  const activeInternshipCount = applicationCards.filter((application) =>
    ['accepted', 'payment_pending', 'enrolled'].includes(application.status)
  ).length;

  const completedCount = certificates.filter(
    (certificate) => certificate.status === 'issued'
  ).length;

  const downloadCertificate = async (certificate) => {
    if (!certificate.file_path) {
      setCertError('PDF file is not available for this certificate yet.');
      return;
    }

    setDownloadingId(certificate.id);
    setCertError('');

    const { data, error } = await supabase.storage
      .from('certificates')
      .createSignedUrl(certificate.file_path, 120, {
        download: `${certificate.certificate_number}.pdf`,
      });

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

  const SidebarItem = ({ icon: Icon, label, tabId }) => (
    <button
      onClick={() => setDashboardTab(tabId)}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
        dashboardTab === tabId
          ? 'bg-sky-600 font-bold text-white shadow-md'
          : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon
        className={`h-5 w-5 ${
          dashboardTab === tabId ? 'text-white' : 'text-slate-400'
        }`}
      />
      <span>{label}</span>
    </button>
  );

  return (
    <div
      className="flex min-h-[calc(100vh-80px)] w-full flex-col bg-slate-50 md:flex-row"
      style={{
        marginTop: '-2rem',
        marginBottom: '-2rem',
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      }}
    >
      <aside className="flex w-full shrink-0 flex-col gap-2 border-r border-slate-200 bg-white p-4 md:sticky md:top-[80px] md:h-[calc(100vh-80px)] md:w-64">
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-lg font-black text-sky-700">
            {currentUser.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900">
              {currentUser.name}
            </h3>
            <p className="truncate text-xs text-slate-500">{currentUser.email}</p>
          </div>
        </div>

        <p className="mb-2 mt-2 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          My Internship Portal
        </p>

        <SidebarItem
          icon={LayoutDashboard}
          label="Overview"
          tabId="overview"
        />
        <SidebarItem
          icon={BookOpen}
          label="My Courses"
          tabId="courses"
        />
        <SidebarItem
          icon={ClipboardList}
          label="My Applications"
          tabId="applications"
        />
        <SidebarItem
          icon={Award}
          label="Certificates"
          tabId="certificates"
        />

        <p className="mb-2 mt-6 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
          Discover
        </p>

        <SidebarItem
          icon={Compass}
          label="Browse Internships"
          tabId="browse"
        />
      </aside>

      <main className="w-full flex-1 overflow-y-auto p-4 md:p-8">
        {dashboardTab === 'overview' && (
          <div className="mx-auto max-w-5xl space-y-8">
            <div>
              <h1 className="font-heading text-3xl font-black text-slate-900">
                Welcome back, {currentUser.name?.split(' ')[0] || 'Student'}!
              </h1>
              <p className="mt-1 font-medium text-slate-500">
                Track your internship applications and learning journey here.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100">
                  <ClipboardList className="h-6 w-6 text-sky-600" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">
                    {applications.length}
                  </p>
                  <p className="text-sm font-semibold text-slate-500">
                    Applications
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
                  <Briefcase className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">
                    {activeInternshipCount}
                  </p>
                  <p className="text-sm font-semibold text-slate-500">
                    Active Internships
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                  <Award className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">
                    {completedCount}
                  </p>
                  <p className="text-sm font-semibold text-slate-500">
                    Certificates
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Recent Applications
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your latest internship application updates.
                  </p>
                </div>

                <button
                  onClick={() => setDashboardTab('applications')}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                >
                  View All
                </button>
              </div>

              {applicationsLoading ? (
                <div className="flex items-center gap-2 py-8 text-sm font-semibold text-slate-500">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  Loading applications...
                </div>
              ) : applicationCards.length > 0 ? (
                <div className="space-y-3">
                  {applicationCards.slice(0, 3).map((application) => (
                    <div
                      key={application.id}
                      className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {application.internship?.title || 'Internship Program'}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Applied on {formatDate(application.applied_at)}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-[11px] font-black ${
                          STATUS_STYLE[application.status] || STATUS_STYLE.applied
                        }`}
                      >
                        {STATUS_LABEL[application.status] || 'Applied'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                  <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
                  <h3 className="mt-3 font-bold text-slate-900">
                    No applications yet
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Browse available internships and apply for the one you like.
                  </p>
                  <button
                    onClick={() => setDashboardTab('browse')}
                    className="mt-5 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700"
                  >
                    Browse Internships
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {dashboardTab === 'applications' && (
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  My Applications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track every internship application in one place.
                </p>
              </div>

              <button
                onClick={loadApplications}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            {applicationsLoading ? (
              <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-sm font-semibold text-slate-500">
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                Loading applications...
              </div>
            ) : applicationCards.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {applicationCards.map((application) => (
                  <div
                    key={application.id}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">
                          {application.internship?.title || 'Internship Program'}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {application.internship?.duration || 'Duration to be announced'}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black ${
                          STATUS_STYLE[application.status] || STATUS_STYLE.applied
                        }`}
                      >
                        {STATUS_LABEL[application.status] || 'Applied'}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
                      <p className="text-slate-600">
                        <span className="font-semibold text-slate-500">
                          Application No:
                        </span>{' '}
                        <span className="font-mono font-bold text-sky-700">
                          {application.application_number || '—'}
                        </span>
                      </p>

                      <p className="text-slate-600">
                        <span className="font-semibold text-slate-500">
                          Applied:
                        </span>{' '}
                        {formatDate(application.applied_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
                <h3 className="text-lg font-bold text-slate-900">
                  No internship applications yet
                </h3>
                <button
                  onClick={() => setDashboardTab('browse')}
                  className="mt-5 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-sky-700"
                >
                  Browse Internships
                </button>
              </div>
            )}
          </div>
        )}

        {dashboardTab === 'courses' && (
          openCourse ? (
            <CoursePlayer
              internship={openCourse}
              currentUser={currentUser}
              onBack={() => setOpenCourse(null)}
            />
          ) : (
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-black text-slate-900">My Courses</h2>
              <p className="mb-6 mt-1 text-sm text-slate-500">
                Accepted internships ka course content yahan milega.
              </p>
              {applicationCards.filter(
                (a) => a.internship && ['accepted', 'enrolled', 'completed'].includes(a.status)
              ).length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {applicationCards
                    .filter((a) => a.internship && ['accepted', 'enrolled', 'completed'].includes(a.status))
                    .map((a) => (
                      <div key={a.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900">{a.internship.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{a.internship.duration}</p>
                        <button
                          onClick={() => setOpenCourse(a.internship)}
                          className="mt-5 w-full rounded-xl bg-sky-600 py-2.5 text-sm font-bold text-white hover:bg-sky-700"
                        >
                          Open Course
                        </button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
                  <h3 className="mt-3 font-bold text-slate-900">Koi course unlock nahi hua</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Jab admin tumhari application accept karega, course yahan dikhega.
                  </p>
                </div>
              )}
            </div>
          )
        )}

        {dashboardTab === 'browse' && (
          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <InternshipSection
              companyInfo={companyInfo}
              internships={internships}
              currentUser={currentUser}
              onOpenAuthModal={onOpenAuthModal}
            />
          </div>
        )}

        {dashboardTab === 'certificates' && (
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  My Certificates
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Download certificates issued by the admin.
                </p>
              </div>

              <button
                onClick={loadCertificates}
                disabled={certLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${certLoading ? 'animate-spin' : ''}`}
                />
                Refresh
              </button>
            </div>

            {certError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {certError}
              </div>
            )}

            {certLoading && certificates.length === 0 ? (
              <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-sm font-semibold text-slate-500">
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                Loading certificates...
              </div>
            ) : certificates.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {certificates.map((certificate) => {
                  const isValid = certificate.status === 'issued';

                  return (
                    <div
                      key={certificate.id}
                      className={`flex flex-col rounded-3xl border bg-white p-6 shadow-sm ${
                        isValid ? 'border-slate-200' : 'border-red-200 opacity-80'
                      }`}
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                          <Award className="h-6 w-6 text-emerald-600" />
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                            isValid
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {isValid ? 'Valid' : 'Revoked'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold leading-snug text-slate-900">
                        {certificate.program_name}
                      </h3>

                      <p className="mt-1 text-xs font-bold uppercase text-slate-400">
                        {certificate.certificate_type === 'course'
                          ? 'Course Completion'
                          : 'Internship Completion'}
                      </p>

                      <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                        <p>
                          <span className="font-semibold text-slate-500">
                            Certificate No:
                          </span>{' '}
                          <span className="font-mono font-bold text-sky-700">
                            {certificate.certificate_number}
                          </span>
                        </p>

                        <p>
                          <span className="font-semibold text-slate-500">
                            Issued on:
                          </span>{' '}
                          {formatDate(certificate.issued_date)}
                        </p>
                      </div>

                      <button
                        onClick={() => downloadCertificate(certificate)}
                        disabled={
                          !isValid ||
                          !certificate.file_path ||
                          downloadingId === certificate.id
                        }
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-2.5 font-bold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                      >
                        {downloadingId === certificate.id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}

                        {isValid ? 'Download PDF' : 'Certificate Revoked'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
                <Award className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No Certificates Yet
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Complete an internship program to earn your certificate.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}