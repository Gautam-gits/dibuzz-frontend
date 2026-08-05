import React, { useState } from 'react';
import { Briefcase, Filter, Clock, ArrowRight, X, Building2, User, Mail, ShieldCheck, CheckCircle2, MapPin } from 'lucide-react';

export function InternshipSection({ companyInfo, internships = [], currentUser, onOpenAuthModal, onEnrollCourse }) {
  const [filterSem, setFilterSem] = useState('3rd Sem');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(null);

  // Form State
  const [applicantName,  setApplicantName]  = useState(currentUser?.name  || '');
  const [applicantEmail, setApplicantEmail] = useState(currentUser?.email || '');
  const [applicantPhone, setApplicantPhone] = useState(currentUser?.phone || '');
  const [collegeName,    setCollegeName]    = useState('');
  const [degree,         setDegree]        = useState('B.Tech / BE');

  // Gradient map for each internship topic
  const topicImages = {
    'Python Programming':        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80',
    'Web Development':           'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    'Artificial Intelligence':   'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
    'Machine Learning':          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    'Internet of Things':        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    'AutoCAD':                   'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    'SolidWorks':                'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    'MATLAB':                    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
  };

  const getImage = (title) => {
    const key = Object.keys(topicImages).find(k => title?.includes(k.split(' ')[0]));
    return key ? topicImages[key] : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
  };

  const getGradient = (title) => {
    if (title?.toLowerCase().includes('python')) return 'from-amber-400 to-orange-500';
    if (title?.toLowerCase().includes('web')) return 'from-blue-400 to-indigo-600';
    if (title?.toLowerCase().includes('ai') || title?.toLowerCase().includes('artificial')) return 'from-emerald-400 to-teal-600';
    if (title?.toLowerCase().includes('machine')) return 'from-purple-400 to-pink-600';
    return 'from-slate-400 to-slate-600';
  };

  const getIcon = (title) => {
    if (title?.toLowerCase().includes('python')) return '🐍';
    if (title?.toLowerCase().includes('web')) return '💻';
    if (title?.toLowerCase().includes('ai') || title?.toLowerCase().includes('artificial')) return '🤖';
    if (title?.toLowerCase().includes('machine')) return '🧠';
    return '🎓';
  };

  // Filter logic using Supabase data
  const filteredPrograms = internships.filter(item => {
    if (filterSem === 'All') return true;
    return item.badge?.includes(filterSem.replace(' Sem', ''));
  });

  // For 3rd sem — use Supabase internships; fallback to empty array
  const thirdSemPrograms = internships.filter(i => i.badge?.includes('3rd') || (!i.badge && filterSem === '3rd Sem'));
  const fifthSemPrograms = internships.filter(i => i.badge?.includes('5th'));
  const seventhSemPrograms = internships.filter(i => i.badge?.includes('7th'));

  const displayPrograms = filterSem === '3rd Sem' ? thirdSemPrograms
    : filterSem === '5th Sem' ? fifthSemPrograms
    : filterSem === '7th Sem' ? seventhSemPrograms
    : internships;

  const handleEnrollClick = (item) => {
    if (onEnrollCourse) {
      onEnrollCourse(item);
    }
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) return;
    const appId = `DIBUZZ-INT-${Math.floor(100000 + Math.random() * 900000)}`;
    setApplicationSubmitted({
      appId,
      internshipTitle: selectedInternship.title,
      name: applicantName,
      email: applicantEmail,
      date: new Date().toLocaleDateString('en-IN')
    });
  };

  const SEM_TABS = [
    { label: '3rd Semester', value: '3rd Sem' },
    { label: '5th Semester', value: '5th Sem' },
    { label: '7th Semester', value: '7th Sem' },
    { label: 'All',          value: 'All'     },
  ];



  return (
    <section className="py-12 sm:py-16 bg-slate-50 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest mb-3 sm:mb-4 shadow-2xs font-mono">
            <Briefcase className="w-3 h-3" /> Online Training Programs
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Semester Training & Internship Programs
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            MCA & MSME Recognized · {companyInfo.name || 'DIBUZZ DIGITAL PRIVATE LIMITED'}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-10 scrollbar-none flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {SEM_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilterSem(tab.value)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                filterSem === tab.value
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {tab.label}
              {filterSem === tab.value && tab.value !== 'All' && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-md bg-white/20 text-[9px] font-mono">
                  {displayPrograms.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {displayPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayPrograms.map(item => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-sky-400 hover:shadow-lg hover:shadow-sky-100 transition-all duration-200"
              >
                {/* Topic-based Image */}
                <div>
                  <div className="relative h-40 w-full overflow-hidden">
                    <img 
                      src={item.image || getImage(item.title)} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 text-white backdrop-blur-xs font-mono">
                        {item.badge || '3rd Sem'}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-black text-white font-mono bg-emerald-600 px-2.5 py-0.5 rounded-md shadow-xs">
                        {item.stipend || 'Coming Soon'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors font-heading leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-sky-600" />
                      {item.company || companyInfo.name || 'DIBUZZ DIGITAL PRIVATE LIMITED'}
                    </p>

                    {/* Metrics */}
                    <div className="my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Fee / Stipend:</span>
                        <span className="font-extrabold text-emerald-700 font-mono">{item.stipend || 'Coming Soon'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 text-[11px]">Duration:</span>
                        <span className="text-slate-900 font-semibold text-[11px] flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-slate-400" /> {item.duration || '4-6 Weeks'}
                        </span>
                      </div>
                      {item.openings > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[11px]">Openings:</span>
                          <span className="text-sky-700 font-bold text-[11px]">{item.openings} seats</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3 font-normal">
                      {item.description}
                    </p>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(Array.isArray(item.skills) ? item.skills : []).map((skill, idx) => (
                        <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Certificate
                  </span>
                  <button
                    onClick={() => handleEnrollClick(item)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{item.stipend && item.stipend.includes('Free') ? 'Enroll Now' : 'Coming Soon'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Coming Soon Card */
          <div className="max-w-xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto border border-sky-200">
                <Briefcase className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
                  {filterSem}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2 font-heading">Coming Soon</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                  {filterSem === 'All' 
                    ? "New internship programs will be launching shortly. Stay tuned." 
                    : `Admissions for ${filterSem} internship programs will be launching shortly. Stay tuned.`}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

    </section>
  );
}
