import React, { useState } from 'react';
import { Briefcase, Sparkles, Filter, Clock, MapPin, Award, CheckCircle2, ShieldCheck, ArrowRight, X, Building2, User, Mail, Phone } from 'lucide-react';

export function InternshipSection({ companyInfo, internships = [] }) {
  const [filterType, setFilterType] = useState('All');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicationSubmitted, setApplicationSubmitted] = useState(null);

  // Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [degree, setDegree] = useState('B.Tech / BE');

  const filteredInternships = (internships || []).filter(item => {
    if (filterType === 'All') return true;
    if (filterType === 'Paid Stipend') return item.type === 'Paid Stipend';
    if (filterType === 'Free Academic') return item.type === 'Free Academic';
    if (filterType === 'Remote') return item.mode?.includes('Remote');
    return true;
  });

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      alert('Please fill out all required fields.');
      return;
    }

    const appId = `APP-${Math.floor(100000 + Math.random() * 900000)}`;
    setApplicationSubmitted({
      appId,
      internshipTitle: selectedInternship.title,
      name: applicantName,
      email: applicantEmail,
      date: new Date().toLocaleDateString()
    });
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-3 shadow-xs">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Government Recognized & Corporate Internships</span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading">
            Live Corporate & Govt. Internships
          </h1>
          <p className="text-slate-600 text-xs sm:text-base mt-2.5 font-medium">
            Gain hands-on real-world experience. Choose between <strong className="text-emerald-700">Paid Stipend Roles (Up to ₹20,000/mo)</strong> and <strong className="text-sky-700">Free Academic Credit Internships</strong>.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-10 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 mr-1" />
          {[
            { label: 'All Internships', value: 'All' },
            { label: '💚 Paid Stipend Roles', value: 'Paid Stipend' },
            { label: '🎓 Free Academic Credit', value: 'Free Academic' },
            { label: '🏠 Remote / Work From Home', value: 'Remote' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterType(tab.value)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                filterType === tab.value
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Internship Cards Grid */}
        {filteredInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((item) => (
              <div
                key={item.id}
                className="edumantra-card bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Type Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-xs ${
                    item.type === 'Paid Stipend'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-sky-50 text-sky-800 border-sky-200'
                  }`}>
                    {item.type === 'Paid Stipend' ? '💚 Paid Stipend' : '🎓 Free Academic Credit'}
                  </span>

                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                    {item.openings} Openings
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-sky-600 transition-colors font-heading leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-600" />
                    {item.company}
                  </p>

                  {/* Key Metrics */}
                  <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-semibold">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Stipend / Benefit:</span>
                      <span className={`font-bold ${item.type === 'Paid Stipend' ? 'text-emerald-700 font-mono text-sm' : 'text-sky-700 text-xs'}`}>
                        {item.stipend}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Duration:</span>
                      <span className="text-slate-900 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.duration}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Location Mode:</span>
                      <span className="text-slate-900 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.mode}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4 font-normal">
                    {item.description}
                  </p>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(item.skills || []).map((skill, idx) => (
                      <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold text-slate-400">Apply by {item.lastDateToApply || item.last_date || '2026'}</span>
                  <button
                    onClick={() => { setSelectedInternship(item); setApplicationSubmitted(null); }}
                    className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Cohesive Corporate Coming Soon Cards for Internships */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-black uppercase tracking-wider">
                  ⚡ Paid Stipend Openings
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">Frontend & React Dev Internship</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Work on production UI components, state management, and API integrations with senior tech leads.
                </p>
                <div className="flex flex-wrap gap-1 pt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">React.js</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Tailwind</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">JavaScript</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-sky-700 font-mono">Up to ₹20,000/mo</span>
                <button
                  onClick={() => alert('Frontend Internship openings launching shortly! Admin will publish roles live.')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-sky-600 hover:bg-sky-700 shadow-2xs cursor-pointer transition-all"
                >
                  Apply Soon
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-black uppercase tracking-wider">
                  🎓 Academic Credit Internship
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">Python & AI Data Analyst Role</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Academic project credit internship for B.Tech, BCA, MCA and Diploma computer engineering students.
                </p>
                <div className="flex flex-wrap gap-1 pt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Python</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Data Analytics</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">SQL</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-sky-700 font-mono">Verified Certificate</span>
                <button
                  onClick={() => alert('Python AI internship batch starting soon! Contact admissions to reserve a seat.')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-sky-600 hover:bg-sky-700 shadow-2xs cursor-pointer transition-all"
                >
                  Apply Soon
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-sky-300 transition-all">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-black uppercase tracking-wider">
                  ⚡ Remote / WFH Batch
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-heading">Digital Marketing & Growth Sprint</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Hands-on SEO, Performance Marketing, Meta Ads, and content branding campaigns.
                </p>
                <div className="flex flex-wrap gap-1 pt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">SEO</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Meta Ads</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">Google Ads</span>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-sky-700 font-mono">Flexible Duration</span>
                <button
                  onClick={() => alert('Digital Marketing internship cohort opening soon! Stay tuned.')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 shadow-2xs cursor-pointer transition-all"
                >
                  Apply Soon
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Application Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 p-6 sm:p-8">
            <button
              onClick={() => setSelectedInternship(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {applicationSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-heading">Application Submitted!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Your application for <strong className="text-slate-900">{applicationSubmitted.internshipTitle}</strong> has been registered.
                </p>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs font-mono space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Application ID:</span>
                    <span className="font-bold text-sky-700">{applicationSubmitted.appId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applicant:</span>
                    <span className="text-slate-900 font-bold">{applicationSubmitted.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-emerald-700 font-bold">UNDER REVIEW</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-xs cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                <div className="pb-3 border-b border-slate-200">
                  <span className="px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 font-extrabold text-[10px] uppercase">
                    {selectedInternship.type}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1 font-heading">
                    {selectedInternship.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedInternship.company} ({selectedInternship.stipend})</p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Mananjay Prasad"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 edumantra-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      placeholder="mananjayprasad7@gmail.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 edumantra-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 edumantra-input"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Degree / Course</label>
                    <select
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full px-3.5 py-2.5 edumantra-input"
                    >
                      <option value="B.Tech / BE">B.Tech / BE</option>
                      <option value="BCA / MCA">BCA / MCA</option>
                      <option value="Diploma in Engg">Diploma in Engg</option>
                      <option value="B.Sc / M.Sc CS">B.Sc / M.Sc CS</option>
                      <option value="Other">Other Degree</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">College / University Name</label>
                  <input
                    type="text"
                    placeholder="e.g. AKTU / Delhi University / IPU"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <span>Submit Internship Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
