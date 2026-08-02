import React, { useState } from 'react';
import { Filter, Search, BookOpen, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export function CourseExplorer({ searchQuery, setSearchQuery, courses = [], onSelectCourse, onEnrollCourse, userEnrolledIds = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Web Development', 'Data Science & AI', 'Computer Fundamentals'];

  const comingSoonCourses = [
    {
      id: 1,
      isDummy: true,
      title: "Full Stack MERN & Microservices Sprint",
      category: "Web Development",
      duration: "12 Weeks Cohort",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
      description: "Master React 19, Node.js, Express, MongoDB, and production REST API microservices with hands-on capstone projects.",
      skills: ["React 19", "Node.js", "MongoDB", "REST APIs"]
    },
    {
      id: 2,
      isDummy: true,
      title: "Data Science, Python & AI Engineering",
      category: "Data Science & AI",
      duration: "16 Weeks Cohort",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
      description: "Learn Data Analytics, Machine Learning algorithms, Python automation, and LLM artificial intelligence integrations.",
      skills: ["Python 3", "Pandas", "Scikit-Learn", "AI Models"]
    },
    {
      id: 3,
      isDummy: true,
      title: "Diploma in Computer Applications (DCA)",
      category: "Computer Fundamentals",
      duration: "6 Months Program",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
      description: "Comprehensive DCA course covering Computer Fundamentals, Tally Prime, MS Office, and Internet applications.",
      skills: ["Tally Prime", "MS Office", "Computer Ops", "DCA Cert"]
    }
  ];

  const sourceCourses = courses && courses.length > 0 ? courses : comingSoonCourses;

  const filtered = sourceCourses.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <section className="py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-extrabold uppercase tracking-wider mb-2 font-mono">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Future Training Tracks</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
              Explore Upcoming Live Programs
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
              Industry-oriented technical courses launching in the upcoming cohort batch.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search upcoming tracks..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 sm:mb-8 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Clean Coming Soon Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-slate-900/80 text-white backdrop-blur-xs font-mono">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-mono shadow-xs">
                      {course.isDummy ? 'Coming Soon' : (course.badge || 'New')}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-semibold font-mono">
                    <Clock className="w-3.5 h-3.5 text-sky-600" />
                    <span>{course.duration}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors font-heading leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {(course.skills || course.highlights || []).slice(0, 4).map((s, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Certificate Included
                </span>
                {course.isDummy ? (
                  <button
                    onClick={() => alert(`Admissions for ${course.title} will open in the next cohort batch. Stay tuned!`)}
                    className="px-4 py-2 rounded-xl text-xs font-black text-white bg-slate-900 hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                  >
                    Coming Soon
                  </button>
                ) : (
                  <button
                    onClick={() => onEnrollCourse ? onEnrollCourse(course) : null}
                    className="px-4 py-2 rounded-xl text-xs font-black text-white bg-sky-600 hover:bg-sky-700 shadow-2xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    Enroll ₹{course.price || 444} <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
