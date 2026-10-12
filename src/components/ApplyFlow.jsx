import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Badge, Button } from './ui';
import { canEnrollNow, needsApproval } from '../lib/programs';

export const STATUS_LABEL = {
  applied: 'Applied',
  accepted: 'Accepted',
  rejected: 'Rejected',
  payment_pending: 'Payment pending',
  enrolled: 'Enrolled',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const STATUS_TONE = {
  applied: 'brand',
  accepted: 'ok',
  rejected: 'bad',
  payment_pending: 'warn',
  enrolled: 'brand',
  completed: 'ok',
  cancelled: 'warn',
};

const EMPTY_FORM = { name: '', email: '', phone: '', college: '', degree: '' };
const INPUT =
  'w-full rounded-control border border-line bg-white px-3 py-2.5 text-sm text-navy outline-none focus:border-brand focus:ring-2 focus:ring-soft';

/**
 * Shared "apply to a program" logic (same Supabase calls the old page used).
 * Returns: the student's applications by program id, a start() function,
 * and a `modal` element that the page must render.
 */
export function useApplyFlow({ currentUser, onOpenAuthModal }) {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const loadApplications = async () => {
    if (!currentUser?.id) {
      setApplications([]);
      return [];
    }
    const { data, error: loadError } = await supabase
      .from('internship_applications')
      .select('*')
      .eq('student_id', currentUser.id)
      .order('applied_at', { ascending: false });
    if (loadError) return [];
    setApplications(data || []);
    return data || [];
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const byProgram = useMemo(
    () =>
      applications.reduce((result, application) => {
        result[application.internship_id] = application;
        return result;
      }, {}),
    [applications]
  );

  const start = (program) => {
    if (!currentUser) {
      onOpenAuthModal?.('login');
      return;
    }
    const existing = byProgram[program.id];
    if (existing) {
      setSelected(program);
      setSubmitted(existing);
      return;
    }
    if (!canEnrollNow(program)) return;
    if (!needsApproval(program)) {
      join(program);
      return;
    }
    setForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      college: currentUser.collegeName || '',
      degree: [currentUser.course, currentUser.branch].filter(Boolean).join(' / '),
    });
    setError('');
    setSubmitted(null);
    setSelected(program);
  };

  // Programs without approval: the database function enrolls the student (free programs only)
  const join = async (program) => {
    setBusy(true);
    setError('');
    const { error: joinError } = await supabase.rpc('join_program', { p_internship_id: program.id });
    if (joinError) {
      setBusy(false);
      setSelected(program);
      setSubmitted(null);
      setError(joinError.message || 'Could not join this program.');
      return;
    }
    const list = await loadApplications();
    setBusy(false);
    const found = list.find((item) => item.internship_id === program.id) || null;
    if (!found) setError('You joined, but we could not load your enrollment. Please refresh the page.');
    setSelected(program);
    setSubmitted(found);
  };

  const close = () => {
    if (busy) return;
    setSelected(null);
    setSubmitted(null);
    setError('');
  };

  const setField = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!currentUser?.id || !selected) return;
    if (!form.name.trim() || !form.email.trim() || !form.college.trim() || !form.degree.trim()) {
      setError('Please complete all required fields.');
      return;
    }
    setBusy(true);
    setError('');
    const { data, error: insertError } = await supabase
      .from('internship_applications')
      .insert({
        internship_id: selected.id,
        student_id: currentUser.id,
        student_name: form.name.trim(),
        student_email: form.email.trim().toLowerCase(),
        student_phone: form.phone.trim(),
        college_name: form.college.trim(),
        degree: form.degree.trim(),
        status: 'applied',
        payment_status: 'not_started',
      })
      .select()
      .single();
    setBusy(false);

    if (insertError) {
      setError(
        insertError.code === '23505'
          ? 'You have already applied for this program.'
          : insertError.message || 'Application could not be submitted.'
      );
      return;
    }
    setApplications((previous) => [data, ...previous]);
    setSubmitted(data);
  };

  const modal = selected ? (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-navy/60 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" className="relative my-6 w-full max-w-lg rounded-card bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={close}
          disabled={busy}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-soft text-muted hover:text-navy disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted && selected && !needsApproval(selected) ? (
          <div className="py-4 text-center">
            <h2 className="text-xl font-extrabold text-navy">Could not enroll</h2>
            <div role="alert" className="mt-4 rounded-control bg-bad-bg p-3 text-sm font-semibold text-bad">{error}</div>
            <Button className="mt-6 w-full" onClick={close}>Close</Button>
          </div>
        ) : submitted ? (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ok-bg">
              <CheckCircle2 className="h-9 w-9 text-ok" />
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-navy">
              {submitted.status === 'applied'
                ? 'Application submitted'
                : submitted.status === 'enrolled'
                  ? 'You are enrolled'
                  : 'Your application'}
            </h2>
            <p className="mt-2 text-sm text-muted">
              <span className="font-bold text-navy">{selected.title}</span>
              {submitted.status === 'applied' ? ' — sent to the DIBUZZ team for review.' : ''}
            </p>
            <div className="mt-5 rounded-control border border-line bg-page p-4 text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Application number</p>
              <p className="mt-1 font-mono text-sm font-extrabold text-brand">{submitted.application_number}</p>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-muted">Status</p>
              <div className="mt-1">
                <Badge tone={STATUS_TONE[submitted.status] || 'brand'}>{STATUS_LABEL[submitted.status] || 'Applied'}</Badge>
              </div>
            </div>
            {['enrolled', 'completed'].includes(submitted.status)
              || (submitted.status === 'accepted' && !selected.paymentRequired) ? (
              <Button as={Link} to="/dashboard" className="mt-6 w-full" onClick={close}>Open My Learning</Button>
            ) : (
              <Button className="mt-6 w-full" onClick={close}>Done</Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 pr-10">
              <Badge>Program application</Badge>
              <h2 className="mt-3 text-xl font-extrabold text-navy">Apply for {selected.title}</h2>
              <p className="mt-1 text-sm text-muted">The DIBUZZ team reviews every application.</p>
            </div>

            {error && (
              <div role="alert" className="mb-4 rounded-control bg-bad-bg p-3 text-sm font-semibold text-bad">{error}</div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <label className="block text-sm font-bold text-navy">
                Full name
                <input required value={form.name} onChange={setField('name')} className={`${INPUT} mt-1 font-normal`} />
              </label>
              <label className="block text-sm font-bold text-navy">
                Email address
                <input required type="email" value={form.email} onChange={setField('email')} className={`${INPUT} mt-1 font-normal`} />
              </label>
              <label className="block text-sm font-bold text-navy">
                Phone number
                <input type="tel" value={form.phone} onChange={setField('phone')} placeholder="+91 98765 43210" className={`${INPUT} mt-1 font-normal`} />
              </label>
              <label className="block text-sm font-bold text-navy">
                College name
                <input required value={form.college} onChange={setField('college')} placeholder="Your college name" className={`${INPUT} mt-1 font-normal`} />
              </label>
              <label className="block text-sm font-bold text-navy">
                Degree / branch
                <input required value={form.degree} onChange={setField('degree')} placeholder="Example: B.Tech CSE" className={`${INPUT} mt-1 font-normal`} />
              </label>
              <Button type="submit" disabled={busy} className="w-full">
                {busy ? 'Submitting…' : 'Submit application'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  ) : null;

  return { byProgram, start, modal, busy };
}
