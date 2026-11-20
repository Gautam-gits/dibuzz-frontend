import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { PageLoading, AccessPanel, NotFound } from './components/PageStates';
import { ProgramsPage } from './components/ProgramsPage';
import { ProgramDetailPage } from './components/ProgramDetailPage';
import { HomePage } from './components/HomePage';
import { ServicesPage } from './components/ServicesPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { CertificateVerifier } from './components/CertificateVerifier';
import { AuthModal } from './components/AuthModal';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminDashboard } from './components/AdminDashboard';

import { supabase } from './lib/supabase';
import {
  INITIAL_COMPANY_INFO,
  INITIAL_VERIFIED_CERTIFICATES,
} from './data/mockData';

// Every page has a real address (URL). Old "tab" names still work inside the code.
const TAB_PATHS = {
  landing: '/',
  services: '/services',
  home: '/programs',
  courses: '/programs',
  internships: '/programs',
  verify: '/verify',
  about: '/about',
  contact: '/contact',
  login: '/login',
  resetPassword: '/reset-password',
  dashboard: '/dashboard',
  admin: '/admin'
};

const PATH_TABS = {
  '/': 'landing',
  '/services': 'services',
  '/programs': 'home',
  '/verify': 'verify',
  '/about': 'about',
  '/contact': 'contact',
  '/login': 'login',
  '/reset-password': 'resetPassword',
  '/dashboard': 'dashboard',
  '/admin': 'admin'
};

