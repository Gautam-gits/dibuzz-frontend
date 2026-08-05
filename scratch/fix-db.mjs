import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ztccsmsmjkzhtyfklkyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0Y2NzbXNtamt6aHR5Zmtsa3lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyNTI1MTIsImV4cCI6MjEwMDgyODUxMn0.5zrrKRtoMWOXV2e6ZGyqLkpU5G9_uelvK3aNDVGWpKg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const INITIAL_INTERNSHIPS = [
  {
    title: "Python Programming",
    company: "DIBUZZ DIGITAL PRIVATE LIMITED",
    type: "3rd Semester Training",
    stipend: "Coming Soon",
    mode: "Online / Hybrid Sprints",
    duration: "4 to 6 Weeks",
    openings: 25,
    badge: "3rd Sem",
    skills: ["Python 3", "Data Structures", "OOPs", "APIs"],
    description: "Online Python programming internship covering data structures, object-oriented concepts, and API integration."
  },
  {
    title: "Web Development",
    company: "DIBUZZ DIGITAL PRIVATE LIMITED",
    type: "3rd Semester Training",
    stipend: "Coming Soon",
    mode: "Online / Hybrid Sprints",
    duration: "4 to 6 Weeks",
    openings: 30,
    badge: "3rd Sem",
    skills: ["HTML5", "CSS3", "JavaScript", "React"],
    description: "Build modern responsive websites and web application interfaces with real-world development practices."
  },
  {
    title: "Artificial Intelligence (AI)",
    company: "DIBUZZ DIGITAL PRIVATE LIMITED",
    type: "3rd Semester Training",
    stipend: "Coming Soon",
    mode: "Online / Hybrid Sprints",
    duration: "4 to 6 Weeks",
    openings: 20,
    badge: "3rd Sem",
    skills: ["AI Models", "Prompt Eng", "OpenAI APIs"],
    description: "Explore cutting-edge Artificial Intelligence models, prompt engineering techniques, and LLM API integrations."
  },
  {
    title: "Machine Learning (ML)",
    company: "DIBUZZ DIGITAL PRIVATE LIMITED",
    type: "3rd Semester Training",
    stipend: "Coming Soon",
    mode: "Online / Hybrid Sprints",
    duration: "4 to 6 Weeks",
    openings: 20,
    badge: "3rd Sem",
    skills: ["Python", "Scikit-Learn", "Pandas", "Models"],
    description: "Practical Machine Learning internship covering data preprocessing, model building, and performance evaluation."
  },
  {
    title: "Internet of Things (IoT)",
    company: "DIBUZZ DIGITAL PRIVATE LIMITED",
    type: "3rd Semester Training",
    stipend: "Coming Soon",
    mode: "Online / Hybrid Sprints",
    duration: "4 to 6 Weeks",
    openings: 15,
    badge: "3rd Sem",
    skills: ["Sensors", "Arduino", "Raspberry Pi", "Cloud"],
    description: "Connect hardware sensors to cloud dashboards and automate smart IoT embedded system projects."
  },
  {
    title: "AutoCAD",
    company: "DIBUZZ DIGITAL PRIVATE LIMITED",
    type: "3rd Semester Training",
    stipend: "Coming Soon",
    mode: "Online / Hybrid Sprints",
    duration: "4 to 6 Weeks",
    openings: 25,
    badge: "3rd Sem",
    skills: ["2D Drafting", "3D Modeling", "Layouts"],
    description: "Master industry-standard 2D drafting, architectural plans, and 3D CAD modeling in AutoCAD."
  },
  {
    title: "SolidWorks",
    company: "DIBUZZ DIGITAL PRIVATE LIMITED",
    type: "3rd Semester Training",
    stipend: "Coming Soon",
    mode: "Online / Hybrid Sprints",
    duration: "4 to 6 Weeks",
    openings: 20,
    badge: "3rd Sem",
    skills: ["3D CAD", "Part Modeling", "Assembly"],
    description: "Comprehensive SolidWorks CAD design, mechanical part modeling, assembly creation, and simulation."
  },
  {
    title: "MATLAB",
    company: "DIBUZZ DIGITAL PRIVATE LIMITED",
    type: "3rd Semester Training",
    stipend: "Coming Soon",
    mode: "Online / Hybrid Sprints",
    duration: "4 to 6 Weeks",
    openings: 20,
    badge: "3rd Sem",
    skills: ["Simulink", "Data Processing", "Control Systems"],
    description: "Numerical computing, matrix data processing, and system simulation using MATLAB & Simulink."
  }
];

async function fixDB() {
  console.log('Clearing ALL courses...');
  await supabase.from('courses').delete().neq('id', 0);
  
  console.log('Clearing ALL internships...');
  await supabase.from('internships').delete().neq('id', 0);

  console.log('Seeding internships with Coming Soon...');
  const { data, error } = await supabase.from('internships').insert(INITIAL_INTERNSHIPS).select();
  if (error) {
    console.error('Error seeding internships:', error);
  } else {
    console.log(`Success! Inserted ${data.length} internships.`);
  }
}

fixDB();
