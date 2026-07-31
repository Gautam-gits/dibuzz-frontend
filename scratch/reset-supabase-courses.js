import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztccsmsmjkzhtyfklkyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Y2NzbXNtamt6aHR5Zmtsa3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTI1MTIsImV4cCI6MjEwMDgyODUxMn0.5zrrKRtoMWOXV2e6ZGyqLkpU5G9_uelvK3aNDVGWpKg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CLEAN_COURSES = [
  {
    title: "Full Stack MERN & Next.js Masterclass",
    category: "Full-Stack",
    badge: "Bestseller",
    level: "Beginner to Advanced",
    duration: "16 Weeks (Live + Projects)",
    rating: 4.9,
    reviews_count: 1420,
    students_count: 3850,
    original_price: 24999,
    price: 14999,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    description: "Master modern web development with React 19, Next.js, Node.js, Express & MongoDB with 8 live projects and ISO 9001:2015 certification.",
    highlights: [
      "8+ Real-world Capstone Projects",
      "Guaranteed Internship Opportunity",
      "Live 1-on-1 Mentorship & Code Reviews",
      "ISO Verified Certificate of Completion"
    ],
    syllabus: [
      { week: "Week 1-4", topic: "HTML5, Modern CSS3 & React Core Mastery" },
      { week: "Week 5-8", topic: "Node.js, Express & MongoDB Architecture" },
      { week: "Week 9-12", topic: "Next.js App Router & Full Stack Integration" },
      { week: "Week 13-16", topic: "Cloud Deployment, System Design & Interviews" }
    ]
  },
  {
    title: "Data Science & Generative AI Engineering",
    category: "Data & AI",
    badge: "Trending",
    level: "Intermediate",
    duration: "20 Weeks",
    rating: 4.95,
    reviews_count: 980,
    students_count: 2410,
    original_price: 34999,
    price: 19999,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    description: "Build AI models, LLM fine-tuning pipelines, Python automation & Machine Learning algorithms with live industry mentors.",
    highlights: [
      "Python Data Science Stack (Numpy, Pandas, Matplotlib)",
      "Machine Learning Algorithms & Neural Networks",
      "Generative AI & LLM Fine-tuning Projects",
      "Placement Assistance & Resume Review"
    ],
    syllabus: [
      { week: "Week 1-5", topic: "Python Data Analysis & Statistical Foundations" },
      { week: "Week 6-10", topic: "Machine Learning Algorithms & Scikit-Learn" },
      { week: "Week 11-15", topic: "Deep Learning, PyTorch & Generative AI" },
      { week: "Week 16-20", topic: "Model Deployment & Capstone Sprints" }
    ]
  },
  {
    title: "Diploma in Computer Applications (DCA & ADCA)",
    category: "Computer Applications",
    badge: "Govt Recognized",
    level: "Beginner",
    duration: "6 Months / 24 Weeks",
    rating: 4.92,
    reviews_count: 2150,
    students_count: 5400,
    original_price: 14999,
    price: 7999,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    description: "Government recognized certification covering MS Office, Advanced Excel, Tally Prime with GST accounting, and IT fundamentals.",
    highlights: [
      "ISO 9001:2015 & MCA Govt Recognized Certificate",
      "Complete Tally Prime with GST Accounting",
      "Advanced Excel Data Analysis & Pivot Tables",
      "Practical Hands-on Computer Lab Training"
    ],
    syllabus: [
      { week: "Month 1-2", topic: "Computer Fundamentals, OS & MS Office Pro" },
      { week: "Month 3-4", topic: "Tally Prime Accounting with GST Filings" },
      { week: "Month 5-6", topic: "Web Basics, Graphic Basics & Final DCA Certification" }
    ]
  }
];

async function resetCourses() {
  console.log('Clearing old data from Supabase courses table...');
  const { error: delErr } = await supabase.from('courses').delete().neq('id', 0);
  if (delErr) {
    console.error('Delete error:', delErr);
  }

  console.log('Inserting 3 clean courses into Supabase...');
  const { data, error: insErr } = await supabase.from('courses').insert(CLEAN_COURSES).select();
  if (insErr) {
    console.error('Insert error:', insErr);
  } else {
    console.log(`SUCCESS! Reset Supabase database with exactly ${data.length} clean courses.`);
  }
}

resetCourses();
