const fs = require('fs');

// Fix AuthModal.jsx state clearing
let authFile = fs.readFileSync('src/components/AuthModal.jsx', 'utf-8');
authFile = authFile.replace(
  /onClick=\{.*?setMode\('login'\); setErrorMsg\(''\);.*?\}/g,
  "onClick={() => { setMode('login'); setErrorMsg(''); setEmail(''); setPassword(''); setName(''); setPhone(''); }}"
);
authFile = authFile.replace(
  /onClick=\{.*?setMode\('register'\); setErrorMsg\(''\);.*?\}/g,
  "onClick={() => { setMode('register'); setErrorMsg(''); setEmail(''); setPassword(''); }}"
);
fs.writeFileSync('src/components/AuthModal.jsx', authFile);

// Fix StudentDashboard.jsx weird dangling button and ensure correct dashboard rendering
let dashFile = fs.readFileSync('src/components/StudentDashboard.jsx', 'utf-8');

// Remove any dangling Explore Internships button
dashFile = dashFile.replace(
  /\s*<button\s*onClick=\{\(\) => setDashboardTab\('explore_internships'\)\}\s*className=\{.*\}\s*>\s*<ShieldCheck className=.*?\/>\s*<span>Explore Internships<\/span>\s*<\/button>/g,
  ''
);

// We need to carefully put the buttons back inside the subnav flex container.
// Let's find the closing tag of the subnav flex container and inject them right before it.
// The subnav is: <div className="flex border-b border-slate-200 mb-8 gap-8 font-bold text-sm text-slate-600">
if (dashFile.indexOf('Explore Courses') === -1) {
  dashFile = dashFile.replace(
    /(<div className="flex border-b border-slate-200 mb-8 gap-8 font-bold text-sm text-slate-600">[\s\S]*?<span>Payment Tax Receipts<\/span>\s*<\/button>\s*)<\/div>/,
    `$1
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
        </div>`
  );
}

fs.writeFileSync('src/components/StudentDashboard.jsx', dashFile);
