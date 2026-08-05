const fs = require('fs');
let file = fs.readFileSync('src/components/StudentDashboard.jsx', 'utf-8');

file = file.replace(
/        \n          <button\n            onClick=\{.*?setDashboardTab\('explore_courses'\).*?\n            className=\{.*?\}[\s\S]*?<\/button>\n\n        /g,
''
);

file = file.replace(
/            <span>Payment Tax Receipts<\/span>\n          <\/button>/,
`            <span>Payment Tax Receipts</span>
          </button>

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
          </button>`
);

fs.writeFileSync('src/components/StudentDashboard.jsx', file);
