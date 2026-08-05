const fs = require('fs');

let file = fs.readFileSync('src/components/StudentDashboard.jsx', 'utf-8');

// Update imports
file = file.replace(
  /import \{ Logo \} from '\.\/Logo';/,
  "import { Logo } from './Logo';\nimport { CourseExplorer } from './CourseExplorer';\nimport { InternshipSection } from './InternshipSection';"
);

// Update props
file = file.replace(
  /export function StudentDashboard\(\{ currentUser, courses, userTransactions, verifiedCertificates, setActiveTab \}\) \{/,
  "export function StudentDashboard({ currentUser, courses, internships, userTransactions, verifiedCertificates, setActiveTab, companyInfo, onSelectCourse, onEnrollCourse, userEnrolledIds, onOpenAuthModal }) {"
);

// Add tabs in subnav
const newTabs = `
          <button
            onClick={() => setDashboardTab('explore_courses')}
            className={\`pb-3 flex items-center gap-2 transition-colors cursor-pointer border-b-2 \${activeTab === 'explore_courses' ? 'border-sky-600 text-sky-600 font-extrabold' : 'border-transparent hover:text-slate-900'}\`}
          >
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span>Explore Courses</span>
          </button>

          <button
            onClick={() => setDashboardTab('explore_internships')}
            className={\`pb-3 flex items-center gap-2 transition-colors cursor-pointer border-b-2 \${activeTab === 'explore_internships' ? 'border-sky-600 text-sky-600 font-extrabold' : 'border-transparent hover:text-slate-900'}\`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Explore Internships</span>
          </button>
`;

file = file.replace(
  /\{\/\* COURSES TAB \*\/\}/,
  `${newTabs}\n        {/* COURSES TAB */}`
);

// Change "Enroll New Course" button to switch to 'explore_courses' tab
file = file.replace(
  /onClick=\{.*setActiveTab\('courses'\).*\}/,
  "onClick={() => setDashboardTab('explore_courses')}"
);

// Add the render logic for the new tabs
const newRenders = `
        {/* EXPLORE COURSES TAB */}
        {activeTab === 'explore_courses' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-0 sm:p-4">
             <CourseExplorer
                courses={courses}
                onSelectCourse={onSelectCourse}
                onEnrollCourse={onEnrollCourse}
                userEnrolledIds={userEnrolledIds}
              />
          </div>
        )}

        {/* EXPLORE INTERNSHIPS TAB */}
        {activeTab === 'explore_internships' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-0 sm:p-4">
             <InternshipSection
                companyInfo={companyInfo}
                internships={internships}
                currentUser={currentUser}
                onOpenAuthModal={onOpenAuthModal}
                onEnrollCourse={onEnrollCourse}
              />
          </div>
        )}
`;

file = file.replace(
  /\{\/\* COURSES TAB \*\/\}/,
  `${newRenders}\n        {/* COURSES TAB */}`
);

fs.writeFileSync('src/components/StudentDashboard.jsx', file);
