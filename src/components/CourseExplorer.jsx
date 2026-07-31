import React, { useState } from 'react';
import { CourseCard } from './CourseCard';
import { Sparkles, Filter, Search } from 'lucide-react';

export function CourseExplorer({ courses, onSelectCourse, onEnrollCourse, userEnrolledIds, searchQuery, setSearchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Full-Stack', 'Data & AI', 'Automation', 'Design', 'Digital Marketing', 'Computer Applications'];

  const filteredCourses = (courses || []).filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-12 sm:py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-600 text-xs font-black uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Career Bootcamps & Training</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
              Explore ISO Certified Programs
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl font-medium">
              Industry-aligned technical programs built with live project sprints and placement assistance.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm edumantra-input"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 sm:mb-8 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={onSelectCourse}
                onEnrollCourse={onEnrollCourse}
                isEnrolled={userEnrolledIds.includes(course.id)}
              />
            ))}
          </div>
        ) : (
          /* Cohesive Corporate Coming Soon Cards (Matches Logo Theme) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-3 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] font-black uppercase tracking-wider">
                  🚀 Coming Soon / New Cohort
                </span>
                <h3 className="text-lg font-black font-heading text-white">Full Stack MERN & Microservices Sprint</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Master React, Node.js, Express, MongoDB, and REST APIs with live production capstone projects.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-sky-300 font-semibold">React 19</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-sky-300 font-semibold">Node.js</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-sky-300 font-semibold">MongoDB</span>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-300 font-mono">12 Weeks Live</span>
                <button
                  onClick={() => alert('New cohort admissions opening shortly! Stay tuned or call our admissions office.')}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-sky-600 hover:bg-sky-500 text-white shadow-md cursor-pointer transition-all"
                >
                  Notify Me
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-3 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] font-black uppercase tracking-wider">
                  ⚡ Launching Next Batch
                </span>
                <h3 className="text-lg font-black font-heading text-white">Data Science, Python & AI Engineering</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Learn Data Analytics, Machine Learning algorithms, Python automation, and LLM API integrations.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-sky-300 font-semibold">Python</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-sky-300 font-semibold">Pandas</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-sky-300 font-semibold">AI Models</span>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-300 font-mono">16 Weeks Live</span>
                <button
                  onClick={() => alert('AI & Data Science batch launching shortly! Contact admissions for early registration.')}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-sky-600 hover:bg-sky-500 text-white shadow-md cursor-pointer transition-all"
                >
                  Notify Me
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden group">
              <div className="space-y-3 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[10px] font-black uppercase tracking-wider">
                  ✨ Admissions Opening
                </span>
                <h3 className="text-lg font-black font-heading text-white">Diploma in Computer Applications (DCA)</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  ISO certified Govt-aligned DCA course covering Computer Fundamentals, Tally Prime, MS Office & Internet.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-sky-300 font-semibold">Tally Prime</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-sky-300 font-semibold">MS Office</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-sky-300 font-semibold">DCA Cert</span>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between">
                <span className="text-[11px] font-bold text-sky-300 font-mono">6 Months Govt Cert</span>
                <button
                  onClick={() => alert('DCA Computer Course enrollment starting soon! Admissions counselors are available.')}
                  className="px-4 py-2 rounded-xl text-xs font-black bg-sky-600 hover:bg-sky-500 text-white shadow-md cursor-pointer transition-all"
                >
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
