import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztccsmsmjkzhtyfklkyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Y2NzbXNtamt6aHR5Zmtsa3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTI1MTIsImV4cCI6MjEwMDgyODUxMn0.5zrrKRtoMWOXV2e6ZGyqLkpU5G9_uelvK3aNDVGWpKg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const INITIAL_COURSES = [
  {
    title: "Full Stack Web Development Sprint (MERN & Next.js)",
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
    description: "Master modern web development from HTML/CSS to React, Node.js, Express, MongoDB, and Next.js. Build 8 production-level projects with 1-on-1 code reviews and guaranteed internship.",
    highlights: [
      "8+ Real-world Capstone Projects",
      "Guaranteed Internship Opportunity",
      "Live 1-on-1 Mentorship & Code Reviews",
      "ISO Verified Certificate of Completion"
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Frontend Fundamentals (HTML5, Modern CSS3, Flexbox & Tailwind CSS)" },
      { week: "Week 4-7", topic: "JavaScript ES6+, Async Programming & React Core Mastery" },
      { week: "Week 8-11", topic: "Backend Engineering with Node.js, Express & MongoDB Schemas" },
      { week: "Week 12-14", topic: "Full Stack Integration, Next.js App Router & REST/GraphQL APIs" },
      { week: "Week 15-16", topic: "Deployment (Vercel/AWS), System Design & Mock Interview Prep" }
    ]
  },
  {
    title: "Data Science & AI Engineering Masterclass",
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
    description: "Unlock the power of Machine Learning, Deep Learning, Python, Pandas, Scikit-Learn, and LLMs. Includes hands-on AI model deployment and real industry case studies.",
    highlights: [
      "Python Data Science Stack (Numpy, Pandas, Matplotlib)",
      "Machine Learning Algorithms & Neural Networks",
      "Generative AI & LLM Fine-tuning Projects",
      "Placement Assistance & Resume Review"
    ],
    syllabus: [
      { week: "Week 1-4", topic: "Python for Data Analysis & Statistical Foundations" },
      { week: "Week 5-9", topic: "Exploratory Data Analysis (EDA) & Machine Learning Algorithms" },
      { week: "Week 10-14", topic: "Deep Learning with TensorFlow & PyTorch Architectures" },
      { week: "Week 15-18", topic: "NLP, Computer Vision & Generative AI Prompt Engineering" },
      { week: "Week 19-20", topic: "Model Deployment on Cloud & Live Capstone Project" }
    ]
  },
  {
    title: "Python Automation & Backend Microservices",
    category: "Automation",
    badge: "Job Ready",
    level: "All Levels",
    duration: "12 Weeks",
    rating: 4.85,
    reviews_count: 750,
    students_count: 1890,
    original_price: 19999,
    price: 11999,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    description: "Learn Python script automation, web scraping, FastApi/Django microservices architecture, PostgreSQL, and Docker containerization.",
    highlights: [
      "Web Scraping with BeautifulSoup & Selenium",
      "FastAPI & PostgreSQL Microservices",
      "CI/CD Pipelines & Docker Fundamentals",
      "Automation Suite for Corporate Workflows"
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Advanced Python Data Types, OOPs & Error Handling" },
      { week: "Week 4-6", topic: "Web Scraping & Task Automation" },
      { week: "Week 7-9", topic: "FastAPI Backend API Construction" },
      { week: "Week 10-12", topic: "Docker Containerization & Capstone" }
    ]
  },
  {
    title: "UI/UX Product Design & Figma System Architecture",
    category: "Design",
    badge: "Creative",
    level: "Beginner",
    duration: "10 Weeks",
    rating: 4.9,
    reviews_count: 620,
    students_count: 1540,
    original_price: 17999,
    price: 9999,
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80",
    description: "Design pixel-perfect mobile and web interfaces. Master user research, wireframing, interactive prototyping, and design systems using Figma.",
    highlights: [
      "Complete Figma Pro Mastery",
      "User Research & Wireframes",
      "Design Systems & Component Libraries"
    ],
    syllabus: [
      { week: "Week 1-2", topic: "UX Research & Journey Mapping" },
      { week: "Week 3-5", topic: "Figma UI Mastery" },
      { week: "Week 6-8", topic: "High-Fidelity Prototyping" }
    ]
  },
  {
    title: "Digital Marketing & Performance Growth Masterclass",
    category: "Digital Marketing",
    badge: "High ROI",
    level: "All Levels",
    duration: "12 Weeks",
    rating: 4.8,
    reviews_count: 1100,
    students_count: 3100,
    original_price: 19999,
    price: 10999,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    description: "Drive targeted traffic and conversions with Meta Ads, Google Ads (SEM), SEO Optimization, Content Strategy, and Analytics Funnels.",
    highlights: [
      "Google & Meta Ads Certification",
      "SEO Audit Tools (Ahrefs, SEMrush)",
      "Social Media Growth & Automation"
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Search Engine Optimization" },
      { week: "Week 4-6", topic: "Meta Ad Campaigns" },
      { week: "Week 7-9", topic: "Google Ads & Analytics" }
    ]
  },
  {
    title: "Diploma in Computer Applications (DCA & ADCA Pro)",
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
    description: "Comprehensive IT certification course covering Computer Fundamentals, MS Office Pro Suite, Tally Prime with GST, Data Entry, and Web Basics.",
    highlights: [
      "ISO 9001:2015 & MCA Govt Recognized Certificate",
      "Complete Tally Prime with GST Accounting",
      "Advanced Excel Data Analysis"
    ],
    syllabus: [
      { week: "Month 1", topic: "Computer Basics & Windows OS" },
      { week: "Month 2", topic: "MS Office Suite & Advanced Excel" },
      { week: "Month 3", topic: "Tally Prime Accounting with GST" }
    ]
  }
];

async function seed() {
  console.log('Seeding initial courses into Supabase...');
  const { data, error } = await supabase.from('courses').insert(INITIAL_COURSES).select();
  if (error) {
    console.error('SEED ERROR:', error);
  } else {
    console.log(`SUCCESSFULLY SEEDED ${data.length} COURSES INTO SUPABASE!`);
  }
}

seed();
