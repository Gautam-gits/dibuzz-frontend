import React, { useState } from 'react';
import { BookOpen, ShieldCheck, CreditCard, Award, LayoutDashboard, Compass, LogOut, ChevronRight, User, Settings, PlayCircle } from 'lucide-react';
import { CourseExplorer } from './CourseExplorer';
import { InternshipSection } from './InternshipSection';

export function StudentDashboard({ currentUser, courses, internships, userTransactions, verifiedCertificates, setActiveTab, companyInfo, onSelectCourse, onEnrollCourse, userEnrolledIds, onOpenAuthModal }) {
  const [dashboardTab, setDashboardTab] = useState('overview');
  
  if (!currentUser) return null;

  const enrolledCourseObjects = courses.filter(c => currentUser.enrolledCourses?.includes(c.id));
  const activeCourseCount = enrolledCourseObjects.length;
  const completedCount = currentUser.certificates?.length || 0;

  // Sidebar Component
  const SidebarItem = ({ icon: Icon, label, tabId }) => (
    <button
      onClick={() => setDashboardTab(tabId)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${dashboardTab === tabId ? 'bg-sky-600 text-white shadow-md font-bold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'}`}
    >
      <Icon className={`w-5 h-5 ${dashboardTab === tabId ? 'text-white' : 'text-slate-400'}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)] bg-slate-50 w-full" style={{ marginTop: '-2rem', marginBottom: '-2rem', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}>
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0 md:sticky md:top-[80px] md:h-[calc(100vh-80px)] overflow-y-auto">
        
        {/* User Profile Summary */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
          <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-black text-lg shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-slate-900 truncate">{currentUser.name}</h3>
            <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-2">Main Menu</div>
        <SidebarItem icon={LayoutDashboard} label="Overview" tabId="overview" />
        <SidebarItem icon={BookOpen} label="My Learning" tabId="learning" />
        <SidebarItem icon={Award} label="Certificates" tabId="certificates" />
        <SidebarItem icon={CreditCard} label="Payments" tabId="payments" />

        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-6">Discover</div>
        <SidebarItem icon={Compass} label="Explore Courses" tabId="explore_courses" />
        <SidebarItem icon={ShieldCheck} label="Explore Internships" tabId="explore_internships" />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        
        {/* OVERVIEW TAB */}
        {dashboardTab === 'overview' && (
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 font-heading">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
              <p className="text-slate-500 mt-1 font-medium">Ready to continue your learning journey today?</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">{activeCourseCount}</p>
                  <p className="text-sm text-slate-500 font-semibold">Active Courses</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">{completedCount}</p>
                  <p className="text-sm text-slate-500 font-semibold">Completed</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900">0</p>
                  <p className="text-sm text-slate-500 font-semibold">Active Internships</p>
                </div>
              </div>
            </div>

            {/* Resume Learning Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-sky-600" /> Resume Learning
              </h2>
              {enrolledCourseObjects.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 justify-between">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                      <img src={enrolledCourseObjects[0].image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} alt="Course" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-lg">{enrolledCourseObjects[0].title}</h3>
                      <p className="text-sm text-slate-500">Next: Module 2 - Advanced Concepts</p>
                      <div className="mt-3 bg-slate-100 rounded-full h-2 w-full max-w-md overflow-hidden">
                        <div className="bg-sky-500 w-1/4 h-full rounded-full"></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-semibold">25% Completed</p>
                    </div>
                  </div>
                  <button onClick={() => alert('Redirecting to Course Content Platform...')} className="w-full md:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer">
                    Continue Lesson
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Compass className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Courses</h3>
                  <p className="text-slate-500 text-sm max-w-sm mb-6">You haven't enrolled in any courses yet. Start your journey by exploring our catalog.</p>
                  <button onClick={() => setDashboardTab('explore_courses')} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer">
                    Explore Courses
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MY LEARNING TAB */}
        {dashboardTab === 'learning' && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-6">My Learning</h2>
            {enrolledCourseObjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourseObjects.map(course => (
                  <div key={course.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                    <div className="relative h-40 overflow-hidden bg-slate-100">
                      <img src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-sky-700 shadow-sm">
                        Enrolled
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-sky-700 transition-colors">{course.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">{course.description}</p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-xs font-bold mb-2">
                          <span className="text-sky-600">Progress</span>
                          <span className="text-slate-600">0%</span>
                        </div>
                        <div className="bg-slate-100 rounded-full h-1.5 w-full overflow-hidden mb-4">
                          <div className="bg-sky-500 w-0 h-full rounded-full"></div>
                        </div>
                        <button onClick={() => alert('Redirecting to Course Content Platform...')} className="w-full py-2.5 bg-slate-100 hover:bg-sky-50 text-sky-700 font-bold rounded-xl transition-colors cursor-pointer border border-transparent hover:border-sky-200">
                          Start Course
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-slate-400" />
                  </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Enrolled Courses</h3>
                <p className="text-slate-500 text-sm max-w-sm mb-6">You are not enrolled in any courses right now.</p>
                <button onClick={() => setDashboardTab('explore_courses')} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer">
                  Browse Catalog
                </button>
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {dashboardTab === 'certificates' && (
          <div className="max-w-5xl mx-auto">
             <h2 className="text-2xl font-black text-slate-900 mb-6">My Certificates</h2>
             {currentUser.certificates && currentUser.certificates.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {/* Map certificates here */}
               </div>
             ) : (
               <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Award className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No Certificates Yet</h3>
                  <p className="text-slate-500 text-sm max-w-sm">Complete a course or internship program to earn your ISO certified certificate.</p>
                </div>
             )}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {dashboardTab === 'payments' && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Payment History</h2>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {userTransactions && userTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm min-w-[600px]">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs border-b border-slate-200">
                    <tr>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Item</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Method</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {userTransactions.map(txn => (
                      <tr key={txn.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono text-slate-600">{txn.id}</td>
                        <td className="p-4 font-semibold text-slate-900">{txn.courseTitle}</td>
                        <td className="p-4 text-slate-500">{txn.date}</td>
                        <td className="p-4 text-slate-500">{txn.method}</td>
                        <td className="p-4 text-right font-bold text-slate-900">₹{txn.amount}</td>
                        <td className="p-4 text-center">
                           <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold whitespace-nowrap">
                             {txn.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              ) : (
                <div className="p-10 text-center text-slate-500">No payment history found.</div>
              )}
            </div>
          </div>
        )}

        {/* EXPLORE COURSES TAB */}
        {dashboardTab === 'explore_courses' && (
          <div className="max-w-7xl mx-auto">
             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-0 sm:p-4">
               <CourseExplorer
                  courses={courses}
                  onSelectCourse={onSelectCourse}
                  onEnrollCourse={onEnrollCourse}
                  userEnrolledIds={userEnrolledIds}
                />
             </div>
          </div>
        )}

        {/* EXPLORE INTERNSHIPS TAB */}
        {dashboardTab === 'explore_internships' && (
          <div className="max-w-7xl mx-auto">
             <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-0 sm:p-4">
               <InternshipSection
                  companyInfo={companyInfo}
                  internships={internships}
                  currentUser={currentUser}
                  onOpenAuthModal={onOpenAuthModal}
                  onEnrollCourse={onEnrollCourse}
                />
             </div>
          </div>
        )}

      </main>
    </div>
  );
}
