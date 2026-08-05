import React, { useState, useCallback } from 'react';
import {
  LayoutDashboard, BookOpen, Users, Plus, Trash2, Edit3, Briefcase, Filter, ShieldCheck,
  X, RefreshCw, Database, Zap, AlertCircle, CheckCircle2, IndianRupee, Clock, Image as ImageIcon, HelpCircle, UserPlus
} from 'lucide-react';
import { supabase } from '../lib/supabase';

/* ─── Toast ─────────────────────────────────────────────────── */
function Toast({ toasts, remove }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-semibold backdrop-blur-md
          ${t.type === 'success' ? 'bg-emerald-50 border-emerald-500/50 text-emerald-800' :
            t.type === 'error'   ? 'bg-red-50 border-red-500/50 text-red-800' :
            t.type === 'warn'    ? 'bg-amber-50 border-amber-500/50 text-amber-800' :
                                   'bg-violet-50 border-violet-500/50 text-violet-800'}`}>
          {t.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
          {t.type === 'error'   && <AlertCircle  className="w-4 h-4 shrink-0" />}
          {(t.type === 'info' || t.type === 'warn') && <Zap className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => remove(t.id)} className="ml-2 opacity-60 hover:opacity-100 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, add, remove };
}

/* ─── Confirm Dialog ────────────────────────────────────────── */
function Confirm({ msg, onOk, onCancel }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <p className="text-sm text-slate-800 font-medium">{msg}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer">
            Cancel
          </button>
          <button onClick={onOk}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatCard({ label, value, sub, icon: Icon, color, loading }) {
  const C = {
    emerald: { border: 'border-emerald-200', icon: 'text-emerald-500', val: 'text-slate-900', sub: 'text-emerald-600' },
    violet:  { border: 'border-violet-200',  icon: 'text-violet-500',  val: 'text-slate-900', sub: 'text-violet-600'  },
    indigo:  { border: 'border-indigo-200',  icon: 'text-indigo-500',  val: 'text-slate-900', sub: 'text-indigo-600'  },
    amber:   { border: 'border-amber-200',   icon: 'text-amber-500',   val: 'text-slate-900', sub: 'text-amber-600'   },
  }[color] || {};
  return (
    <div className={`bg-white border ${C.border} p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 space-y-2`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</span>
        <Icon className={`w-4 h-4 ${C.icon}`} />
      </div>
      <div className={`text-2xl sm:text-3xl font-black font-mono ${C.val}`}>
        {loading ? <span className="inline-block w-20 h-7 bg-slate-100 rounded animate-pulse" /> : value}
      </div>
      <div className={`text-[10px] font-semibold ${C.sub}`}>{sub}</div>
    </div>
  );
}

/* ─── Form Field wrapper ─────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] text-slate-600 font-bold mb-1 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
const INP = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all";

/* ─── Modal wrapper ──────────────────────────────────────────── */
function Modal({ title, icon: Icon, iconColor, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl my-auto">
        <button onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full cursor-pointer transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-black text-slate-900">{title}</h3>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {children}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export function AdminDashboard({
  courses = [], setCourses,
  internships = [], setInternships,
  users = [], setUsers,
  transactions = [], setTransactions,
  faqs = [], setFaqs,
  companyInfo = {}
, refreshData}) {
  const { toasts, add, remove } = useToast();
  const [tab,     setTab]     = useState('overview');
  const [sem,     setSem]     = useState('All');
  const [busy,    setBusy]    = useState(false);
  const [db,      setDb]      = useState('online');
  const [confirm, setConfirm] = useState(null);

  /* modal states */
  const [showAddInt, setShowAddInt] = useState(false);
  const [showAddCrs, setShowAddCrs] = useState(false);
  const [showAddUsr, setShowAddUsr] = useState(false);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [editInt,    setEditInt]    = useState(null);
  const [editCrs,    setEditCrs]    = useState(null);
  const [editFaq,    setEditFaq]    = useState(null);

  /* add-internship form */
  const blankInt = { title: '', company: '', type: '', stipend: '', mode: '', duration: '', openings: '', badge: '', description: '', image: '', skills: '' };
  const [iForm, setIForm] = useState(blankInt);

  /* add-course form */
  const blankCrs = { title: '', category: '', price: '', originalPrice: '', description: '', image: '', duration: '', badge: '', level: '', rating: '', studentsCount: '', reviewsCount: '' };
  const [cForm, setCForm] = useState(blankCrs);

  /* add-user form */
  const blankUsr = { name: '', email: '', phone: '', password: '', role: 'student' };
  const [uForm, setUForm] = useState(blankUsr);

  /* add-faq form */
  const blankFaq = { question: '', answer: '', category: 'General' };
  const [fForm, setFForm] = useState(blankFaq);

  /* derived */
  const totalRevenue = transactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const adminCount   = users.filter(u => u.role === 'admin' || u.email === 'mananjayprasad7@gmail.com').length;
  const filteredInts = internships.filter(i => {
    if (sem === 'All')     return true;
    if (sem === '3rd Sem') return i.badge?.includes('3rd');
    if (sem === '5th Sem') return i.badge?.includes('5th');
    if (sem === '7th Sem') return i.badge?.includes('7th');
    return true;
  });

  /* ── Refresh ── */
  const refresh = async () => {
    setBusy(true);
    if (refreshData) await refreshData();
    add('Data synced with Supabase!', 'success');
    setBusy(false);
  };

  /* ── Handlers for Internships ── */
  const addInt = async (e) => {
    e.preventDefault();
    if (!iForm.title.trim()) { add('Title required', 'error'); return; }
    setBusy(true);
    const skills = iForm.skills ? iForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    const payload = { title: iForm.title.trim(), company: iForm.company, type: iForm.type, stipend: iForm.stipend, mode: iForm.mode, duration: iForm.duration, openings: Number(iForm.openings), badge: iForm.badge, description: iForm.description, image: iForm.image, skills, last_date: 'Enrollment Open' };
    try {
      const { error } = await supabase.from('internships').insert([payload]);
      if (error) throw error;
      setShowAddInt(false); setIForm(blankInt);
      if (refreshData) refreshData(); add('Internship published!', 'success');
    } catch (e) { add('Error: ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const saveInt = async () => {
    if (!editInt) return;
    setBusy(true);
    const skills = Array.isArray(editInt.skills) ? editInt.skills : (editInt.skills || '').split(',').map(s => s.trim()).filter(Boolean);
    const payload = { title: editInt.title, company: editInt.company, type: editInt.type, stipend: editInt.stipend, mode: editInt.mode, duration: editInt.duration, openings: Number(editInt.openings), badge: editInt.badge, description: editInt.description, image: editInt.image, skills, last_date: editInt.lastDateToApply || 'Enrollment Open' };
    try {
      const { error } = await supabase.from('internships').update(payload).eq('id', Number(editInt.id));
      if (error) throw error;
      setEditInt(null); if (refreshData) refreshData(); add('Internship updated!', 'success');
    } catch (e) { add('Update failed: ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const delInt = (id) => setConfirm({
    msg: 'Delete this internship program from Supabase?',
    onOk: async () => {
      setConfirm(null); setBusy(true);
      try {
        const { error } = await supabase.from('internships').delete().eq('id', Number(id));
        if (error) throw error;
        if (refreshData) refreshData(); add('Internship deleted!', 'success');
      } catch (e) { add('Delete failed: ' + e.message, 'error'); }
      finally { setBusy(false); }
    }
  });

  /* ── Handlers for Courses ── */
  const addCrs = async (e) => {
    e.preventDefault();
    if (!cForm.title.trim()) { add('Title required', 'error'); return; }
    setBusy(true);
    const payload = { title: cForm.title.trim(), category: cForm.category, price: Number(cForm.price), original_price: Number(cForm.originalPrice), description: cForm.description, image: cForm.image, badge: cForm.badge, level: cForm.level, duration: cForm.duration, rating: Number(cForm.rating), reviews_count: Number(cForm.reviewsCount), students_count: Number(cForm.studentsCount), highlights: [], syllabus: [] };
    try {
      const { error } = await supabase.from('courses').insert([payload]);
      if (error) throw error;
      setShowAddCrs(false); setCForm(blankCrs);
      if (refreshData) refreshData(); add('Course published!', 'success');
    } catch (e) { add('Error: ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const saveCrs = async () => {
    if (!editCrs) return;
    setBusy(true);
    const payload = { title: editCrs.title, category: editCrs.category, price: Number(editCrs.price), original_price: Number(editCrs.originalPrice || editCrs.original_price), description: editCrs.description, image: editCrs.image, badge: editCrs.badge, level: editCrs.level, duration: editCrs.duration, rating: Number(editCrs.rating), reviews_count: Number(editCrs.reviewsCount || editCrs.reviews_count), students_count: Number(editCrs.studentsCount || editCrs.students_count) };
    try {
      const { error } = await supabase.from('courses').update(payload).eq('id', Number(editCrs.id));
      if (error) throw error;
      setEditCrs(null); if (refreshData) refreshData(); add('Course updated!', 'success');
    } catch (e) { add('Update failed: ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const delCrs = (id) => setConfirm({
    msg: 'Delete this course permanently from Supabase?',
    onOk: async () => {
      setConfirm(null); setBusy(true);
      try {
        const { error } = await supabase.from('courses').delete().eq('id', Number(id));
        if (error) throw error;
        if (refreshData) refreshData(); add('Course deleted!', 'success');
      } catch (e) { add('Delete failed: ' + e.message, 'error'); }
      finally { setBusy(false); }
    }
  });

  /* ── Handlers for Users ── */
  const addUser = async (e) => {
    e.preventDefault();
    if (!uForm.email.trim() || !uForm.name.trim()) { add('Name & Email required', 'error'); return; }
    setBusy(true);
    try {
      const { error } = await supabase.from('profiles').insert([{
        name: uForm.name, email: uForm.email, phone: uForm.phone, password: uForm.password, role: uForm.role, joined_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }]);
      if (error) throw error;
      setShowAddUsr(false); setUForm(blankUsr);
      if (refreshData) refreshData(); add('User created successfully!', 'success');
    } catch (e) { add('Error: ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const delUsr = (id) => setConfirm({
    msg: 'Delete this user permanently from Supabase?',
    onOk: async () => {
      setConfirm(null); setBusy(true);
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', Number(id));
        if (error) throw error;
        if (refreshData) refreshData(); add('User deleted!', 'success');
      } catch (e) { add('Delete failed: ' + e.message, 'error'); }
      finally { setBusy(false); }
    }
  });

  /* ── Handlers for FAQs ── */
  const addFaq = async (e) => {
    e.preventDefault();
    if (!fForm.question.trim() || !fForm.answer.trim()) return;
    setBusy(true);
    try {
      const { error } = await supabase.from('faqs').insert([{
        question: fForm.question, answer: fForm.answer, category: fForm.category
      }]);
      if (error) throw error;
      setShowAddFaq(false); setFForm(blankFaq);
      if (refreshData) refreshData(); add('FAQ Added!', 'success');
    } catch (e) { add('Error: ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const saveFaq = async () => {
    if (!editFaq) return;
    setBusy(true);
    try {
      const { error } = await supabase.from('faqs').update({
        question: editFaq.question, answer: editFaq.answer, category: editFaq.category
      }).eq('id', Number(editFaq.id));
      if (error) throw error;
      setEditFaq(null); if (refreshData) refreshData(); add('FAQ Updated!', 'success');
    } catch (e) { add('Error: ' + e.message, 'error'); }
    finally { setBusy(false); }
  };

  const delFaq = (id) => setConfirm({
    msg: 'Delete this FAQ?',
    onOk: async () => {
      setConfirm(null); setBusy(true);
      try {
        const { error } = await supabase.from('faqs').delete().eq('id', Number(id));
        if (error) throw error;
        if (refreshData) refreshData(); add('FAQ Deleted!', 'success');
      } catch (e) { add('Error: ' + e.message, 'error'); }
      finally { setBusy(false); }
    }
  });

  const TABS = [
    { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
    { id: 'internships', label: 'Internships', icon: Briefcase       },
    { id: 'courses',     label: 'Courses',     icon: BookOpen        },
    { id: 'users',       label: 'Users',       icon: Users           },
    { id: 'revenue',     label: 'Revenue',     icon: IndianRupee     },
    { id: 'faqs',        label: 'FAQs',        icon: HelpCircle      },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        .fade-up { animation: fadeUp .22s ease forwards; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 4px; }
      `}</style>

      <Toast toasts={toasts} remove={remove} />
      {confirm && <Confirm msg={confirm.msg} onOk={confirm.onOk} onCancel={() => setConfirm(null)} />}

      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">

        {/* ══ HEADER ══════════════════════════════════════════════ */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 leading-none">DIBUZZ ADMIN</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase tracking-widest">Executive Console</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a href="https://supabase.com/dashboard/project/ztccsmsmjkzhtyfklkyl/editor" target="_blank" rel="noopener noreferrer" 
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[10px] font-bold text-emerald-700 transition-all cursor-pointer shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <Database className="w-3 h-3" />
                  Open Supabase DB
                </a>
                <button onClick={refresh} disabled={busy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold transition-all cursor-pointer shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sync Data</span>
                </button>
              </div>
            </div>

            {/* Tab row */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-b-2 ${
                    tab === t.id
                      ? 'text-violet-700 border-violet-600 bg-violet-50'
                      : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50'
                  }`}>
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ BODY ════════════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-up">

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <div className="space-y-8">
              <div className="relative bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-sm">
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-3">
                    <ShieldCheck className="w-3 h-3" /> Real-time DB Synced
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-slate-900">{companyInfo.name || 'DIBUZZ DIGITAL PRIVATE LIMITED'}</h1>
                  <p className="text-xs text-slate-500 mt-2 font-medium">MCA & MSME Recognized · UDYAM-BR-26-0242688</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Platform Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} sub={`${transactions.length} transactions`} icon={IndianRupee} color="emerald" loading={busy} />
                <StatCard label="Internships"      value={internships.length || 0}  sub="Active Programs"     icon={Briefcase}    color="violet" loading={busy} />
                <StatCard label="Courses"           value={courses.length}            sub="Active Tracks"           icon={BookOpen}     color="indigo" loading={busy} />
                <StatCard label="Users"             value={users.length}              sub={`Admins: ${adminCount}`} icon={Users}        color="amber"  loading={busy} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <button onClick={() => { setShowAddInt(true); setTab('internships'); }} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all flex flex-col gap-2 items-start cursor-pointer group">
                  <div className="p-2 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors"><Plus className="w-5 h-5"/></div>
                  <span className="font-bold text-slate-800">Add Internship</span>
                </button>
                <button onClick={() => { setShowAddCrs(true); setTab('courses'); }} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col gap-2 items-start cursor-pointer group">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Plus className="w-5 h-5"/></div>
                  <span className="font-bold text-slate-800">Add Course</span>
                </button>
                <button onClick={() => { setShowAddUsr(true); setTab('users'); }} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col gap-2 items-start cursor-pointer group">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors"><UserPlus className="w-5 h-5"/></div>
                  <span className="font-bold text-slate-800">Add User</span>
                </button>
                <button onClick={() => { setShowAddFaq(true); setTab('faqs'); }} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col gap-2 items-start cursor-pointer group">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Plus className="w-5 h-5"/></div>
                  <span className="font-bold text-slate-800">Add FAQ</span>
                </button>
              </div>
            </div>
          )}

          {/* ── INTERNSHIPS ── */}
          {tab === 'internships' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-4 h-4 text-slate-400" />
                  {['All', '3rd Sem', '5th Sem', '7th Sem'].map(f => (
                    <button key={f} onClick={() => setSem(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        sem === f ? 'bg-violet-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                      }`}>{f}</button>
                  ))}
                  <span className="text-xs text-slate-500 font-mono font-medium">{filteredInts.length} items</span>
                </div>
                <button onClick={() => setShowAddInt(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer shrink-0">
                  <Plus className="w-4 h-4" /> Add Internship
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredInts.map(item => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-violet-300 hover:shadow-lg transition-all group flex flex-col">
                    {item.image && (
                      <div className="h-32 w-full overflow-hidden bg-slate-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md border bg-violet-50 text-violet-700 border-violet-200">
                          {item.badge || '3rd Sem'}
                        </span>
                        <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg mb-2 border border-slate-100">
                          <span className="text-xs text-slate-500 font-semibold">Stipend/Fee:</span>
                          <span className="text-xs font-black text-emerald-600 font-mono">{item.stipend || 'Coming Soon'}</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug mb-2">{item.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{item.description}</p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {(Array.isArray(item.skills) ? item.skills : []).slice(0, 3).map((s, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono">{s}</span>
                        ))}
                      </div>
                      <div className="mt-3 text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.duration}
                      </div>
                    </div>
                    <div className="flex gap-2 p-3 bg-slate-50 border-t border-slate-100">
                      <button onClick={() => setEditInt({ ...item, skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || '') })}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-violet-50 hover:text-violet-700 text-slate-600 text-xs font-bold transition-all cursor-pointer">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => delInt(item.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 text-xs font-bold transition-all cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── COURSES ── */}
          {tab === 'courses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Courses</h2>
                <button onClick={() => setShowAddCrs(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer">
                  <Plus className="w-4 h-4" /> Add Course
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {courses.map(c => (
                  <div key={c.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all group flex flex-col">
                    {c.image && (
                      <div className="h-40 overflow-hidden bg-slate-100">
                        <img src={c.image} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between mb-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">{c.category}</span>
                        <span className="text-xs font-black text-emerald-600 font-mono">₹{Number(c.price).toLocaleString('en-IN')}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2">{c.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-3 mb-4">{c.description}</p>
                      
                    </div>
                    <div className="flex gap-2 p-3 bg-slate-50 border-t border-slate-100">
                      <button onClick={() => setEditCrs({ ...c, originalPrice: c.originalPrice || c.original_price })}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-xs font-bold transition-all cursor-pointer">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={() => delCrs(c.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 text-xs font-bold transition-all cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Users</h2>
                <button onClick={() => setShowAddUsr(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-all cursor-pointer">
                  <UserPlus className="w-4 h-4" /> Add User
                </button>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {['#', 'Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                          <th key={h} className="px-4 py-3 text-slate-500 font-bold uppercase text-[10px] tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-violet-600 font-bold text-[10px]">#{users.length - users.findIndex(x => x.id === u.id)}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">{u.name}</td>
                          <td className="px-4 py-3 text-slate-600 font-medium">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              u.role === 'admin' ? 'bg-violet-100 text-violet-700 border border-violet-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>{u.role || 'student'}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{u.joinedDate || u.joined_date || '—'}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => delUsr(u.id)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── FAQS ── */}
          {tab === 'faqs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900">Manage FAQs</h2>
                <button onClick={() => setShowAddFaq(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer">
                  <Plus className="w-4 h-4" /> Add FAQ
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faqs.map(faq => (
                  <div key={faq.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                     <div className="flex justify-between items-start gap-3">
                        <div>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 font-bold mb-2 inline-block">{faq.category}</span>
                          <h4 className="font-bold text-slate-900 text-sm mb-1">{faq.question}</h4>
                          <p className="text-xs text-slate-600">{faq.answer}</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                           <button onClick={() => setEditFaq(faq)} className="p-1.5 bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                           <button onClick={() => delFaq(faq.id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── REVENUE ── */}
          {tab === 'revenue' && (
            <div className="space-y-6">
               <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        {['Txn ID', 'Student', 'Course', 'Amount', 'Method', 'Date'].map(h => (
                          <th key={h} className="px-4 py-3 text-slate-500 font-bold uppercase text-[10px] tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-violet-600 text-[10px]">#{transactions.length - transactions.findIndex(x => x.id === t.id)}</td>
                          <td className="px-4 py-3 text-slate-900 font-bold">{t.userName || t.user_name}</td>
                          <td className="px-4 py-3 text-slate-700">{t.courseTitle || t.course_title}</td>
                          <td className="px-4 py-3 text-emerald-600 font-black font-mono">₹{Number(t.amount).toLocaleString('en-IN')}</td>
                          <td className="px-4 py-3 text-slate-600">{t.method}</td>
                          <td className="px-4 py-3 text-slate-500">{t.date || t.created_at || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════ MODALS ══════════════ */}

      {/* Add/Edit Internship */}
      {(showAddInt || editInt) && (
        <Modal title={editInt ? "Edit Internship" : "Add Internship"} icon={Briefcase} iconColor="bg-violet-50 text-violet-600 border-violet-200" onClose={() => { setShowAddInt(false); setEditInt(null); }}>
          <form onSubmit={editInt ? (e) => { e.preventDefault(); saveInt(); } : addInt} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Program Title *">
                <input required type="text" placeholder="e.g. Web Dev" value={editInt ? editInt.title : iForm.title} onChange={e => editInt ? setEditInt(p => ({...p, title: e.target.value})) : setIForm(p => ({ ...p, title: e.target.value }))} className={INP} />
              </Field>
              <Field label="Company">
    <input type="text" value={editInt ? editInt.company : iForm.company} onChange={e => editInt ? setEditInt(p => ({...p, company: e.target.value})) : setIForm(p => ({ ...p, company: e.target.value }))} className={INP} />
  </Field>
  <Field label="Mode">
    <input type="text" value={editInt ? editInt.mode : iForm.mode} onChange={e => editInt ? setEditInt(p => ({...p, mode: e.target.value})) : setIForm(p => ({ ...p, mode: e.target.value }))} className={INP} />
  </Field>
  <div>
                <label className={LBL}>Stipend / Fee</label>
                <input type="text" placeholder="e.g. Coming Soon or Free" value={editInt ? editInt.stipend : iForm.stipend} onChange={e => editInt ? setEditInt(p => ({...p, stipend: e.target.value})) : setIForm(p => ({ ...p, stipend: e.target.value }))} className={INP} />
              </div>
            </div>
            <Field label="Image URL">
              <div className="relative">
                 <ImageIcon className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                 <input type="text" placeholder="https://image-url..." value={editInt ? (editInt.image || '') : iForm.image} onChange={e => editInt ? setEditInt(p => ({...p, image: e.target.value})) : setIForm(p => ({...p, image: e.target.value}))} className={INP + " pl-9"} />
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
               <Field label="Type">
     <input type="text" placeholder="e.g. 3rd Semester Training" value={editInt ? editInt.type : iForm.type} onChange={e => editInt ? setEditInt(p => ({...p, type: e.target.value})) : setIForm(p => ({ ...p, type: e.target.value }))} className={INP} />
   </Field>
   <Field label="Openings">
     <input type="number" value={editInt ? editInt.openings : iForm.openings} onChange={e => editInt ? setEditInt(p => ({...p, openings: e.target.value})) : setIForm(p => ({ ...p, openings: e.target.value }))} className={INP} />
   </Field>
   <Field label="Duration">
                 <input type="text" value={editInt ? editInt.duration : iForm.duration} onChange={e => editInt ? setEditInt(p => ({...p, duration: e.target.value})) : setIForm(p => ({ ...p, duration: e.target.value }))} className={INP} />
               </Field>
               <Field label="Semester Badge">
                 <select value={editInt ? editInt.badge : iForm.badge} onChange={e => editInt ? setEditInt(p => ({...p, badge: e.target.value})) : setIForm(p => ({ ...p, badge: e.target.value }))} className={INP}>
                   <option>3rd Sem</option><option>5th Sem</option><option>7th Sem</option>
                 </select>
               </Field>
            </div>
            <Field label="Skills (comma separated)">
              <input type="text" placeholder="React, Node, Express" value={editInt ? (Array.isArray(editInt.skills) ? editInt.skills.join(', ') : editInt.skills) : iForm.skills} onChange={e => editInt ? setEditInt(p => ({...p, skills: e.target.value})) : setIForm(p => ({ ...p, skills: e.target.value }))} className={INP} />
            </Field>
            <Field label="Description">
              <textarea rows={3} placeholder="Program overview..." value={editInt ? editInt.description : iForm.description} onChange={e => editInt ? setEditInt(p => ({...p, description: e.target.value})) : setIForm(p => ({ ...p, description: e.target.value }))} className={INP + ' resize-none'} />
            </Field>
            <button type="submit" disabled={busy}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black text-sm transition-all cursor-pointer disabled:opacity-50 mt-2">
              {busy ? 'Saving...' : 'Save Internship'}
            </button>
          </form>
        </Modal>
      )}

      {/* Add/Edit Course */}
      {(showAddCrs || editCrs) && (
        <Modal title={editCrs ? "Edit Course" : "Add Course"} icon={BookOpen} iconColor="bg-indigo-50 text-indigo-600 border-indigo-200" onClose={() => { setShowAddCrs(false); setEditCrs(null); }}>
          <form onSubmit={editCrs ? (e) => { e.preventDefault(); saveCrs(); } : addCrs} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Course Title *">
                <input required type="text" value={editCrs ? editCrs.title : cForm.title} onChange={e => editCrs ? setEditCrs(p => ({...p, title: e.target.value})) : setCForm(p => ({ ...p, title: e.target.value }))} className={INP} />
              </Field>
              <Field label="Category">
                <input type="text" value={editCrs ? editCrs.category : cForm.category} onChange={e => editCrs ? setEditCrs(p => ({...p, category: e.target.value})) : setCForm(p => ({ ...p, category: e.target.value }))} className={INP} />
              </Field>
            </div>
            <Field label="Image URL">
              <input type="text" value={editCrs ? editCrs.image : cForm.image} onChange={e => editCrs ? setEditCrs(p => ({...p, image: e.target.value})) : setCForm(p => ({...p, image: e.target.value}))} className={INP} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Duration">
    <input type="text" placeholder="e.g. 12 Weeks" value={editCrs ? editCrs.duration : cForm.duration} onChange={e => editCrs ? setEditCrs(p => ({...p, duration: e.target.value})) : setCForm(p => ({ ...p, duration: e.target.value }))} className={INP} />
  </Field>
  <Field label="Badge">
    <input type="text" placeholder="e.g. New" value={editCrs ? editCrs.badge : cForm.badge} onChange={e => editCrs ? setEditCrs(p => ({...p, badge: e.target.value})) : setCForm(p => ({ ...p, badge: e.target.value }))} className={INP} />
  </Field>
  <Field label="Level">
    <input type="text" placeholder="e.g. All Levels" value={editCrs ? editCrs.level : cForm.level} onChange={e => editCrs ? setEditCrs(p => ({...p, level: e.target.value})) : setCForm(p => ({ ...p, level: e.target.value }))} className={INP} />
  </Field>
  <Field label="Price (₹)">
                <input type="number" value={editCrs ? editCrs.price : cForm.price} onChange={e => editCrs ? setEditCrs(p => ({...p, price: e.target.value})) : setCForm(p => ({ ...p, price: e.target.value }))} className={INP} />
              </Field>
              <Field label="Original Price (₹)">
    <input type="number" value={editCrs ? (editCrs.originalPrice || editCrs.original_price) : cForm.originalPrice} onChange={e => editCrs ? setEditCrs(p => ({...p, originalPrice: e.target.value})) : setCForm(p => ({ ...p, originalPrice: e.target.value }))} className={INP} />
  </Field>
  <Field label="Rating (0-5)">
    <input type="number" step="0.1" value={editCrs ? editCrs.rating : cForm.rating} onChange={e => editCrs ? setEditCrs(p => ({...p, rating: e.target.value})) : setCForm(p => ({ ...p, rating: e.target.value }))} className={INP} />
  </Field>
  <Field label="Students Count">
    <input type="number" value={editCrs ? (editCrs.studentsCount || editCrs.students_count) : cForm.studentsCount} onChange={e => editCrs ? setEditCrs(p => ({...p, studentsCount: e.target.value})) : setCForm(p => ({ ...p, studentsCount: e.target.value }))} className={INP} />
  </Field>
  <Field label="Reviews Count">
    <input type="number" value={editCrs ? (editCrs.reviewsCount || editCrs.reviews_count) : cForm.reviewsCount} onChange={e => editCrs ? setEditCrs(p => ({...p, reviewsCount: e.target.value})) : setCForm(p => ({ ...p, reviewsCount: e.target.value }))} className={INP} />
  </Field>
            </div>
            <Field label="Description">
              <textarea rows={3} value={editCrs ? editCrs.description : cForm.description} onChange={e => editCrs ? setEditCrs(p => ({...p, description: e.target.value})) : setCForm(p => ({ ...p, description: e.target.value }))} className={INP + ' resize-none'} />
            </Field>
            <button type="submit" disabled={busy} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all cursor-pointer disabled:opacity-50">
              {busy ? 'Saving...' : 'Save Course'}
            </button>
          </form>
        </Modal>
      )}

      {/* Add User */}
      {showAddUsr && (
        <Modal title="Add User" icon={UserPlus} iconColor="bg-amber-50 text-amber-600 border-amber-200" onClose={() => setShowAddUsr(false)}>
           <form onSubmit={addUser} className="space-y-4">
              <Field label="Full Name *">
                <input required type="text" value={uForm.name} onChange={e => setUForm(p => ({...p, name: e.target.value}))} className={INP} />
              </Field>
              <Field label="Email Address *">
                <input required type="email" value={uForm.email} onChange={e => setUForm(p => ({...p, email: e.target.value}))} className={INP} />
              </Field>
              <Field label="Phone">
                <input type="text" value={uForm.phone} onChange={e => setUForm(p => ({...p, phone: e.target.value}))} className={INP} />
              </Field>
              <Field label="Password (Optional)">
                <input type="text" placeholder="Leave empty for generic student" value={uForm.password} onChange={e => setUForm(p => ({...p, password: e.target.value}))} className={INP} />
              </Field>
              <Field label="Role">
                <select value={uForm.role} onChange={e => setUForm(p => ({...p, role: e.target.value}))} className={INP}>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
              <button type="submit" disabled={busy} className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm transition-all cursor-pointer disabled:opacity-50">
                Create User
              </button>
           </form>
        </Modal>
      )}

      {/* Add/Edit FAQ */}
      {(showAddFaq || editFaq) && (
        <Modal title={editFaq ? "Edit FAQ" : "Add FAQ"} icon={HelpCircle} iconColor="bg-emerald-50 text-emerald-600 border-emerald-200" onClose={() => { setShowAddFaq(false); setEditFaq(null); }}>
          <form onSubmit={editFaq ? (e) => { e.preventDefault(); saveFaq(); } : addFaq} className="space-y-4">
            <Field label="Question *">
              <input required type="text" value={editFaq ? editFaq.question : fForm.question} onChange={e => editFaq ? setEditFaq(p => ({...p, question: e.target.value})) : setFForm(p => ({...p, question: e.target.value}))} className={INP} />
            </Field>
            <Field label="Answer *">
              <textarea required rows={4} value={editFaq ? editFaq.answer : fForm.answer} onChange={e => editFaq ? setEditFaq(p => ({...p, answer: e.target.value})) : setFForm(p => ({...p, answer: e.target.value}))} className={INP + ' resize-none'} />
            </Field>
            <Field label="Category">
              <input type="text" value={editFaq ? editFaq.category : fForm.category} onChange={e => editFaq ? setEditFaq(p => ({...p, category: e.target.value})) : setFForm(p => ({...p, category: e.target.value}))} className={INP} />
            </Field>
            <button type="submit" disabled={busy} className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all cursor-pointer disabled:opacity-50">
              {busy ? 'Saving...' : 'Save FAQ'}
            </button>
          </form>
        </Modal>
      )}

    </>
  );
}
