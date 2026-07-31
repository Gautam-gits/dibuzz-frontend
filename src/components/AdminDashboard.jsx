import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, Users, CreditCard, Plus, Trash2, DollarSign, Sparkles, Save, Edit3, Briefcase } from 'lucide-react';

export function AdminDashboard({ 
  courses, 
  setCourses, 
  onAddCourse,
  onDeleteCourse,
  onUpdateCourse,
  internships = [],
  setInternships,
  onAddInternship,
  onDeleteInternship,
  onUpdateInternship,
  users, 
  setUsers, 
  transactions, 
  companyInfo, 
  setCompanyInfo,
  verifiedCertificates,
  setVerifiedCertificates
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('courses');

  // Add Course Modal State
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Full-Stack');
  const [newPrice, setNewPrice] = useState(12999);
  const [newOrigPrice, setNewOrigPrice] = useState(19999);
  const [newDuration, setNewDuration] = useState('12 Weeks');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80');

  // Edit Course Modal State
  const [editingCourse, setEditingCourse] = useState(null);

  // Add Internship Modal State
  const [showAddInternshipModal, setShowAddInternshipModal] = useState(false);
  const [intTitle, setIntTitle] = useState('');
  const [intCompany, setIntCompany] = useState('Dibuzz Tech Labs');
  const [intType, setIntType] = useState('Paid Stipend');
  const [intStipend, setIntStipend] = useState('₹ 15,000 / month');
  const [intMode, setIntMode] = useState('Remote / WFH');
  const [intDuration, setIntDuration] = useState('12 Weeks');
  const [intOpenings, setIntOpenings] = useState(8);
  const [intSkills, setIntSkills] = useState('React, Node.js, Tailwind');
  const [intDesc, setIntDesc] = useState('');
  const [intLastDate, setIntLastDate] = useState('Aug 30, 2026');

  // Edit Internship Modal State
  const [editingInternship, setEditingInternship] = useState(null);

  const [announcementText, setAnnouncementText] = useState(companyInfo.announcement);

  const totalRevenue = transactions.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Course Actions
  const handleAddCourseSubmit = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const newCourseObj = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      badge: 'New',
      level: 'All Levels',
      duration: newDuration,
      rating: 5.0,
      reviewsCount: 1,
      studentsCount: 0,
      originalPrice: Number(newOrigPrice),
      price: Number(newPrice),
      image: newImage,
      description: newDescription || 'Comprehensive training program with ISO verified certificate.',
      highlights: ['Live Mentor Cohort', 'ISO Certified', 'Capstone Projects'],
      syllabus: [{ week: 'Week 1-4', topic: 'Fundamentals' }]
    };

    if (onAddCourse) onAddCourse(newCourseObj);
    else setCourses([newCourseObj, ...courses]);
    
    setShowAddCourseModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleDeleteCourseAction = (courseId) => {
    if (confirm('Delete this course from the main page and Supabase Cloud DB?')) {
      if (onDeleteCourse) onDeleteCourse(courseId);
      setCourses(prev => prev.filter(c => Number(c.id) !== Number(courseId)));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingCourse) return;
    if (onUpdateCourse) onUpdateCourse(editingCourse);
    else setCourses(prev => prev.map(c => Number(c.id) === Number(editingCourse.id) ? editingCourse : c));
    setEditingCourse(null);
  };

  // Internship Actions
  const handleAddInternshipSubmit = (e) => {
    e.preventDefault();
    if (!intTitle) return;

    const newIntObj = {
      id: Date.now(),
      title: intTitle,
      company: intCompany,
      type: intType,
      stipend: intStipend,
      mode: intMode,
      duration: intDuration,
      openings: Number(intOpenings),
      badge: intType === 'Paid Stipend' ? 'Hot Choice' : 'Academic Credit',
      skills: intSkills.split(',').map(s => s.trim()),
      description: intDesc || 'Gain practical real-world industry experience under senior leads.',
      lastDateToApply: intLastDate
    };

    if (onAddInternship) onAddInternship(newIntObj);
    else setInternships([newIntObj, ...internships]);

    setShowAddInternshipModal(false);
    setIntTitle('');
    setIntDesc('');
  };

  const handleDeleteInternshipAction = (intId) => {
    if (confirm('Delete this internship from main website and Supabase Cloud DB?')) {
      if (onDeleteInternship) onDeleteInternship(intId);
      setInternships(prev => prev.filter(i => Number(i.id) !== Number(intId)));
    }
  };

  const handleEditInternshipSubmit = (e) => {
    e.preventDefault();
    if (!editingInternship) return;
    if (onUpdateInternship) onUpdateInternship(editingInternship);
    else setInternships(prev => prev.map(i => Number(i.id) === Number(editingInternship.id) ? editingInternship : i));
    setEditingInternship(null);
  };

  const handleSaveAnnouncement = () => {
    setCompanyInfo({
      ...companyInfo,
      announcement: announcementText
    });
    alert('Main page announcement banner updated!');
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-purple-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">
              <LayoutDashboard className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 font-heading">DIBUZZ Master Admin Panel</h1>
                <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-bold">
                  ADMIN ACCESS
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Manage main page programs, live internships, registered user data, and real-time transaction logs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs transition-all cursor-pointer flex items-center gap-2 text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>

            <button
              onClick={() => setShowAddInternshipModal(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all cursor-pointer flex items-center gap-2 text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Internship</span>
            </button>
          </div>
        </div>

        {/* Counter Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Platform Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-2">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-700 mt-1 font-bold">Verified Payments</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Active Internships</span>
              <Briefcase className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-2">
              {internships.length}
            </div>
            <div className="text-[10px] text-emerald-700 mt-1 font-bold">Paid & Free Roles</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Active Programs</span>
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-2">
              {courses.length}
            </div>
            <div className="text-[10px] text-purple-700 mt-1 font-bold">Live Courses</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Registered Users</span>
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono mt-2">
              {users.length}
            </div>
            <div className="text-[10px] text-sky-700 mt-1 font-bold">Students & Admins</div>
          </div>
        </div>

        {/* Sub Nav */}
        <div className="flex border-b border-slate-200 mb-8 gap-6 font-bold text-sm text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('courses')}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer border-b-2 ${activeAdminTab === 'courses' ? 'border-purple-600 text-purple-700 font-extrabold' : 'border-transparent hover:text-slate-900'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('internships')}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer border-b-2 ${activeAdminTab === 'internships' ? 'border-emerald-600 text-emerald-700 font-extrabold' : 'border-transparent hover:text-slate-900'}`}
          >
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Manage Internships ({internships.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer border-b-2 ${activeAdminTab === 'users' ? 'border-purple-600 text-purple-700 font-extrabold' : 'border-transparent hover:text-slate-900'}`}
          >
            <Users className="w-4 h-4" />
            <span>Registered Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('transactions')}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer border-b-2 ${activeAdminTab === 'transactions' ? 'border-purple-600 text-purple-700 font-extrabold' : 'border-transparent hover:text-slate-900'}`}
          >
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>Payment Log ({transactions.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer border-b-2 ${activeAdminTab === 'settings' ? 'border-purple-600 text-purple-700 font-extrabold' : 'border-transparent hover:text-slate-900'}`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Banner Text Settings</span>
          </button>
        </div>

        {/* COURSES TAB */}
        {activeAdminTab === 'courses' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-bold text-slate-900 font-heading">Live Programs on Main Page</h3>
              <button
                onClick={() => setShowAddCourseModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
                      <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-sky-600 text-white text-[10px] font-bold">
                        {course.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base line-clamp-2 font-heading">{course.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 font-normal">{course.description}</p>
                    
                    <div className="mt-3 flex items-baseline gap-2 font-mono">
                      <span className="text-lg font-bold text-slate-900">₹{course.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-slate-400 line-through">₹{course.originalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                    <button
                      onClick={() => setEditingCourse({ ...course })}
                      className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteCourseAction(course.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERNSHIPS TAB */}
        {activeAdminTab === 'internships' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-bold text-slate-900 font-heading">Manage Live Internships (Paid & Free Academic Credit)</h3>
              <button
                onClick={() => setShowAddInternshipModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Internship</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${item.type === 'Paid Stipend' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">{item.openings} Openings</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base line-clamp-2 font-heading">{item.title}</h4>
                    <p className="text-xs text-emerald-700 font-bold mt-1 font-mono">{item.stipend}</p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 font-normal">{item.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                    <button
                      onClick={() => setEditingInternship({ ...item })}
                      className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteInternshipAction(item.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeAdminTab === 'users' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 font-heading">
              Registered Users & Student Accounts Data
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 min-w-[650px]">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-4">User ID</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4">Enrolled Courses</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-4 font-mono font-bold text-slate-400">#{u.id}</td>
                      <td className="p-4 font-bold text-slate-900">{u.name}</td>
                      <td className="p-4 text-slate-600">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-sky-100 text-sky-800 border border-sky-200'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{u.joinedDate || '2026'}</td>
                      <td className="p-4 font-mono font-bold text-emerald-700">{u.enrolledCourses ? u.enrolledCourses.length : 0} Courses</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeAdminTab === 'transactions' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 font-heading flex flex-wrap justify-between items-center gap-2">
              <span>Real-Time Payment Log</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-sky-700 font-bold">Total Revenue: ₹{totalRevenue.toLocaleString('en-IN')}</span>
                {transactions.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset revenue and clear all payment logs to ₹0?')) {
                        if (setTransactions) setTransactions([]);
                        localStorage.removeItem('dibuzz_txns');
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    Reset Revenue to ₹0
                  </button>
                )}
              </div>
            </div>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 min-w-[650px]">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">TXN ID</th>
                      <th className="p-4">Student</th>
                      <th className="p-4">Course Program</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="p-4 font-mono font-bold text-sky-700">{t.id}</td>
                        <td className="p-4 font-bold text-slate-900">{t.userName} <br/><span className="text-[10px] text-slate-500 font-normal">{t.userEmail}</span></td>
                        <td className="p-4 text-slate-800">{t.courseTitle}</td>
                        <td className="p-4 font-mono text-slate-900 font-bold">₹{t.amount?.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-slate-500">{t.method}</td>
                        <td className="p-4 text-slate-500">{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center text-slate-500 space-y-2">
                <div className="text-2xl font-black text-slate-900 font-heading">Total Revenue: ₹0</div>
                <p className="text-xs text-slate-600 font-medium">No active transactions logged. Initial revenue starts at ₹0 until students enroll in paid programs.</p>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeAdminTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-2xl space-y-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 font-heading">Main Page Announcement Banner</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Top Banner Strip Text</label>
              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full p-3 rounded-xl edumantra-input text-xs"
              />
            </div>
            <button
              onClick={handleSaveAnnouncement}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Announcement</span>
            </button>
          </div>
        )}

      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 my-8 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-heading">Add New Course</h3>
              <button onClick={() => setShowAddCourseModal(false)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master React 19 & Next.js 15 Sprint"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 edumantra-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Automation">Automation</option>
                    <option value="Design">Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Computer Applications">Computer Applications</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discounted Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newOrigPrice}
                    onChange={(e) => setNewOrigPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-3.5 py-2.5 edumantra-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Course summary..."
                  className="w-full px-3.5 py-2.5 edumantra-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-xs cursor-pointer"
                >
                  Publish to Main Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 my-8 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-heading">Edit Course Details</h3>
              <button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 edumantra-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingCourse.category}
                    onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Automation">Automation</option>
                    <option value="Design">Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Computer Applications">Computer Applications</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingCourse.price}
                    onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingCourse.originalPrice}
                    onChange={(e) => setEditingCourse({ ...editingCourse, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={editingCourse.image}
                  onChange={(e) => setEditingCourse({ ...editingCourse, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 edumantra-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 edumantra-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update & Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Internship Modal */}
      {showAddInternshipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 my-8 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-heading">Add New Internship Role</h3>
              <button onClick={() => setShowAddInternshipModal(false)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>

            <form onSubmit={handleAddInternshipSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internship Title</label>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Web Development Intern"
                  value={intTitle}
                  onChange={(e) => setIntTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 edumantra-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Internship Type</label>
                  <select
                    value={intType}
                    onChange={(e) => setIntType(e.target.value)}
                    className="w-full px-3.5 py-2.5 edumantra-input font-bold"
                  >
                    <option value="Paid Stipend">💚 Paid Stipend</option>
                    <option value="Free Academic">🎓 Free Academic Credit / Skill-India</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stipend Amount / Benefit</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹ 15,000 / month or Free (Govt Cert)"
                    value={intStipend}
                    onChange={(e) => setIntStipend(e.target.value)}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location Mode</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / WFH"
                    value={intMode}
                    onChange={(e) => setIntMode(e.target.value)}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Weeks"
                    value={intDuration}
                    onChange={(e) => setIntDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Number of Openings</label>
                  <input
                    type="number"
                    value={intOpenings}
                    onChange={(e) => setIntOpenings(e.target.value)}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={intSkills}
                    onChange={(e) => setIntSkills(e.target.value)}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Description</label>
                <textarea
                  rows={3}
                  value={intDesc}
                  onChange={(e) => setIntDesc(e.target.value)}
                  placeholder="Internship responsibilities & requirements..."
                  className="w-full px-3.5 py-2.5 edumantra-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddInternshipModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs cursor-pointer"
                >
                  Publish Internship Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Internship Modal */}
      {editingInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 my-8 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-heading">Edit Internship Details</h3>
              <button onClick={() => setEditingInternship(null)} className="text-slate-400 hover:text-slate-900">✕</button>
            </div>

            <form onSubmit={handleEditInternshipSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Internship Title</label>
                <input
                  type="text"
                  value={editingInternship.title}
                  onChange={(e) => setEditingInternship({ ...editingInternship, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 edumantra-input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Internship Type</label>
                  <select
                    value={editingInternship.type}
                    onChange={(e) => setEditingInternship({ ...editingInternship, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 edumantra-input font-bold"
                  >
                    <option value="Paid Stipend">💚 Paid Stipend</option>
                    <option value="Free Academic">🎓 Free Academic Credit / Skill-India</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stipend Amount / Benefit</label>
                  <input
                    type="text"
                    value={editingInternship.stipend}
                    onChange={(e) => setEditingInternship({ ...editingInternship, stipend: e.target.value })}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location Mode</label>
                  <input
                    type="text"
                    value={editingInternship.mode}
                    onChange={(e) => setEditingInternship({ ...editingInternship, mode: e.target.value })}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingInternship.duration}
                    onChange={(e) => setEditingInternship({ ...editingInternship, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 edumantra-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingInternship.description}
                  onChange={(e) => setEditingInternship({ ...editingInternship, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 edumantra-input"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingInternship(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Internship</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
