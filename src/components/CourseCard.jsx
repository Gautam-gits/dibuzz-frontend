import React from 'react';
import { Star, Clock, Users, ArrowRight, ShieldCheck, Check } from 'lucide-react';

export function CourseCard({ course, onSelectCourse, onEnrollCourse, isEnrolled }) {
  const discountPercent = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);

  return (
    <div className="edumantra-card flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100 border-b border-slate-100">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-600 text-white shadow-xs">
            {course.category}
          </span>
          {course.badge && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 shadow-xs">
              {course.badge}
            </span>
          )}
        </div>

        {/* Discount Badge */}
        <div className="absolute bottom-2.5 right-2.5 bg-red-600 text-white font-black text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-xs">
          {discountPercent}% OFF
        </div>
      </div>

      {/* Course Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 font-semibold">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              {course.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              {course.studentsCount.toLocaleString()} Enrolled
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug font-heading">
            {course.title}
          </h3>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-normal font-normal">
            {course.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-3 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-500" />
              <span className="font-bold ml-1 text-slate-900">{course.rating}</span>
            </div>
            <span className="text-slate-500 font-semibold text-[11px]">({course.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Price & Action - Wrap friendly */}
        <div className="mt-4 pt-3 sm:pt-4 border-t border-slate-100">
          <div className="flex flex-wrap items-baseline justify-between gap-1 mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
              <span className="text-base sm:text-xl font-black text-slate-900 font-mono">Coming Soon</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-emerald-700 font-extrabold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> ISO Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectCourse(course)}
              className="px-2.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer text-center"
            >
              Syllabus
            </button>

            {isEnrolled ? (
              <button
                disabled
                className="px-2.5 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 flex items-center justify-center gap-1 cursor-default text-center"
              >
                <Check className="w-3.5 h-3.5" />
                Enrolled
              </button>
            ) : (
              <button
                onClick={() => onEnrollCourse(course)}
                className="px-2.5 py-2 rounded-xl text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1 text-center"
              >
                <span>Coming Soon</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
