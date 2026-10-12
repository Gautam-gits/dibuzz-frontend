import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, Eye, EyeOff, LoaderCircle, Plus, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { initialsOf } from '../lib/useTeam';

const INP = 'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-violet-500';
const BUCKET = 'team-photos';
const MAX_PHOTO_BYTES = 1024 * 1024;
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const EMPTY = { name: '', role: '', bio: '', is_published: true };

// "https://…/team-photos/abc.jpg" -> "abc.jpg"
const photoPath = (url) => (url && url.includes(`/${BUCKET}/`) ? url.split(`/${BUCKET}/`)[1].split('?')[0] : null);

export function TeamManager() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, member = edit
  const [form, setForm] = useState(EMPTY);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: loadError } = await supabase.from('team_members').select('*').order('sort_order').order('id');
    if (loadError) setError(loadError.message);
    else setMembers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 3500);
  };

  const openForm = (member) => {
    setError('');
    setPhotoFile(null);
    setPhotoPreview(member?.photo_url || '');
    setForm(member ? { name: member.name, role: member.role, bio: member.bio || '', is_published: member.is_published } : EMPTY);
    setEditing(member || {});
  };

  const closeForm = () => {
    if (saving) return;
    setEditing(null);
    setPhotoFile(null);
    setPhotoPreview('');
  };

  const chooseFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!PHOTO_TYPES.includes(file.type) || file.size > MAX_PHOTO_BYTES) {
      setError('The photo must be a JPG, PNG or WebP image under 1 MB.');
      event.target.value = '';
      return;
    }
    setError('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      setError('Name and role are required.');
      return;
    }
    setSaving(true);
    setError('');

    let photoUrl = editing?.photo_url || null;
    if (photoFile) {
      const extension = photoFile.type === 'image/png' ? 'png' : photoFile.type === 'image/webp' ? 'webp' : 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, photoFile, { contentType: photoFile.type });
      if (uploadError) {
        setSaving(false);
        setError(`Photo upload failed: ${uploadError.message}`);
        return;
      }
      photoUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    }

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      bio: form.bio.trim() || null,
      photo_url: photoUrl,
      is_published: form.is_published,
    };

    let result;
    if (editing?.id) {
      result = await supabase.from('team_members').update(payload).eq('id', editing.id);
    } else {
      const nextOrder = members.reduce((max, member) => Math.max(max, member.sort_order || 0), 0) + 1;
      result = await supabase.from('team_members').insert({ ...payload, sort_order: nextOrder });
    }
    setSaving(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }
    // Remove the old photo file when it was replaced
    const oldPath = photoFile ? photoPath(editing?.photo_url) : null;
    if (oldPath) await supabase.storage.from(BUCKET).remove([oldPath]);

    flash(editing?.id ? 'Team member updated.' : 'Team member added.');
    closeForm();
    load();
  };

  const move = async (index, direction) => {
    const other = members[index + direction];
    const current = members[index];
    if (!other || !current) return;
    const a = current.sort_order ?? index + 1;
    const b = other.sort_order ?? index + 1 + direction;
    const first = await supabase.from('team_members').update({ sort_order: b }).eq('id', current.id);
    const second = await supabase.from('team_members').update({ sort_order: a }).eq('id', other.id);
    if (first.error || second.error) setError((first.error || second.error).message);
    load();
  };

  const toggleVisible = async (member) => {
    const { error: updateError } = await supabase.from('team_members').update({ is_published: !member.is_published }).eq('id', member.id);
    if (updateError) setError(updateError.message);
    else flash(member.is_published ? 'Hidden from the website.' : 'Now visible on the website.');
    load();
  };

  const remove = async (member) => {
    if (!window.confirm(`Remove ${member.name} from the team? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from('team_members').delete().eq('id', member.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    const path = photoPath(member.photo_url);
    if (path) await supabase.storage.from(BUCKET).remove([path]);
    flash('Team member removed.');
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900">Team members</h2>
          <p className="text-xs text-slate-500">These people appear on the About page, in this order.</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700"
        >
          <Plus className="h-4 w-4" /> Add team member
        </button>
      </div>

      {notice && <div className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{notice}</div>}
      {error && !editing && <div className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

      {loading ? (
        <div className="flex justify-center py-12"><LoaderCircle className="h-6 w-6 animate-spin text-violet-600" /></div>
      ) : members.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
          No team members yet. Add the first one above.
        </p>
      ) : (
        <ul className="space-y-3">
          {members.map((member, index) => (
            <li key={member.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              {member.photo_url ? (
                <img src={member.photo_url} alt="" className="h-14 w-14 shrink-0 rounded-full border border-slate-200 object-cover" />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-50 text-lg font-black text-violet-700">
                  {initialsOf(member.name)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-900">
                  {member.name}
                  {!member.is_published && (
                    <span className="ml-2 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-black uppercase text-slate-500">Hidden</span>
                  )}
                </p>
                <p className="truncate text-xs font-semibold text-violet-700">{member.role}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button onClick={() => move(index, 1)} disabled={index === members.length - 1} aria-label="Move down" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button onClick={() => toggleVisible(member)} aria-label={member.is_published ? 'Hide from website' : 'Show on website'} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                  {member.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => openForm(member)} aria-label="Edit" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button onClick={() => remove(member)} aria-label="Remove" className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4">
          <form onSubmit={save} className="relative my-6 w-full max-w-md space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
            <button type="button" onClick={closeForm} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 hover:text-slate-900">
              <X className="h-4 w-4" />
            </button>
            <h3 className="pr-10 text-lg font-black text-slate-900">{editing.id ? 'Edit team member' : 'Add team member'}</h3>

            {error && <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}

            <div className="flex items-center gap-4">
              {photoPreview ? (
                <img src={photoPreview} alt="" className="h-20 w-20 shrink-0 rounded-full border border-slate-200 object-cover" />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xl font-black text-violet-700">
                  {initialsOf(form.name)}
                </div>
              )}
              <label className="block text-xs font-bold text-slate-700">
                Photo (optional)
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile} className="mt-1 block w-full text-xs font-normal text-slate-600" />
                <span className="mt-1 block font-normal text-slate-500">JPG, PNG or WebP, under 1 MB. A square photo works best.</span>
              </label>
            </div>

            <label className="block text-xs font-bold text-slate-700">
              Full name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${INP} mt-1 font-normal`} />
            </label>
            <label className="block text-xs font-bold text-slate-700">
              Role
              <input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Example: Founder & Director" className={`${INP} mt-1 font-normal`} />
            </label>
            <label className="block text-xs font-bold text-slate-700">
              Short bio (optional)
              <textarea rows="4" maxLength="300" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={`${INP} mt-1 resize-none font-normal`} />
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
              Show on the About page
            </label>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" onClick={closeForm} disabled={saving} className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