const PAGE_TITLES = {
  landing: 'DIBUZZ DIGITAL PRIVATE LIMITED | Digital services & learning programs',
  services: 'Services | DIBUZZ',
  home: 'Programs | DIBUZZ',
  verify: 'Verify Certificate | DIBUZZ',
  about: 'About | DIBUZZ',
  contact: 'Contact | DIBUZZ',
  program: 'Program | DIBUZZ',
  login: 'Sign in | DIBUZZ',
  resetPassword: 'Reset password | DIBUZZ',
  dashboard: 'My Learning | DIBUZZ',
  admin: 'DIBUZZ Admin',
  notfound: 'Page not found | DIBUZZ'
};

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

  const [courses, setCourses] = useState([]);

  const [internships, setInternships] = useState([]);
  const [users, setUsers] = useState([]);

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

  const [currentUser, setCurrentUser] = useState(null);

  const [dbStatus, setDbStatus] = useState('CONNECTING'); // 'CONNECTED' | 'FALLBACK'

  // UI state
  const location = useLocation();
  const navigate = useNavigate();
  const cleanPath = location.pathname.replace(/\/+$/, '') || '/';
  const activeTab = PATH_TABS[cleanPath] || (cleanPath.startsWith('/programs/') ? 'program' : 'notfound');
  const [authReady, setAuthReady] = useState(false);

  // Modals state
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  // Navigation: every page has a real URL (react-router)
  const handleTabChange = (tabName) => {
    if (tabName === 'admin' && currentUser?.role !== 'admin') {
      if (!currentUser) {
        setAuthModal({ isOpen: true, mode: 'login' });
      } else {
        navigate('/dashboard');
      }
      return;
    }

    if (tabName === 'dashboard' && !currentUser) {
      setAuthModal({ isOpen: true, mode: 'login' });
      return;
    }

    navigate(TAB_PATHS[tabName] || '/');
  };

  const handleOpenAuthModal = (mode = 'login') => setAuthModal({ isOpen: true, mode });

  // Scroll to the top (or to #section) when the page changes, and set the page title
  useEffect(() => {
    const target = location.hash ? location.hash.slice(1) : '';
    const element = target ? document.getElementById(target) : null;
    if (element) {
      element.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [cleanPath, location.hash]);

  useEffect(() => {
    if (activeTab === 'program') return; // the program page sets its own title
    document.title = PAGE_TITLES[activeTab] || PAGE_TITLES.landing;
  }, [activeTab]);

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
        kind: i.kind || 'internship',
        semester: i.semester || '',
        category: i.category || '',
        shortSummary: i.short_summary || '',
        instructorName: i.instructor_name || '',
        level: i.level || '',
        language: i.language || '',
        originalFee: i.original_fee === null || i.original_fee === undefined ? null : Number(i.original_fee),
        learnPoints: typeof i.learn_points === 'string' ? JSON.parse(i.learn_points) : (i.learn_points || []),
        includes: typeof i.includes === 'string' ? JSON.parse(i.includes) : (i.includes || []),
        deadline: i.deadline || '',
        featured: Boolean(i.is_featured),
        status: i.status || (i.is_active ? 'published' : 'archived'),
        paymentRequired: Boolean(i.payment_required),
        approvalRequired: i.approval_required !== false,
        feeAmount: Number(i.fee_amount || 0),
        currency: i.currency || 'INR',
        lastDateToApply: i.deadline || i.last_date || i.lastDateToApply || '',
        isActive: i.status ? i.status === 'published' : i.is_active !== false
      })));

      // Profile data is personal data. Only an authenticated administrator may
      // request the directory, and it is never cached in browser storage.
      if (currentUser?.role === 'admin') {
        const { data: dbProfiles } = await supabase.from('profiles').select('*').order('id', { ascending: false });
        if (dbProfiles) setUsers(dbProfiles.map(p => ({
          id: p.id,
          name: p.full_name || 'Student',
          email: p.email,
          phone: p.phone,
          role: p.role || 'student',
          joinedDate: p.joined_date
            ? new Date(p.joined_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Jan 01, 2025',
          profileImage: p.profile_image || null
        })));
      } else {
        setUsers([]);
      }

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

    // Setup Realtime Subscriptions - only listen to relevant events, debounce refetch
    let debounceTimer = null;
    const debouncedFetch = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(fetchData, 300);
    };

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'internships' }, debouncedFetch)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'internships' }, debouncedFetch)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'courses' }, debouncedFetch)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'courses' }, debouncedFetch)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, debouncedFetch)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, debouncedFetch)
      .subscribe();

    return () => {
      clearTimeout(debounceTimer);
      supabase.removeChannel(channel);
    };
  }, []);

  // Save to localStorage as backup (throttled to avoid flicker)
  const saveToStorage = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  };

  useEffect(() => { saveToStorage('dibuzz_company', companyInfo); }, [companyInfo]);
  useEffect(() => { saveToStorage('dibuzz_courses', courses); }, [courses]);
  useEffect(() => { saveToStorage('dibuzz_internships', internships); }, [internships]);
  useEffect(() => { saveToStorage('dibuzz_certs', verifiedCertificates); }, [verifiedCertificates]);
  useEffect(() => { saveToStorage('dibuzz_txns', transactions); }, [transactions]);
  useEffect(() => { saveToStorage('dibuzz_faqs', faqs); }, [faqs]);
  useEffect(() => {
    if (currentUser?.role === 'admin') fetchData();
  }, [currentUser?.role]);

  const mapProfileToUser = (profile) => ({
    id: profile.id,
    name: profile.full_name || 'Student',
    email: profile.email,
    phone: profile.phone || '',
    role: profile.role || 'student',
    joinedDate: profile.joined_date
      ? new Date(profile.joined_date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
      : '',
    collegeRegNo: profile.college_reg_no || '',
    collegeName: profile.college_name || '',
    course: profile.course || '',
    branch: profile.branch || '',
    semester: profile.semester || '',
    collegeRollNo: profile.college_roll_no || '',
    nocPdfPath: profile.noc_pdf_path || '',
    profileImage: profile.profile_image || null,
    enrolledCourses: profile.enrolled_courses || [],
    certificates: profile.certificates || []
  });

  const loadSignedInUser = async (authUser) => {
    if (!authUser) {
      setCurrentUser(null);
      return null;
    }

    let profile = null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error || !data) {
        console.error('Unable to load profile:', error?.message || error);
        setCurrentUser(null);
        return null;
      }
      profile = data;
    } catch (networkError) {
      console.error('Network error loading profile:', networkError);
      setCurrentUser(null);
      return null;
    }

    if (!profile) {
      setCurrentUser(null);
      return null;
    }

    const user = mapProfileToUser({
      ...profile,
      email: authUser.email || profile.email
    });

    setCurrentUser(user);
    return user;
  };

  useEffect(() => {
    const restoreSession = async () => {
      // Capture this before any state change or URL cleanup. Google returns with
      // ?oauth=google, and the session/profile load is asynchronous.
      const oauthReturn = new URLSearchParams(window.location.search).get('oauth') === 'google';

      try {
        const { data } = await supabase.auth.getSession();

        if (data.session?.user) {
          const user = await loadSignedInUser(data.session.user);

          if (user && oauthReturn) {
            window.sessionStorage.removeItem('dibuzz_oauth_return_path');
            setAuthModal({ isOpen: false, mode: 'login' });
            // Google sign-in always lands in the user's workspace, not the public page
            // that happened to be open when authentication began.
            window.location.replace(user.role === 'admin' ? '/admin' : '/dashboard');
          }
        } else {
          setCurrentUser(null);
        }
      } finally {
        setAuthReady(true);
      }
    };

    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => {
        loadSignedInUser(session?.user || null);
      }, 0);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []); // Only run once on mount

  // Handle a failed OAuth return only after session restoration is complete.
  // This avoids reopening the login modal while the successful Google session is loading.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isOAuthReturn = params.get('oauth') === 'google';

    if (!isOAuthReturn || !authReady) return;

    window.history.replaceState({}, '', window.location.pathname);

    // The modal is needed only when Google did not produce a usable session.
    if (!currentUser) {
      setAuthModal({ isOpen: true, mode: 'login' });
    }
  }, [authReady, currentUser]);

  // Auth Handlers
  const handleLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error || !data.user) {
      return {
        success: false,
        message: error?.message || 'Invalid email or password.'
      };
    }

    const user = await loadSignedInUser(data.user);

    if (!user) {
      await supabase.auth.signOut();
      return {
        success: false,
        message: 'Your profile could not be loaded. Please contact support.'
      };
    }

    const isAdmin = user.role === 'admin';
    return {
      success: true,
      message: `Welcome back, ${user.name || 'there'}!`,
      destinationLabel: isAdmin ? 'the admin panel' : 'your learning space',
      redirectPath: isAdmin ? '/admin' : '/dashboard'
    };
  };

  const handleRegister = async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: userData.password,
      options: {
        data: {
          full_name: userData.name
        }
      }
    });

    if (error || !data.user) {
      return {
        success: false,
        message: error?.message || 'Account could not be created.'
      };
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: userData.name,
        phone: userData.phone,
        college_reg_no: userData.collegeRegNo,
        college_name: userData.collegeName,
        course: userData.course,
        branch: userData.branch,
        profile_image: userData.profileImage || null
      })
      .eq('id', data.user.id);

    if (profileError) {
      return {
        success: false,
        message: 'Account was created, but profile details could not be saved.'
      };
    }

    if (!data.session) {
      return {
        success: false,
        message: 'Account created. Please confirm your email, then sign in.'
      };
    }

    const user = await loadSignedInUser(data.user);

    if (!user) {
      return {
        success: false,
        message: 'Account created, but profile could not be loaded. Please sign in again.'
      };
    }

    return {
      success: true,
      message: `Welcome to DIBUZZ, ${user.name || 'there'}!`,
      destinationLabel: 'your learning space',
      redirectPath: '/dashboard'
    };
  };

  const handleAuthenticationComplete = (result) => {
    setAuthModal({ isOpen: false, mode: 'login' });
    navigate(result?.redirectPath || '/dashboard');
  };

  const handleGoogleAuth = async () => {
    // Supabase returns to this page after Google completes the secure OAuth flow.
    // The return handler then routes students to My Learning and admins to Admin.
    window.sessionStorage.removeItem('dibuzz_oauth_return_path');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login?oauth=google`
      }
    });

    if (error) {
      window.sessionStorage.removeItem('dibuzz_oauth_return_path');
      return {
        success: false,
        message: error.message || 'Google sign-in could not be started.'
      };
    }

    return { success: true };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUsers([]);
    localStorage.removeItem('dibuzz_current_user');
    localStorage.removeItem('dibuzz_users');
    navigate('/');
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

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">

      {/* Navigation Header */}
      <SiteHeader
        currentUser={currentUser}
        openAuthModal={handleOpenAuthModal}
        logout={handleLogout}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <HomePage internships={internships} loading={dbStatus === 'CONNECTING'} />
        )}

        {activeTab === 'services' && <ServicesPage />}

        {activeTab === 'contact' && <ContactPage companyInfo={companyInfo} />}

        {activeTab === 'home' && (
          <ProgramsPage
            internships={internships}
            loading={dbStatus === 'CONNECTING'}
            currentUser={currentUser}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}

        {activeTab === 'program' && (
          <ProgramDetailPage
            slug={cleanPath.slice('/programs/'.length)}
            internships={internships}
            loading={dbStatus === 'CONNECTING'}
            currentUser={currentUser}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}

        {activeTab === 'verify' && (
          <CertificateVerifier verifiedCertificates={verifiedCertificates} />
        )}

        {activeTab === 'about' && (
          <AboutPage companyInfo={companyInfo} />
        )}

        {activeTab === 'dashboard' && currentUser && (
          <StudentDashboard
            currentUser={currentUser}
            internships={internships}
          />
        )}

        {activeTab === 'admin' && currentUser?.role === 'admin' && (
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
            refreshData={fetchData}
          />
        )}

        {activeTab === 'login' && (
          currentUser
            ? <AccessPanel title="You are signed in" text="Open My Learning to continue." actionLabel="Open My Learning" onAction={() => handleTabChange(currentUser.role === 'admin' ? 'admin' : 'dashboard')} />
            : <AccessPanel title="Sign in to DIBUZZ" text="Sign in or create an account to apply for programs and track your learning." actionLabel="Sign in" onAction={() => handleOpenAuthModal('login')} />
        )}

        {activeTab === 'resetPassword' && <ResetPasswordPage />}

        {activeTab === 'dashboard' && !currentUser && (
          authReady
            ? <AccessPanel title="Sign in to open My Learning" text="Your programs, progress and certificates are available after you sign in." actionLabel="Sign in" onAction={() => handleOpenAuthModal('login')} />
            : <PageLoading />
        )}

        {activeTab === 'admin' && currentUser?.role !== 'admin' && (
          !authReady
            ? <PageLoading />
            : (currentUser
              ? <AccessPanel title="Admin access only" text="This area is only for DIBUZZ administrators." actionLabel="Go to My Learning" onAction={() => handleTabChange('dashboard')} />
              : <AccessPanel title="Admin sign in" text="Sign in with your administrator account to continue." actionLabel="Sign in" onAction={() => handleOpenAuthModal('login')} />)
        )}

        {activeTab === 'notfound' && <NotFound />}
      </main>

      {/* Footer */}
      <SiteFooter companyInfo={companyInfo} />

      {/* Auth Modal */}
      {authModal.isOpen && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
          onLoginSuccess={handleLogin}
          onRegisterSuccess={handleRegister}
          onAuthenticationComplete={handleAuthenticationComplete}
          onGoogleAuth={handleGoogleAuth}
          onForgotPassword={() => {
            setAuthModal({ isOpen: false, mode: 'login' });
            navigate('/reset-password');
          }}
        />
      )}

    </div>
  );
}
