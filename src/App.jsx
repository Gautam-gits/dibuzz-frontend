import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CourseExplorer } from './components/CourseExplorer';
import { CourseDetailModal } from './components/CourseDetailModal';
import { CertificateVerifier } from './components/CertificateVerifier';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { InternshipSection } from './components/InternshipSection';
import { HomeSections } from './components/HomeSections';
import { LandingPage } from './components/LandingPage';

import { supabase, SUPABASE_SQL_SETUP } from './lib/supabase';
import {
  INITIAL_COMPANY_INFO,
  INITIAL_COURSES,
  INITIAL_VERIFIED_CERTIFICATES,
  INITIAL_USERS,
  INITIAL_TRANSACTIONS,
  INITIAL_INTERNSHIPS,
  TESTIMONIALS
} from './data/mockData';

export default function App() {
  const [companyInfo, setCompanyInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('dibuzz_company');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cin === "U73100BR2025PTC080924" && parsed.phone === "+91 9128458850") {
          return parsed;
        }
      }
      return INITIAL_COMPANY_INFO;
    } catch (e) {
      return INITIAL_COMPANY_INFO;
    }
  });

  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('dibuzz_courses');
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch (e) {
      return INITIAL_COURSES;
    }
  });

  const [internships, setInternships] = useState(() => {
    try {
      localStorage.removeItem('dibuzz_internships');
      const saved = localStorage.getItem('dibuzz_internships');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_INTERNSHIPS;
    } catch (e) {
      return INITIAL_INTERNSHIPS;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      localStorage.removeItem('dibuzz_users');
      return INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  });

  const [verifiedCertificates, setVerifiedCertificates] = useState(() => {
    try {
      const saved = localStorage.getItem('dibuzz_certs');
      return saved ? JSON.parse(saved) : INITIAL_VERIFIED_CERTIFICATES;
    } catch (e) {
      return INITIAL_VERIFIED_CERTIFICATES;
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      localStorage.removeItem('dibuzz_txns');
      return [];
    } catch (e) {
      return [];
    }
  });

  const [faqs, setFaqs] = useState(() => {
    try {
      const saved = localStorage.getItem('dibuzz_faqs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dibuzz_current_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[0];
    } catch (e) {
      return INITIAL_USERS[0];
    }
  });

  const [dbStatus, setDbStatus] = useState('CONNECTING'); // 'CONNECTED' | 'FALLBACK'

  // UI state
  const [activeTab, setActiveTab] = useState('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [detailCourse, setDetailCourse] = useState(null);
  const [paymentCourse, setPaymentCourse] = useState(null);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [showSqlModal, setShowSqlModal] = useState(false);

  // History & Navigation State Management (Fixes Browser & Mobile Back Button)
  const handleTabChange = (tabName) => {
    if (activeTab !== tabName) {
      window.history.pushState({ tab: tabName }, '', `#${tabName}`);
      setActiveTab(tabName);
    }
  };

  const handleSelectCourse = (course) => {
    if (course) {
      window.history.pushState({ tab: activeTab, modal: 'course', courseId: course.id }, '', `#course-${course.id}`);
    }
    setDetailCourse(course);
  };

  const handleOpenAuthModal = (mode = 'login') => {
    window.history.pushState({ tab: activeTab, modal: 'auth', mode }, '', `#auth-${mode}`);
    setAuthModal({ isOpen: true, mode });
  };

  const handleOpenPaymentModal = (course) => {
    if (course) {
      window.history.pushState({ tab: activeTab, modal: 'payment', courseId: course.id }, '', `#payment-${course.id}`);
    }
    setPaymentCourse(course);
  };

  const handleToggleMobileMenu = (isOpen) => {
    if (isOpen) {
      window.history.pushState({ tab: activeTab, modal: 'drawer' }, '', `#drawer`);
    }
    setMobileMenuOpen(isOpen);
  };

  // Sync browser & mobile hardware back button (popstate event listener)
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ tab: 'landing' }, '', '#landing');
    }

    const handlePopState = (e) => {
      // Priority 1: Close top active modal if open
      if (authModal.isOpen) {
        setAuthModal({ isOpen: false, mode: 'login' });
        return;
      }
      if (paymentCourse) {
        setPaymentCourse(null);
        return;
      }
      if (detailCourse) {
        setDetailCourse(null);
        return;
      }
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        return;
      }

      // Priority 2: Restore tab state from history
      if (e.state && e.state.tab) {
        setActiveTab(e.state.tab);
      } else {
        setActiveTab('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [authModal.isOpen, paymentCourse, detailCourse, mobileMenuOpen]);

  const fetchData = async () => {
    try {
      const { data: dbCourses } = await supabase.from('courses').select('*').order('id', { ascending: false });
      if (dbCourses) {
        setCourses(dbCourses.map(c => ({
          ...c,
          originalPrice: Number(c.original_price || c.originalPrice),
          price: Number(c.price),
          studentsCount: Number(c.students_count || c.studentsCount || 100),
          reviewsCount: Number(c.reviews_count || c.reviewsCount || 50),
          highlights: typeof c.highlights === 'string' ? JSON.parse(c.highlights) : (c.highlights || []),
          syllabus: typeof c.syllabus === 'string' ? JSON.parse(c.syllabus) : (c.syllabus || [])
        })));
      }

      const { data: dbInts } = await supabase.from('internships').select('*').order('id', { ascending: false });
      if (dbInts) setInternships(dbInts.map(i => ({
        id: i.id,
        title: i.title,
        company: i.company,
        type: i.type,
        stipend: i.stipend,
        mode: i.mode,
        duration: i.duration,
        openings: Number(i.openings || 5),
        badge: i.badge,
        skills: typeof i.skills === 'string' ? JSON.parse(i.skills) : (i.skills || []),
        description: i.description,
        image: i.image,
        lastDateToApply: i.last_date || i.lastDateToApply || '2026'
      })));

      const { data: dbProfiles } = await supabase.from('profiles').select('*').order('id', { ascending: false });
      if (dbProfiles) setUsers(dbProfiles.map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        password: p.password,
        role: p.role || 'student',
        joinedDate: p.joined_date || p.joinedDate || 'Jan 01, 2025',
        enrolledCourses: p.enrolled_courses || [],
        certificates: p.certificates || [],
        profileImage: p.profile_image || p.profileImage || null
      })));
      
      const { data: dbFaqs } = await supabase.from('faqs').select('*').order('id', { ascending: false });
      if (dbFaqs) setFaqs(dbFaqs);

      setDbStatus('CONNECTED');
    } catch (err) {
      console.warn('Supabase fetch error:', err);
      setDbStatus('FALLBACK');
    }
  };

  // 1. Fetch live data from Supabase Cloud DB on load
  useEffect(() => {
    fetchData();

    // Setup Realtime Subscriptions
    const channel = supabase.channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'internships' }, () => fetchData())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => fetchData())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchData())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, () => fetchData())
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
  }, []);

  // Save to localStorage as backup
  useEffect(() => {
    localStorage.setItem('dibuzz_company', JSON.stringify(companyInfo));
  }, [companyInfo]);

  useEffect(() => {
    localStorage.setItem('dibuzz_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('dibuzz_internships', JSON.stringify(internships));
  }, [internships]);

  useEffect(() => {
    localStorage.setItem('dibuzz_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('dibuzz_certs', JSON.stringify(verifiedCertificates));
  }, [verifiedCertificates]);

  useEffect(() => {
    localStorage.setItem('dibuzz_txns', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('dibuzz_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('dibuzz_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Auth Handlers
  const handleLogin = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      // 1. Try DB first
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .eq('password', cleanPass);
        
      if (!error && data && data.length > 0) {
        const found = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          phone: data[0].phone,
          password: data[0].password,
          role: data[0].role || 'student',
          joinedDate: data[0].joined_date,
          collegeRegNo: data[0].college_reg_no,
          collegeName: data[0].college_name,
          course: data[0].course,
          branch: data[0].branch,
          profileImage: data[0].profile_image,
          enrolledCourses: data[0].enrolled_courses || [],
          certificates: data[0].certificates || []
        };
        
        setCurrentUser(found);
        setAuthModal({ isOpen: false, mode: 'login' });
        setActiveTab(found.role === 'admin' ? 'admin' : 'dashboard');
        
        // Ensure user is in local users state if not admin
        if (!users.find(u => u.email === found.email)) {
          setUsers(prev => [found, ...prev]);
        }
        return true;
      }
    } catch (err) {
      console.error('Supabase login check failed:', err);
    }

    // 2. Check users in current state (fallback)
    let found = users.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
    );

    // 3. Fallback check in INITIAL_USERS list
    if (!found) {
      found = INITIAL_USERS.find(
        u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
      );
      if (found) {
        setUsers(prev => [found, ...prev.filter(x => x.email.toLowerCase() !== cleanEmail)]);
      }
    }

    if (found) {
      setCurrentUser(found);
      setAuthModal({ isOpen: false, mode: 'login' });
      if (found.role === 'admin') {
        setActiveTab('home');
      } else {
        setActiveTab('dashboard');
      }
      return true;
    }
    return false;
  };

  const handleRegister = async (userData) => {
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role: 'student',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      collegeRegNo: userData.collegeRegNo,
      collegeName: userData.collegeName,
      course: userData.course,
      branch: userData.branch,
      profileImage: userData.profileImage,
      enrolledCourses: [],
      certificates: []
    };

    setUsers([newUser, ...users]);
    setCurrentUser(newUser);
    setAuthModal({ isOpen: false, mode: 'login' });
    setActiveTab('dashboard');

    try {
      await supabase.from('profiles').insert([{
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        phone: newUser.phone,
        role: 'student',
        joined_date: newUser.joinedDate,
        college_reg_no: newUser.collegeRegNo,
        college_name: newUser.collegeName,
        course: newUser.course,
        branch: newUser.branch,
        profile_image: newUser.profileImage,
        enrolled_courses: [],
        certificates: []
      }]);
    } catch (err) {
      console.log('Supabase sync insert profile err:', err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Payment Enrollment Handler
  const handleEnrollTrigger = (course) => {
    if (!currentUser) {
      setAuthModal({ isOpen: true, mode: 'login' });
      return;
    }
    setPaymentCourse(course);
  };

  const handlePaymentSuccess = async (courseId, receiptData) => {
    const updatedUser = {
      ...currentUser,
      enrolledCourses: Array.from(new Set([...(currentUser.enrolledCourses || []), courseId]))
    };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));

    setCourses(courses.map(c => c.id === courseId ? { ...c, studentsCount: c.studentsCount + 1 } : c));

    const newTxn = {
      id: receiptData.txnId,
      userName: receiptData.studentName,
      userEmail: receiptData.studentEmail,
      courseTitle: receiptData.courseTitle,
      amount: receiptData.amount,
      method: receiptData.method,
      status: 'SUCCESS',
      date: receiptData.date
    };
    setTransactions([newTxn, ...transactions]);

    try {
      await supabase.from('transactions').insert([{
        id: newTxn.id,
        user_name: newTxn.userName,
        user_email: newTxn.userEmail,
        course_title: newTxn.courseTitle,
        amount: newTxn.amount,
        method: newTxn.method,
        status: 'SUCCESS'
      }]);

      await supabase.from('profiles').update({
        enrolled_courses: updatedUser.enrolledCourses
      }).eq('email', updatedUser.email);

    } catch (err) {
      console.log('Supabase txn sync err:', err);
    }
  };

  // Admin Course Handlers
  const handleAddCourse = async (newCourseObj) => {
    try {
      const payload = {
        title: newCourseObj.title,
        category: newCourseObj.category,
        badge: newCourseObj.badge || 'New',
        level: newCourseObj.level || 'All Levels',
        duration: newCourseObj.duration || '12 Weeks',
        rating: Number(newCourseObj.rating || 5.0),
        reviews_count: Number(newCourseObj.reviewsCount || 1),
        students_count: Number(newCourseObj.studentsCount || 0),
        original_price: Number(newCourseObj.originalPrice || 19999),
        price: Number(newCourseObj.price || 12999),
        image: newCourseObj.image,
        description: newCourseObj.description,
        highlights: newCourseObj.highlights || [],
        syllabus: newCourseObj.syllabus || []
      };

      const { data: inserted, error } = await supabase
        .from('courses')
        .insert([payload])
        .select();

      if (error) {
        console.error('Supabase Add Course Error:', error);
        alert(`⚠️ Supabase Cloud DB Notice: ${error.message}`);
      } else if (inserted && inserted.length > 0) {
        const added = { ...newCourseObj, id: inserted[0].id };
        setCourses([added, ...courses]);
        alert('✅ Course Published & Saved Live to Supabase Cloud DB!');
        return;
      }
    } catch (err) {
      console.error('Supabase add course catch:', err);
    }

    setCourses([newCourseObj, ...courses]);
  };

  const handleDeleteCourse = async (courseId) => {
    setCourses(prev => prev.filter(c => Number(c.id) !== Number(courseId)));

    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', Number(courseId));

      if (error) {
        console.error('Supabase Delete Course Error:', error);
        alert(`⚠️ Supabase Delete Notice: ${error.message}`);
      } else {
        alert('🗑️ Course Deleted from Website & Supabase Cloud DB!');
      }
    } catch (err) {
      console.error('Supabase delete course catch:', err);
    }
  };

  const handleUpdateCourse = async (updatedCourseObj) => {
    setCourses(prev => prev.map(c => Number(c.id) === Number(updatedCourseObj.id) ? { ...c, ...updatedCourseObj } : c));

    try {
      const payload = {
        title: updatedCourseObj.title,
        category: updatedCourseObj.category,
        badge: updatedCourseObj.badge || 'New',
        level: updatedCourseObj.level || 'All Levels',
        duration: updatedCourseObj.duration || '12 Weeks',
        price: Number(updatedCourseObj.price),
        original_price: Number(updatedCourseObj.originalPrice),
        image: updatedCourseObj.image,
        description: updatedCourseObj.description
      };

      const { error } = await supabase
        .from('courses')
        .update(payload)
        .eq('id', Number(updatedCourseObj.id));

      if (error) {
        console.error('Supabase Update Course Error:', error);
        alert(`⚠️ Supabase Update Notice: ${error.message}`);
      } else {
        alert('✏️ Course Details Updated Live on Website & Supabase Cloud DB!');
      }
    } catch (err) {
      console.error('Supabase update course catch:', err);
    }
  };

  // Admin Internship Handlers
  const handleAddInternship = async (newIntObj) => {
    setInternships(prev => [newIntObj, ...prev]);

    try {
      const payload = {
        title: newIntObj.title,
        company: newIntObj.company,
        type: newIntObj.type,
        stipend: newIntObj.stipend,
        mode: newIntObj.mode,
        duration: newIntObj.duration,
        openings: Number(newIntObj.openings || 5),
        badge: newIntObj.badge,
        skills: newIntObj.skills || [],
        description: newIntObj.description,
        last_date: newIntObj.lastDateToApply
      };

      const { data: inserted, error } = await supabase.from('internships').insert([payload]).select();
      if (error) {
        console.error('Supabase Add Internship Error:', error);
      } else if (inserted && inserted.length > 0) {
        alert('✅ Internship Role Published & Saved to Supabase Cloud DB!');
        return;
      }
    } catch (err) {
      console.error('Supabase add int catch:', err);
    }
    alert('✅ Internship Role Added to Website!');
  };

  const handleUpdateInternship = async (updatedIntObj) => {
    setInternships(prev => prev.map(i => Number(i.id) === Number(updatedIntObj.id) ? { ...i, ...updatedIntObj } : i));

    try {
      const payload = {
        title: updatedIntObj.title,
        company: updatedIntObj.company,
        type: updatedIntObj.type,
        stipend: updatedIntObj.stipend,
        mode: updatedIntObj.mode,
        duration: updatedIntObj.duration,
        openings: Number(updatedIntObj.openings),
        badge: updatedIntObj.badge,
        skills: updatedIntObj.skills,
        description: updatedIntObj.description,
        last_date: updatedIntObj.lastDateToApply
      };

      const { error } = await supabase.from('internships').update(payload).eq('id', Number(updatedIntObj.id));
      if (error) {
        console.error('Supabase Update Internship Error:', error);
      } else {
        alert('✏️ Internship Details Updated Live!');
      }
    } catch (err) {
      console.error('Supabase update int catch:', err);
    }
  };

  const handleDeleteInternship = async (intId) => {
    setInternships(prev => prev.filter(i => Number(i.id) !== Number(intId)));

    try {
      const { error } = await supabase.from('internships').delete().eq('id', Number(intId));
      if (error) {
        console.error('Supabase Delete Internship Error:', error);
      } else {
        alert('🗑️ Internship Deleted from Website & Supabase Cloud DB!');
      }
    } catch (err) {
      console.error('Supabase delete int catch:', err);
    }
  };

  const handleResetRevenue = async () => {
    setTransactions([]);
    localStorage.removeItem('dibuzz_txns');
    try {
      await supabase.from('transactions').delete().neq('id', '0');
    } catch (e) {
      console.error('Supabase clear transactions catch:', e);
    }
  };

  const userEnrolledIds = currentUser?.enrolledCourses || [];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">

      {/* Navigation Header */}
      {activeTab !== 'landing' && (
        <Navbar
          currentUser={currentUser}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          openAuthModal={handleOpenAuthModal}
          logout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={handleToggleMobileMenu}
          companyInfo={companyInfo}
        />
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage setActiveTab={handleTabChange} companyInfo={companyInfo} />
        )}
        
        {activeTab === 'home' && (
          <>
            <Hero
              setActiveTab={handleTabChange}
              onOpenAuthModal={handleOpenAuthModal}
              companyInfo={companyInfo}
              courses={courses}
              internships={internships}
              users={users}
              transactions={transactions}
            />
            
            <CourseExplorer
              courses={courses}
              onSelectCourse={handleSelectCourse}
              onEnrollCourse={handleEnrollTrigger}
              userEnrolledIds={userEnrolledIds}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onNavigateToAdmin={() => handleTabChange('admin')}
            />

            <HomeSections
              faqs={faqs}
              internships={internships}
              companyInfo={companyInfo}
              setActiveTab={handleTabChange}
              currentUser={currentUser}
              onOpenAuthModal={handleOpenAuthModal}
              onEnrollCourse={handleEnrollTrigger}
            />

            {/* Testimonials */}
            {TESTIMONIALS && TESTIMONIALS.length > 0 && (
              <section className="py-16 bg-slate-50 border-t border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-slate-900 font-heading">Placement & Career Success Stories</h2>
                    <p className="text-slate-600 text-sm mt-1 font-medium">Read how our graduates cracked high-paying tech roles</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((item) => (
                      <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                        <p className="text-xs text-slate-600 italic leading-relaxed font-normal">"{item.quote}"</p>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-sky-200" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{item.name}</p>
                            <p className="text-[10px] text-slate-500">{item.role}</p>
                            <span className="text-[10px] font-extrabold text-emerald-700">{item.package}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {activeTab === 'courses' && (
          <CourseExplorer
            courses={courses}
            onSelectCourse={handleSelectCourse}
            onEnrollCourse={handleEnrollTrigger}
            userEnrolledIds={userEnrolledIds}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNavigateToAdmin={() => handleTabChange('admin')}
          />
        )}

        {activeTab === 'internships' && (
          <InternshipSection
            companyInfo={companyInfo}
            internships={internships}
            currentUser={currentUser}
            onOpenAuthModal={handleOpenAuthModal}
            onNavigateToAdmin={() => handleTabChange('admin')}
          />
        )}

        {activeTab === 'verify' && (
          <CertificateVerifier verifiedCertificates={verifiedCertificates} />
        )}

        {activeTab === 'about' && (
          <AboutSection companyInfo={companyInfo} />
        )}

        {activeTab === 'dashboard' && (
          <StudentDashboard
            currentUser={currentUser}
            courses={courses}
            internships={internships}
            userTransactions={transactions.filter(t => t.userEmail === currentUser?.email)}
            verifiedCertificates={verifiedCertificates}
            setActiveTab={handleTabChange}
            companyInfo={companyInfo}
            onSelectCourse={handleSelectCourse}
            onEnrollCourse={handleEnrollTrigger}
            userEnrolledIds={userEnrolledIds}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            courses={courses}
            setCourses={setCourses}
            onAddCourse={handleAddCourse}
            onDeleteCourse={handleDeleteCourse}
            onUpdateCourse={handleUpdateCourse}
            internships={internships}
            setInternships={setInternships}
            onAddInternship={handleAddInternship}
            onDeleteInternship={handleDeleteInternship}
            onUpdateInternship={handleUpdateInternship}
            users={users}
            setUsers={setUsers}
            transactions={transactions}
            setTransactions={setTransactions}
            onResetRevenue={handleResetRevenue}
            companyInfo={companyInfo}
            setCompanyInfo={setCompanyInfo}
            verifiedCertificates={verifiedCertificates}
            setVerifiedCertificates={setVerifiedCertificates}
            faqs={faqs}
            setFaqs={setFaqs}
          />
        )}
      </main>

      {/* Footer */}
      {activeTab !== 'landing' && (
        <Footer companyInfo={companyInfo} setActiveTab={handleTabChange} />
      )}

      {/* Course Detail Modal */}
      {detailCourse && (
        <CourseDetailModal
          course={detailCourse}
          onClose={() => setDetailCourse(null)}
          onEnroll={handleEnrollTrigger}
          isEnrolled={userEnrolledIds.includes(detailCourse.id)}
        />
      )}

      {/* Payment Gateway Modal */}
      {paymentCourse && (
        <PaymentModal
          course={paymentCourse}
          currentUser={currentUser}
          onClose={() => setPaymentCourse(null)}
          onPaymentSuccess={handlePaymentSuccess}
          companyInfo={companyInfo}
        />
      )}

      {/* Auth Modal */}
      {authModal.isOpen && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          onLoginSuccess={handleLogin}
          onRegisterSuccess={handleRegister}
        />
      )}

    </div>
  );
}
