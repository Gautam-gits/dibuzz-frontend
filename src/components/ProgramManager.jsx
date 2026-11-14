import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, BookOpen, Edit3, Plus, Search, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ContentManager } from './ContentManager';

const INPUT = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100';
const label = 'text-xs font-bold text-slate-700';
const standardFields = ['name', 'college_name', 'registration_number', 'roll_number', 'branch', 'semester', 'phone', 'noc_pdf'];
const empty = () => ({
  title: '', kind: 'internship', category: '', semester: '', level: '', language: '', instructor_name: '', short_summary: '', description: '', image: '',
  payment_required: false, fee_amount: 0, original_fee: '', approval_required: true, openings: '', deadline: '', status: 'draft', is_featured: false,
  learn_points: [], includes: [], apply_fields: { fields: [], customQuestions: [] },
});

const lines = (value) => String(value || '').split('\n').map((item) => item.trim()).filter(Boolean);
const fieldsFor = (value) => value && !Array.isArray(value) ? value : { fields: [], customQuestions: [] };

function Field({ title, children }) { return <label className={label}>{title}{children}</label>; }

export function ProgramManager({ onChanged }) {
  const [programs, setPrograms] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const [status, setStatus] = useState('all');
  const [editor, setEditor] = useState(null);
  const [contentProgram, setContentProgram] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [programResult, applicationResult] = await Promise.all([
      supabase.from('internships').select('*').order('created_at', { ascending: false }),
      supabase.from('internship_applications').select('internship_id, status'),
    ]);
    if (programResult.error) setError(programResult.error.message); else setPrograms(programResult.data || []);
    if (!applicationResult.error) setApplications(applicationResult.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = useMemo(() => programs.filter((program) => {
    if (kind !== 'all' && program.kind !== kind) return false;
    if (status !== 'all' && program.status !== status) return false;
    const text = `${program.title} ${program.category || ''} ${program.semester || ''}`.toLowerCase();
    return text.includes(query.trim().toLowerCase());
  }), [programs, query, kind, status]);

  const countFor = (id) => applications.filter((application) => String(application.internship_id) === String(id)).length;
  const edit = (program) => setEditor({ ...empty(), ...program, apply_fields: fieldsFor(program.apply_fields) });
  const toggleField = (field) => setEditor((current) => {
    const currentFields = current.apply_fields.fields || [];
    const fields = currentFields.includes(field) ? currentFields.filter((item) => item !== field) : [...currentFields, field];
    return { ...current, apply_fields: { ...current.apply_fields, fields } };
  });

  const save = async (event) => {
    event.preventDefault();
    if (!editor.title.trim()) { setError('A program title is required.'); return; }
    setSaving(true); setError('');
    const payload = {
      title: editor.title.trim(), kind: editor.kind, category: editor.category || null, semester: editor.semester || null,
      level: editor.level || null, language: editor.language || null, instructor_name: editor.instructor_name || null,
      short_summary: editor.short_summary || null, description: editor.description || null, image: editor.image || null,
      payment_required: Boolean(editor.payment_required), fee_amount: editor.payment_required ? Number(editor.fee_amount || 0) : 0,
      original_fee: editor.payment_required && editor.original_fee !== '' ? Number(editor.original_fee) : null,
      approval_required: Boolean(editor.approval_required), openings: editor.openings === '' ? 0 : Number(editor.openings),
      deadline: editor.deadline || null, status: editor.status, is_featured: Boolean(editor.is_featured),
      learn_points: Array.isArray(editor.learn_points) ? editor.learn_points : [], includes: Array.isArray(editor.includes) ? editor.includes : [],
      apply_fields: editor.approval_required ? editor.apply_fields : { fields: [], customQuestions: [] },
    };
    const result = editor.id
      ? await supabase.from('internships').update(payload).eq('id', editor.id)
      : await supabase.from('internships').insert(payload);
    if (result.error) { setError(result.error.message); setSaving(false); return; }
    setEditor(null); setSaving(false); await load(); if (onChanged) onChanged();
  };

  const archive = async (program) => {
    if (!window.confirm(`Archive “${program.title}”? Students will no longer see it publicly.`)) return;
    const { error: requestError } = await supabase.from('internships').update({ status: 'archived' }).eq('id', program.id);
    if (requestError) setError(requestError.message); else { await load(); if (onChanged) onChanged(); }
  };

  const remove = async (program) => {
    if (!window.confirm(`Delete “${program.title}” permanently? This will remove its applications, lesson progress, and linked certificates. This cannot be undone.`)) return;
    setError('');
    const { error: requestError } = await supabase.rpc('delete_program_with_related_data', { p_program_id: program.id });
    if (requestError) {
      setError(requestError.message);
      return;
    }
    await load(); if (onChanged) onChanged();
  };

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><h2 className="text-xl font-black text-slate-900">Programs</h2><p className="mt-1 text-sm text-slate-500">Create, publish, and manage courses and internships in one place.</p></div>
      <button onClick={() => setEditor(empty())} className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700"><Plus className="h-4 w-4" /> New program</button>
    </div>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto_auto]">
      <label className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search programs" className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-500" /></label>
      <select value={kind} onChange={(event) => setKind(event.target.value)} className={INPUT.replace('mt-1 ', '')}><option value="all">All kinds</option><option value="internship">Internships</option><option value="course">Courses</option></select>
      <select value={status} onChange={(event) => setStatus(event.target.value)} className={INPUT.replace('mt-1 ', '')}><option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select>
    </div>
    {loading ? <p className="py-10 text-center text-sm font-semibold text-slate-500">Loading programs…</p> : visible.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-sm text-slate-500">No programs match these filters.</p> : <div className="grid gap-4 lg:grid-cols-2">{visible.map((program) => <article key={program.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex gap-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-black uppercase text-violet-700">{program.kind}</span><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-600">{program.status}</span>{program.semester && <span className="rounded-full bg-sky-50 px-2 py-1 text-[10px] font-black uppercase text-sky-700">{program.semester}</span>}</div><h3 className="mt-3 font-black text-slate-900">{program.title}</h3><p className="mt-1 text-xs text-slate-500">{program.payment_required ? `₹${Number(program.fee_amount || 0).toLocaleString('en-IN')} · Paid` : 'Free'} · {program.approval_required ? 'Approval required' : 'Direct enrollment'} · {countFor(program.id)} applications</p></div></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => edit(program)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Edit3 className="h-3.5 w-3.5" /> Edit</button><button onClick={() => setContentProgram(program)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><BookOpen className="h-3.5 w-3.5" /> Content</button>{program.status !== 'archived' && <button onClick={() => archive(program)} className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50"><Archive className="h-3.5 w-3.5" /> Archive</button>}<button onClick={() => remove(program)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button></div></article>)}</div>}
    {editor && <div className="fixed inset-0 z-[150] overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm"><form onSubmit={save} className="mx-auto my-5 max-w-4xl rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-black text-slate-900">{editor.id ? 'Edit program' : 'New program'}</h3><p className="mt-1 text-sm text-slate-500">Complete the program details, then save as a draft or publish.</p></div><button type="button" onClick={() => setEditor(null)} className="rounded-full bg-slate-100 p-2 text-slate-600"><X className="h-5 w-5" /></button></div><div className="mt-6 grid gap-4 md:grid-cols-2"><Field title="Program title *"><input required value={editor.title} onChange={(event) => setEditor({ ...editor, title: event.target.value })} className={INPUT} /></Field><Field title="Kind"><select value={editor.kind} onChange={(event) => setEditor({ ...editor, kind: event.target.value })} className={INPUT}><option value="internship">Internship</option><option value="course">Course</option></select></Field><Field title="Category"><input value={editor.category || ''} onChange={(event) => setEditor({ ...editor, category: event.target.value })} className={INPUT} /></Field><Field title="Semester"><input placeholder="e.g. 3rd" value={editor.semester || ''} onChange={(event) => setEditor({ ...editor, semester: event.target.value })} className={INPUT} /></Field><Field title="Level"><input value={editor.level || ''} onChange={(event) => setEditor({ ...editor, level: event.target.value })} className={INPUT} /></Field><Field title="Language"><input value={editor.language || ''} onChange={(event) => setEditor({ ...editor, language: event.target.value })} className={INPUT} /></Field><Field title="Instructor"><input value={editor.instructor_name || ''} onChange={(event) => setEditor({ ...editor, instructor_name: event.target.value })} className={INPUT} /></Field><Field title="Image URL"><input value={editor.image || ''} onChange={(event) => setEditor({ ...editor, image: event.target.value })} className={INPUT} /></Field></div><Field title="Short summary"><input value={editor.short_summary || ''} onChange={(event) => setEditor({ ...editor, short_summary: event.target.value })} className={INPUT} /></Field><Field title="Description"><textarea rows="4" value={editor.description || ''} onChange={(event) => setEditor({ ...editor, description: event.target.value })} className={INPUT} /></Field><div className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 md:grid-cols-3"><Field title="Status"><select value={editor.status} onChange={(event) => setEditor({ ...editor, status: event.target.value })} className={INPUT}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></Field><Field title="Seats"><input type="number" min="0" value={editor.openings} onChange={(event) => setEditor({ ...editor, openings: event.target.value })} className={INPUT} /></Field><Field title="Last date"><input type="date" value={editor.deadline || ''} onChange={(event) => setEditor({ ...editor, deadline: event.target.value })} className={INPUT} /></Field><label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={editor.is_featured} onChange={(event) => setEditor({ ...editor, is_featured: event.target.checked })} /> Featured on Home</label><label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={editor.approval_required} onChange={(event) => setEditor({ ...editor, approval_required: event.target.checked })} /> Needs approval</label><label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={editor.payment_required} onChange={(event) => setEditor({ ...editor, payment_required: event.target.checked })} /> Paid program</label>{editor.payment_required && <><Field title="Price (₹)"><input type="number" min="0" value={editor.fee_amount} onChange={(event) => setEditor({ ...editor, fee_amount: event.target.value })} className={INPUT} /></Field><Field title="Original price (₹)"><input type="number" min="0" value={editor.original_fee || ''} onChange={(event) => setEditor({ ...editor, original_fee: event.target.value })} className={INPUT} /></Field></>}</div><div className="mt-5 grid gap-4 md:grid-cols-2"><Field title="What students will learn (one per line)"><textarea rows="5" value={(editor.learn_points || []).join('\n')} onChange={(event) => setEditor({ ...editor, learn_points: lines(event.target.value) })} className={INPUT} /></Field><Field title="What is included (one per line)"><textarea rows="5" value={(editor.includes || []).join('\n')} onChange={(event) => setEditor({ ...editor, includes: lines(event.target.value) })} className={INPUT} /></Field></div>{editor.approval_required && <div className="mt-5 rounded-2xl border border-slate-200 p-4"><h4 className="font-black text-slate-900">Application form</h4><p className="mt-1 text-xs text-slate-500">Choose the fields this program needs. Profile details will be pre-filled in Phase E.</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{standardFields.map((field) => <label key={field} className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={(editor.apply_fields.fields || []).includes(field)} onChange={() => toggleField(field)} /> {field.replaceAll('_', ' ')}</label>)}</div><Field title="Custom questions (up to three, one per line)"><textarea rows="3" value={(editor.apply_fields.customQuestions || []).join('\n')} onChange={(event) => setEditor({ ...editor, apply_fields: { ...editor.apply_fields, customQuestions: lines(event.target.value).slice(0, 3) } })} className={INPUT} /></Field></div>}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setEditor(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700">Cancel</button><button disabled={saving} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-50">{saving ? 'Saving…' : editor.status === 'published' ? 'Publish program' : 'Save draft'}</button></div></form></div>}
    {contentProgram && <ContentManager internship={contentProgram} onClose={() => setContentProgram(null)} />}
  </div>;
}
