import React, { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const STATUS_STYLE = {
  applied: 'bg-sky-100 text-sky-700 border-sky-200',
  accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  payment_pending: 'bg-amber-100 text-amber-700 border-amber-200',
  enrolled: 'bg-violet-100 text-violet-700 border-violet-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-slate-100 text-slate-700 border-slate-200'
};

const STATUS_LABEL = {
  applied: 'Applied',
  accepted: 'Accepted',
  rejected: 'Rejected',
  payment_pending: 'Payment Pending',
  enrolled: 'Enrolled',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

export function InternshipSection({
  companyInfo = {},
  internships = [],
  currentUser,
  onOpenAuthModal
}) {
  const [filterSem, setFilterSem] = useState('3rd Sem');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedApplication, setSubmittedApplication] = useState(null);

  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [degree, setDegree] = useState('');

  const topicImages = {
    Python: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80',
    Web: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    Artificial: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
    Machine: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    Internet: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    AutoCAD: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    SolidWorks: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    MATLAB: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80'
  };

  const getImage = (title = '') => {
    const key = Object.keys(topicImages).find((item) =>
      title.toLowerCase().includes(item.toLowerCase())
    );

    return (
      topicImages[key] ||
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
    );
  };

  const loadApplications = async () => {
    if (!currentUser?.id) {
      setApplications([]);
      return;
    }

    const { data, error } = await supabase
      .from('internship_applications')
      .select('*')
      .eq('student_id', currentUser.id)
      .order('applied_at', { ascending: false });

    if (!error) {
      setApplications(data || []);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [currentUser?.id]);

  const applicationByInternship = useMemo(() => {
    return applications.reduce((result, application) => {
      result[application.internship_id] = application;
      return result;
    }, {});
  }, [applications]);

  const displayPrograms = internships.filter((item) => {
    if (filterSem === 'All') return true;
    return item.badge?.includes(filterSem.replace(' Sem', ''));
  });

  const openApplyModal = (internship) => {
    if (!currentUser) {
      onOpenAuthModal?.('login');
      return;
    }

    const existingApplication = applicationByInternship[internship.id];

    if (existingApplication) {
      setSelectedInternship(internship);
      setSubmittedApplication(existingApplication);
      return;
    }

    setApplicantName(currentUser.name || '');
    setApplicantEmail(currentUser.email || '');
    setApplicantPhone(currentUser.phone || '');
    setCollegeName(currentUser.collegeName || '');
    setDegree(
      [currentUser.course, currentUser.branch].filter(Boolean).join(' / ') || ''
    );
    setFormError('');
    setSubmittedApplication(null);
    setSelectedInternship(internship);
  };

  const closeModal = () => {
    if (isSubmitting) return;

    setSelectedInternship(null);
    setSubmittedApplication(null);
    setFormError('');
  };

  const submitApplication = async (event) => {
    event.preventDefault();

    if (!currentUser?.id || !selectedInternship) return;

    if (!applicantName.trim() || !applicantEmail.trim() || !collegeName.trim() || !degree.trim()) {
      setFormError('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const { data, error } = await supabase
      .from('internship_applications')
      .insert({
        internship_id: selectedInternship.id,
        student_id: currentUser.id,
        student_name: applicantName.trim(),
        student_email: applicantEmail.trim().toLowerCase(),
        student_phone: applicantPhone.trim(),
        college_name: collegeName.trim(),
        degree: degree.trim(),
        status: 'applied',
        payment_status: 'not_started'
      })
      .select()
      .single();

    setIsSubmitting(false);

    if (error) {
      if (error.code === '23505') {
        setFormError('You have already applied for this internship.');
      } else {
        setFormError(error.message || 'Application could not be submitted.');
      }
      return;
    }

    setApplications((previous) => [data, ...previous]);
    setSubmittedApplication(data);
  };

  const SEM_TABS = [
    { label: '3rd Semester', value: '3rd Sem' },
    { label: '5th Semester', value: '5th Sem' },
    { label: '7th Semester', value: '7th Sem' },
    { label: 'All', value: 'All' }
  ];

  return (
    <section className="relative min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-mono text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 shadow-2xs sm:mb-4">
            <Briefcase className="h-3 w-3" /> Online Training Programs
          </div>

          <h1 className="font-heading text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Semester Training & Internship Programs
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            MCA & MSME Recognized · {companyInfo.name || 'DIBUZZ DIGITAL PRIVATE LIMITED'}
          </p>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 overflow-x-auto pb-4 sm:mb-10">
          <Filter className="h-4 w-4 shrink-0 text-slate-400" />

          {SEM_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterSem(tab.value)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-extrabold transition-all sm:px-5 sm:py-2.5 ${
                filterSem === tab.value
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {displayPrograms.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {displayPrograms.map((item) => {
              const application = applicationByInternship[item.id];
              const noSeatsLeft =
                item.openings !== null &&
                item.openings !== undefined &&
                Number(item.openings) <= 0;

              return (
                <article
                  key={item.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:border-sky-400 hover:shadow-lg hover:shadow-sky-100"
                >
                  <div>
                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        src={item.image || getImage(item.title)}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />

                      <span className="absolute left-2 top-2 rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-xs">
                        {item.badge || 'Internship'}
                      </span>

                      <span className="absolute right-2 top-2 rounded-md bg-emerald-600 px-2.5 py-0.5 font-mono text-xs font-black text-white shadow-xs">
                        {item.stipend || 'Coming Soon'}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-heading text-base font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-sky-600">
                        {item.title}
                      </h3>

                      <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <Building2 className="h-3.5 w-3.5 text-sky-600" />
                        {item.company || companyInfo.name || 'DIBUZZ DIGITAL PRIVATE LIMITED'}
                      </p>

                      <div className="my-3 space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">Fee / Stipend:</span>
                          <span className="font-mono text-[11px] font-extrabold text-emerald-700">
                            {item.stipend || 'Coming Soon'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">Duration:</span>
                          <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-900">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {item.duration || '4-6 Weeks'}
                          </span>
                        </div>

                        {item.openings > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">Openings:</span>
                            <span className="text-[11px] font-bold text-sky-700">
                              {item.openings} seats
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(item.skills) ? item.skills : []).map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-100 p-4 pt-3">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      Certificate Eligible
                    </span>

                    {application ? (
                      <button
                        onClick={() => openApplyModal(item)}
                        className={`rounded-xl border px-3.5 py-1.5 text-xs font-extrabold ${
                          STATUS_STYLE[application.status] || STATUS_STYLE.applied
                        }`}
                      >
                        {STATUS_LABEL[application.status] || 'Applied'}
                      </button>
                    ) : noSeatsLeft ? (
                      <button
                        disabled
                        className="cursor-not-allowed rounded-xl bg-slate-200 px-3.5 py-1.5 text-xs font-extrabold text-slate-500"
                      >
                        Full
                      </button>
                    ) : (
                      <button
                        onClick={() => openApplyModal(item)}
                        className="rounded-xl bg-sky-600 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-xs transition-all hover:bg-sky-700"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto max-w-xl">
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-600">
                <Briefcase className="h-7 w-7" />
              </div>

              <div>
                <h3 className="font-heading text-xl font-black text-slate-900">
                  No Internship Programs Yet
                </h3>
                <p className="mx-auto mt-1 max-w-sm text-xs font-medium text-slate-500">
                  New internship programs will appear here once the admin publishes them.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedInternship && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative my-6 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition-colors hover:text-slate-900 disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {submittedApplication ? (
              <div className="py-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-900">
                  Application Submitted
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Your application for{' '}
                  <span className="font-bold text-slate-700">{selectedInternship.title}</span>{' '}
                  has been sent to the admin team.
                </p>

                <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Application Number
                  </p>
                  <p className="mt-1 font-mono text-sm font-black text-sky-700">
                    {submittedApplication.application_number}
                  </p>

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Current Status
                  </p>
                  <span className="mt-1 inline-flex rounded-full border border-sky-200 bg-sky-100 px-2.5 py-1 text-[10px] font-black uppercase text-sky-700">
                    {STATUS_LABEL[submittedApplication.status] || 'Applied'}
                  </span>
                </div>

                <button
                  onClick={closeModal}
                  className="mt-6 w-full rounded-xl bg-sky-600 py-3 text-sm font-black text-white hover:bg-sky-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 pr-8">
                  <div className="flex items-center gap-2 text-sky-700">
                    <Briefcase className="h-5 w-5" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Internship Application
                    </span>
                  </div>

                  <h2 className="mt-2 text-xl font-black text-slate-900">
                    Apply for {selectedInternship.title}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Your application will be reviewed by the DIBUZZ admin team.
                  </p>
                </div>

                {formError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                    {formError}
                  </div>
                )}

                <form onSubmit={submitApplication} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        required
                        value={applicantName}
                        onChange={(event) => setApplicantName(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        required
                        type="email"
                        value={applicantEmail}
                        onChange={(event) => setApplicantEmail(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="tel"
                        value={applicantPhone}
                        onChange={(event) => setApplicantPhone(event.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      College Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        required
                        value={collegeName}
                        onChange={(event) => setCollegeName(event.target.value)}
                        placeholder="Your college name"
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700">
                      Degree / Branch
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        required
                        value={degree}
                        onChange={(event) => setDegree(event.target.value)}
                        placeholder="Example: B.Tech CSE"
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Selected Internship
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-800">
                      {selectedInternship.title}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 text-sm font-black text-white shadow-md transition-all hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-400"
                  >
                    {isSubmitting ? 'Submitting Application…' : 'Submit Application'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}