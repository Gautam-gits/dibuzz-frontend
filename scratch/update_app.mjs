import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appPath = path.join(__dirname, '../src/App.jsx');
let appContent = fs.readFileSync(appPath, 'utf-8');

// 1. Add faqs state
if (!appContent.includes('const [faqs, setFaqs]')) {
  appContent = appContent.replace(
    /const \[transactions, setTransactions\] = useState\(\(\) => \{[\s\S]*?\}\);\n/,
    `$&
  const [faqs, setFaqs] = useState(() => {
    try {
      const saved = localStorage.getItem('dibuzz_faqs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
`
  );
}

// 2. Add local storage for faqs
if (!appContent.includes("localStorage.setItem('dibuzz_faqs'")) {
  appContent = appContent.replace(
    /useEffect\(\(\) => \{\n    localStorage.setItem\('dibuzz_txns', JSON.stringify\(transactions\)\);\n  \}, \[transactions\]\);\n/,
    `$&
  useEffect(() => {
    localStorage.setItem('dibuzz_faqs', JSON.stringify(faqs));
  }, [faqs]);
`
  );
}

// 3. Update useEffect to fetch FAQs and set up real-time
const realTimeCode = `
    async function loadSupabaseData() {
      try {
        // Fetch Courses
        const { data: dbCourses } = await supabase.from('courses').select('*').order('id');
        if (dbCourses) setCourses(dbCourses.map(c => ({
          ...c,
          originalPrice: Number(c.original_price || c.originalPrice),
          price: Number(c.price),
          studentsCount: Number(c.students_count || c.studentsCount || 100),
          reviewsCount: Number(c.reviews_count || c.reviewsCount || 50),
          highlights: typeof c.highlights === 'string' ? JSON.parse(c.highlights) : (c.highlights || []),
          syllabus: typeof c.syllabus === 'string' ? JSON.parse(c.syllabus) : (c.syllabus || [])
        })));

        // Fetch Internships
        const { data: dbInts } = await supabase.from('internships').select('*').order('id');
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

        // Fetch Profiles
        const { data: dbProfiles } = await supabase.from('profiles').select('*').order('id');
        if (dbProfiles) setUsers(dbProfiles.map(p => ({
          id: p.id,
          name: p.name,
          email: p.email,
          phone: p.phone,
          password: p.password,
          role: p.role || 'student',
          joinedDate: p.joined_date || p.joinedDate || 'Jan 01, 2025',
          enrolledCourses: p.enrolled_courses || [],
          certificates: p.certificates || []
        })));
        
        // Fetch FAQs
        const { data: dbFaqs } = await supabase.from('faqs').select('*').order('id');
        if (dbFaqs) setFaqs(dbFaqs);

        setDbStatus('CONNECTED');

        // Setup Realtime Subscriptions
        const channel = supabase.channel('schema-db-changes')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'internships' }, () => {
             console.log('Realtime update on internships');
             loadSupabaseData(); // Simplest way to sync, fetch all again
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
             loadSupabaseData();
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
             loadSupabaseData();
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, () => {
             loadSupabaseData();
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err) {
        console.warn('Supabase fetch error:', err);
        setDbStatus('FALLBACK');
      }
    }
    
    let cleanup = null;
    loadSupabaseData().then(fn => { if (typeof fn === 'function') cleanup = fn; });
    
    return () => {
      if (cleanup) cleanup();
    };
`;

// Replace the old useEffect content
appContent = appContent.replace(
  /useEffect\(\(\) => \{\n    async function loadSupabaseData\(\) \{[\s\S]*?loadSupabaseData\(\);\n  \}, \[\]\);/g,
  `useEffect(() => {${realTimeCode}}, []);`
);

// 4. Update AdminDashboard props
if (!appContent.includes('faqs={faqs}')) {
  appContent = appContent.replace(
    /<AdminDashboard\n([\s\S]*?)verifiedCertificates=\{verifiedCertificates\}\n\s*setVerifiedCertificates=\{setVerifiedCertificates\}\n\s*\/>/g,
    `<AdminDashboard
$1verifiedCertificates={verifiedCertificates}
            setVerifiedCertificates={setVerifiedCertificates}
            faqs={faqs}
            setFaqs={setFaqs}
          />`
  );
}

fs.writeFileSync(appPath, appContent, 'utf-8');
console.log('App.jsx updated with realtime subscriptions and FAQs.');
