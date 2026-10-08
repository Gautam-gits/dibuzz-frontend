import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, LoaderCircle, PlayCircle, FileText, Link as LinkIcon, StickyNote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getEmbedUrl } from '../lib/resourceUtils';

const ICON = { video: PlayCircle, pdf: FileText, link: LinkIcon, notes: StickyNote };

export function CoursePlayer({ internship, currentUser, onBack }) {
  const [modules, setModules] = useState([]);
  const [resources, setResources] = useState([]);
  const [done, setDone] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data: mods, error: e1 } = await supabase
      .from('internship_modules').select('*').eq('internship_id', internship.id).order('sort_order');
    if (e1) { setError(e1.message); setLoading(false); return; }
    const ids = (mods || []).map(m => m.id);
    let res = [], doneIds = [];
    if (ids.length) {
      const r = await supabase.from('internship_resources').select('*').in('module_id', ids).order('sort_order');
      res = r.data || [];
      if (res.length) {
        const p = await supabase.from('resource_progress').select('resource_id')
          .eq('student_id', currentUser.id).in('resource_id', res.map(x => x.id));
        doneIds = (p.data || []).map(x => x.resource_id);
      }
    }
    setModules(mods || []);
    setResources(res);
    setDone(new Set(doneIds));
    setLoading(false);
  }, [internship.id, currentUser.id]);

  useEffect(() => { load(); }, [load]);

  // all resources in correct order: module order, then resource order
  const flat = useMemo(
    () => modules.flatMap(m => resources.filter(r => r.module_id === m.id)),
    [modules, resources]
  );

  useEffect(() => {
    if (!selectedId && flat.length) {
      setSelectedId((flat.find(r => !done.has(r.id)) || flat[0]).id);
    }
  }, [flat, done, selectedId]);

  const current = flat.find(r => r.id === selectedId);
  const index = flat.findIndex(r => r.id === selectedId);
  const percent = flat.length ? Math.round((done.size / flat.length) * 100) : 0;

  const toggleDone = async (resource) => {
    setError('');
    const isDone = done.has(resource.id);
    const q = isDone
      ? supabase.from('resource_progress').delete().eq('student_id', currentUser.id).eq('resource_id', resource.id)
      : supabase.from('resource_progress').insert({ student_id: currentUser.id, resource_id: resource.id });
    const { error: err } = await q;
    if (err) { setError(err.message); return; }
    setDone(prev => {
      const next = new Set(prev);
      isDone ? next.delete(resource.id) : next.add(resource.id);
      return next;
    });
  };

  const markAndNext = async () => {
    if (!current) return;
    if (!done.has(current.id)) await toggleDone(current);
    if (flat[index + 1]) setSelectedId(flat[index + 1].id);
  };

  if (loading) {
    return <div className="flex items-center gap-2 p-10 text-sm font-semibold text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /> Loading course…</div>;
  }

  const embed = current ? getEmbedUrl(current.url) : null;

  return (
    <div className="mx-auto max-w-6xl">
      <button onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to My Courses
      </button>

      <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-black text-slate-900">{internship.title}</h2>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-xs font-black text-slate-700">{done.size}/{flat.length} done · {percent}%</span>
        </div>
        {percent === 100 && flat.length > 0 && (
          <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
            🎉 Course complete! Certificate admin issue karega — "Certificates" tab check karte raho.
          </p>
        )}
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{error}</div>}

      {flat.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Admin ne abhi tak content add nahi kiya. Thodi der baad dekho.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Viewer */}
          <div className="space-y-4 lg:col-span-2">
            {current && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <h3 className="mb-3 text-base font-black text-slate-900">{current.title}</h3>

                {embed ? (
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
                    <iframe src={embed} title={current.title} className="h-full w-full" allowFullScreen
                      allow="accelerometer; autoplay; encrypted-media; picture-in-picture" />
                  </div>
                ) : current.type === 'notes' ? (
                  <div className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{current.body}</div>
                ) : (
                  <a href={current.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700">
                    <ExternalLink className="h-4 w-4" /> Open resource
                  </a>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => toggleDone(current)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-bold ${done.has(current.id) ? 'bg-emerald-100 text-emerald-700' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>
                    {done.has(current.id) ? '✓ Completed (undo)' : 'Mark as complete'}
                  </button>
                  {flat[index + 1] && (
                    <button onClick={markAndNext} className="rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-sky-700">
                      Complete & Next →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar list */}
          <div className="space-y-3">
            {modules.map((m, mi) => (
              <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                <p className="mb-1 px-2 text-xs font-black uppercase tracking-wide text-slate-500">{mi + 1}. {m.title}</p>
                {resources.filter(r => r.module_id === m.id).map(r => {
                  const Icon = ICON[r.type] || LinkIcon;
                  const isDone = done.has(r.id);
                  return (
                    <button key={r.id} onClick={() => setSelectedId(r.id)}
                      className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-semibold ${r.id === selectedId ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                      {isDone ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> : <Circle className="h-4 w-4 shrink-0 text-slate-300" />}
                      <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{r.title}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
