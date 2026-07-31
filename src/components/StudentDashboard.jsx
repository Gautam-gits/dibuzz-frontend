import React, { useState } from 'react';
import { BookOpen, ShieldCheck, CreditCard, PlayCircle, Award, Clock, Printer } from 'lucide-react';
import { Logo } from './Logo';

export function StudentDashboard({ currentUser, courses, userTransactions, verifiedCertificates, setActiveTab }) {
  const [activeTab, setDashboardTab] = useState('courses');
  const [selectedLesson, setSelectedLesson] = useState(null);

  if (!currentUser) return null;

  const enrolledCourseObjects = courses.filter(c => currentUser.enrolledCourses?.includes(c.id));

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-sky-600 flex items-center justify-center font-black text-white text-2xl shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 font-heading">{currentUser.name}</h1>
                <span className="px-2.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold capitalize">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{currentUser.email} | Joined {currentUser.joinedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('courses')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Enroll New Course</span>
            </button>
          </div>
        </div>

        {/* Sub Nav */}
        <div className="flex border-b border-slate-200 mb-8 gap-8 font-bold text-sm text-slate-600">
          <button
            onClick={() => setDashboardTab('courses')}
            className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer border-b-2 ${activeTab === 'courses' ? 'border-sky-600 text-sky-600 font-extrabold' : 'border-transparent hover:text-slate-900'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Enrolled Courses ({enrolledCourseObjects.length})</span>
          </button>

          <button
            onClick={() => setDashboardTab('certificates')}
            className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer border-b-2 ${activeTab === 'certificates' ? 'border-sky-600 text-sky-600 font-extrabold' : 'border-transparent hover:text-slate-900'}`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>My ISO Certificates ({currentUser.certificates?.length || 0})</span>
          </button>

          <button
            onClick={() => setDashboardTab('payments')}
            className={`pb-3 flex items-center gap-2 transition-colors cursor-pointer border-b-2 ${activeTab === 'payments' ? 'border-sky-600 text-sky-600 font-extrabold' : 'border-transparent hover:text-slate-900'}`}
          >
            <CreditCard className="w-4 h-4 text-purple-600" />
            <span>Payment Tax Receipts</span>
          </button>
        </div>

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div>
            {enrolledCourseObjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourseObjects.map((course) => {
                  const progress = course.id === 1 ? 65 : course.id === 3 ? 35 : 10;
                  return (
                    <div key={course.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                            {course.category}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-sky-600" /> {course.duration}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mb-2 font-heading">{course.title}</h3>
                        
                        <div className="mt-4 mb-4">
                          <div className="flex justify-between text-xs text-slate-600 mb-1 font-semibold">
                            <span>Course Completion</span>
                            <span className="font-bold text-sky-700">{progress}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-sky-600 rounded-full" style={{ width: `${progress}%` }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedLesson(course)}
                          className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                          <PlayCircle className="w-4 h-4 text-white" />
                          <span>Continue Learning</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('verify')}
                          className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-bold"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Certificate Registry
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 font-heading">No Courses Enrolled Yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                  Browse our industry programs and enroll to start learning.
                </p>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 shadow-xs"
                >
                  Explore All Programs
                </button>
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === 'certificates' && (
          <div>
            {currentUser.certificates && currentUser.certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentUser.certificates.map((certId) => {
                  const cert = verifiedCertificates[certId];
                  return (
                    <div key={certId} className="bg-white p-6 rounded-2xl border border-emerald-300 shadow-xs">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <Logo variant="icon" size="small" />
                        <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ISO VERIFIED
                        </span>
                      </div>

                      <div className="my-4 space-y-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">CERTIFICATE ID: {certId}</p>
                        <h4 className="text-base font-bold text-slate-900 font-heading">{cert?.courseTitle || "Full Stack Web Development Sprint"}</h4>
                        <p className="text-xs text-slate-600">Issued to: <strong className="text-slate-900">{currentUser.name}</strong></p>
                        <p className="text-xs text-slate-500">Date: {cert?.completionDate || "May 14, 2026"} | Grade: {cert?.grade || "Grade A+"}</p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <button
                          onClick={() => setActiveTab('verify')}
                          className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>View Official Certificate</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 font-heading">No Certificates Issued Yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto font-medium">
                  Complete 100% of your course modules to unlock your ISO 9001:2015 verified certificate.
                </p>
              </div>
            )}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 font-heading">
              Tax Receipts & Invoices
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 min-w-[600px]">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Course Program</th>
                    <th className="p-4">Amount Paid</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-sky-700">{txn.id}</td>
                      <td className="p-4 font-bold text-slate-900">{txn.courseTitle}</td>
                      <td className="p-4 font-mono text-slate-900 font-bold">₹{txn.amount.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-slate-500">{txn.method}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          {txn.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => window.print()}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-sky-600" />
                          <span>Tax Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Lesson Player */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base font-heading">{selectedLesson.title} - Module 1</h3>
              <button onClick={() => setSelectedLesson(null)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>
            
            <div className="relative aspect-video rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
              <PlayCircle className="w-16 h-16 text-sky-400 animate-pulse mb-3" />
              <h4 className="text-lg font-bold">Lesson 1.1: Environment & Architecture Setup</h4>
              <p className="text-xs text-slate-300 max-w-md mt-1">
                Live Interactive Stream by Senior Lead | DIBUZZ DIGITAL PRIVATE LIMITED
              </p>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setSelectedLesson(null)} className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white">
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
