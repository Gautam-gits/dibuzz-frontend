import React, { useCallback, useEffect, useState } from 'react';
import { X, Plus, Trash2, ChevronUp, ChevronDown, LoaderCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RESOURCE_TYPES } from '../lib/resourceUtils';

const INP = 'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500';

export function ContentManager({ internship, onClose }) {
  const [modules, setModules] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newModule, setNewModule] = useState('');
  const [form, setForm] = useState({ moduleId: '', title: '', type: 'video', url: '', body: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: mods, error: e1 } = await supabase
      .from('internship_modules').select('*')
      .eq('internship_id', internship.id).order('sort_order');
    if (e1) { setError(e1.message); setLoading(false); return; }
    const ids = (mods || []).map(m => m.id);
    let res = [];
    if (ids.length) {
      const { data, error: e2 } = await supabase
        .from('internship_resources').select('*').in('module_id', ids).order('sort_order');
      if (e2) setError(e2.message); else res = data || [];
    }
    setModules(mods || []);
    setResources(res);
    setLoading(false);
  }, [internship.id]);

  useEffect(() => { load(); }, [load]);

  const addModule = async (e) => {
    e.preventDefault();
    if (!newModule.trim()) return;
    setError('');
    const { error: err } = await supabase.from('internship_modules').insert({
      internship_id: internship.id, title: newModule.trim(), sort_order: modules.length + 1,
    });
    if (err) setError(err.message); else { setNewModule(''); load(); }
  };

  const deleteModule = async (m) => {
    if (!window.confirm(`Delete module "${m.title}" and all its resources?`)) return;
    const { error: err } = await supabase.from('internship_modules').delete().eq('id', m.id);
    if (err) setError(err.message); else load();
  };

  const addResource = async (e) => {
    e.preventDefault();
    if (!form.moduleId || !form.title.trim()) { setError('Module and title are required.'); return; }
    if (form.type === 'notes' ? !form.body.trim() : !form.url.trim()) {
      setError(form.type === 'notes' ? 'Write the notes text.' : 'Paste the link.'); return;
    }
    setError('');
    const count = resources.filter(r => String(r.module_id) === String(form.moduleId)).length;
    const { error: err } = await supabase.from('internship_resources').insert({
      module_id: Number(form.moduleId), title: form.title.trim(), type: form.type,
      url: form.type === 'notes' ? null : form.url.trim(),
      body: form.type === 'notes' ? form.body.trim() : null,
      sort_order: count + 1,
    });
    if (err) setError(err.message);
    else { setForm({ ...form, title: '', url: '', body: '' }); load(); }
  };

  const deleteResource = async (r) => {
    if (!window.confirm(`Delete "${r.title}"?`)) return;
    const { error: err } = await supabase.from('internship_resources').delete().eq('id', r.id);
    if (err) setError(err.message); else load();
  };

  // swap sort_order of two neighbours
  const move = async (table, list, index, dir) => {
    const a = list[index], b = list[index + dir];
    if (!a || !b) return;
    await supabase.from(table).update({ sort_order: b.sort_order }).eq('id', a.id);
    await supabase.from(table).update({ sort_order: a.sort_order }).eq('id', b.id);
    load();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative my-6 w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-slate-50 p-1.5 text-slate-500 hover:bg-slate-100">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-black text-slate-900">Course Content</h3>
        <p className="mb-5 text-xs font-semibold text-slate-500">{internship.title}</p>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">{error}</div>}

        {/* Step 1: modules */}
        <form onSubmit={addModule} className="mb-6 flex gap-2">
          <input className={INP} placeholder="Step 1 → Module name (e.g. Week 1: Basics)" value={newModule} onChange={e => setNewModule(e.target.value)} />
          <button className="flex shrink-0 items-center gap-1 rounded-xl bg-violet-600 px-4 text-xs font-bold text-white hover:bg-violet-700">
            <Plus className="h-4 w-4" /> Module
          </button>
        </form>

        {/* Step 2: resource */}
        {modules.length > 0 && (
          <form onSubmit={addResource} className="mb-6 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Step 2 → Add resource</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <select className={INP} value={form.moduleId} onChange={e => setForm({ ...form, moduleId: e.target.value })}>
                <option value="">Select module…</option>
                {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
              <select className={INP} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <input className={INP} placeholder="Resource title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            {form.type === 'notes' ? (
              <textarea rows={4} className={INP} placeholder="Write notes here…" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
            ) : (
              <input className={INP} placeholder="Paste YouTube / Drive / website link" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
            )}
            <button className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">Add Resource</button>
          </form>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center gap-2 py-6 text-sm font-semibold text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : modules.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">Abhi koi module nahi hai. Upar se pehla module add karo.</p>
        ) : (
          <div className="space-y-4">
            {modules.map((m, mi) => {
              const list = resources.filter(r => r.module_id === m.id);
              return (
                <div key={m.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h4 className="text-sm font-black text-slate-900">{mi + 1}. {m.title}</h4>
                    <div className="flex gap-1">
                      <button onClick={() => move('internship_modules', modules, mi, -1)} className="rounded-lg p-1 hover:bg-slate-100"><ChevronUp className="h-4 w-4" /></button>
                      <button onClick={() => move('internship_modules', modules, mi, 1)} className="rounded-lg p-1 hover:bg-slate-100"><ChevronDown className="h-4 w-4" /></button>
                      <button onClick={() => deleteModule(m)} className="rounded-lg p-1 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  {list.length === 0 && <p className="text-xs text-slate-400">No resources yet.</p>}
                  {list.map((r, ri) => (
                    <div key={r.id} className="flex items-center justify-between gap-2 border-t border-slate-100 py-2 text-xs">
                      <span className="min-w-0 truncate font-semibold text-slate-700">
                        <span className="mr-2 rounded bg-violet-50 px-1.5 py-0.5 text-[10px] font-black uppercase text-violet-700">{r.type}</span>
                        {r.title}
                      </span>
                      <div className="flex shrink-0 gap-1">
                        <button onClick={() => move('internship_resources', list, ri, -1)} className="rounded-lg p-1 hover:bg-slate-100"><ChevronUp className="h-3.5 w-3.5" /></button>
                        <button onClick={() => move('internship_resources', list, ri, 1)} className="rounded-lg p-1 hover:bg-slate-100"><ChevronDown className="h-3.5 w-3.5" /></button>
                        <button onClick={() => deleteResource(r)} className="rounded-lg p-1 text-red-500 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
