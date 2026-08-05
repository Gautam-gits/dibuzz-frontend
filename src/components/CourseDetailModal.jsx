import React from 'react';
import { X, CheckCircle2, Clock, Users, Star, Award, BookOpen, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export function CourseDetailModal({ course, onClose, onEnroll, isEnrolled }) {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-slate-600 hover:text-slate-900 shadow-sm transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Header */}
        <div className="relative h-56 overflow-hidden bg-slate-100">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-extrabold uppercase tracking-wider bg-sky-600 text-white">
                {course.category}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-amber-400 text-slate-950 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> ISO Accredited
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-heading">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto text-slate-800">
          
          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
            <div>
              <div className="text-xs text-slate-500 font-semibold">Duration</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <Clock className="w-4 h-4 text-sky-600" /> {course.duration}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">Skill Level</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{course.level}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">Learners</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                <Users className="w-4 h-4 text-sky-600" /> {course.studentsCount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-semibold">Rating</div>
              <div className="text-sm font-bold text-amber-600 mt-0.5 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> {course.rating} / 5.0
              </div>
            </div>
          </div>

          {/* Overview */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2 font-heading">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span>Program Overview</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {course.description}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2 font-heading">
              <Sparkles className="w-5 h-5 text-sky-600" />
              <span>Key Program Highlights</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.highlights.map((item, index) => (
                <div key={index} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-800 font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 font-heading">Week-by-Week Curriculum</h3>
            <div className="space-y-2.5">
              {course.syllabus.map((module, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 whitespace-nowrap">
                    {module.week}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 font-semibold pt-0.5">
                    {module.topic}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Seal */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-center gap-4">
            <ShieldCheck className="w-9 h-9 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="text-sm font-bold text-slate-900">ISO 9001:2015 Verified Certificate</div>
              <div className="text-xs text-slate-600 mt-0.5">
                Issued by DIBUZZ DIGITAL PRIVATE LIMITED with verifiable CIN seal.
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Course Fee</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono">Coming Soon</span>
            </div>
          </div>

          {isEnrolled ? (
            <button
              disabled
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-50 text-emerald-600 font-extrabold flex items-center justify-center gap-2 border border-emerald-200"
            >
              <CheckCircle2 className="w-5 h-5" /> Already Enrolled
            </button>
          ) : (
            <button
              onClick={() => {
                onEnroll(course);
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20"
            >
              <span>Coming Soon</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
