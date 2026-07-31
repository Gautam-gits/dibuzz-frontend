import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztccsmsmjkzhtyfklkyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Y2NzbXNtamt6aHR5Zmtsa3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTI1MTIsImV4cCI6MjEwMDgyODUxMn0.5zrrKRtoMWOXV2e6ZGyqLkpU5G9_uelvK3aNDVGWpKg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const INITIAL_INTERNSHIPS = [
  {
    title: "Full Stack Web Development Intern",
    company: "Dibuzz Digital Tech Labs",
    type: "Paid Stipend",
    stipend: "₹ 15,000 / month",
    mode: "Remote / WFH",
    duration: "12 Weeks (3 Months)",
    openings: 8,
    badge: "Hot Choice",
    skills: ["React 19", "Node.js", "MongoDB", "Tailwind CSS"],
    description: "Work on live client web applications, REST API integrations, and modern React 19 micro-frontends under senior tech leads.",
    last_date: "Aug 15, 2026"
  },
  {
    title: "Data Science & AI Research Intern",
    company: "Dibuzz AI Innovations Lab",
    type: "Paid Stipend",
    stipend: "₹ 20,000 / month",
    mode: "Hybrid (Noida NCR)",
    duration: "16 Weeks (4 Months)",
    openings: 5,
    badge: "High Stipend",
    skills: ["Python", "Pandas", "Scikit-Learn", "LLM Prompting"],
    description: "Build exploratory data analysis dashboards, train machine learning models, and assist in generative AI prompt pipelines.",
    last_date: "Aug 20, 2026"
  },
  {
    title: "AICTE Skill-India Frontend Intern",
    company: "Dibuzz Education Division",
    type: "Free AICTE",
    stipend: "Free (Govt Certificate + AICTE Credits)",
    mode: "Remote / WFH",
    duration: "8 Weeks (2 Months)",
    openings: 25,
    badge: "AICTE Associated",
    skills: ["HTML5", "CSS3", "JavaScript ES6+", "Git/GitHub"],
    description: "National Skill-India associated internship designed for Diploma and B.Tech/BCA students to fulfill academic credit requirements.",
    last_date: "Aug 30, 2026"
  },
  {
    title: "UI/UX Product Design Intern",
    company: "Dibuzz Creative Studio",
    type: "Paid Stipend",
    stipend: "₹ 12,000 / month",
    mode: "Remote / WFH",
    duration: "10 Weeks",
    openings: 6,
    badge: "Popular",
    skills: ["Figma", "Wireframing", "User Journeys", "Prototypes"],
    description: "Design pixel-perfect Figma components, conduct user testing, and create interactive wireframes for mobile & desktop apps.",
    last_date: "Aug 18, 2026"
  },
  {
    title: "Python Automation & Cloud Operations Intern",
    company: "Dibuzz Infrastructure Ops",
    type: "Free AICTE",
    stipend: "Free (Project Internship + ISO Seal)",
    mode: "Remote / WFH",
    duration: "12 Weeks (3 Months)",
    openings: 15,
    badge: "Govt Recognized",
    skills: ["Python", "FastAPI", "Docker", "Linux Commands"],
    description: "Hands-on project internship focusing on building backend script automation, web scrapers, and Docker containerization.",
    last_date: "Sep 05, 2026"
  }
];

async function seedInternships() {
  console.log('Clearing old data from Supabase internships table...');
  try {
    await supabase.from('internships').delete().neq('id', 0);
  } catch (e) {
    console.log(e);
  }

  console.log('Inserting initial internships into Supabase...');
  const { data, error } = await supabase.from('internships').insert(INITIAL_INTERNSHIPS).select();
  if (error) {
    console.error('SEED INTERNSHIPS ERROR:', error);
    console.log('Hint: Run SQL Setup Script in Supabase SQL Editor if table does not exist.');
  } else {
    console.log(`SUCCESSFULLY SEEDED ${data.length} INTERNSHIPS INTO SUPABASE!`);
  }
}

seedInternships();
