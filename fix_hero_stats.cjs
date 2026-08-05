const fs = require('fs');

// 1. Pass internships to Hero in App.jsx
let appFile = fs.readFileSync('src/App.jsx', 'utf-8');
appFile = appFile.replace(
  /<Hero\s+setActiveTab=\{handleTabChange\}\s+onOpenAuthModal=\{handleOpenAuthModal\}\s+companyInfo=\{companyInfo\}\s+courses=\{courses\}\s+users=\{users\}\s+transactions=\{transactions\}\s+\/>/,
  `<Hero
              setActiveTab={handleTabChange}
              onOpenAuthModal={handleOpenAuthModal}
              companyInfo={companyInfo}
              courses={courses}
              internships={internships}
              users={users}
              transactions={transactions}
            />`
);
fs.writeFileSync('src/App.jsx', appFile);

// 2. Update Hero.jsx props and stats
let heroFile = fs.readFileSync('src/components/Hero.jsx', 'utf-8');
heroFile = heroFile.replace(
  /export function Hero\(\{ setActiveTab, onOpenAuthModal, companyInfo, courses = \[\], users = \[\], transactions = \[\] \}\) \{/,
  "export function Hero({ setActiveTab, onOpenAuthModal, companyInfo, courses = [], internships = [], users = [], transactions = [] }) {"
);

// Define internshipCount
heroFile = heroFile.replace(
  /const courseCount = courses\.length \|\| 8;/,
  "const courseCount = courses.length || 0;\n  const internshipCount = internships.length || 0;"
);

// Update Stat 2 (Internship Tracks)
heroFile = heroFile.replace(
  /<div className="text-xl sm:text-4xl font-black text-emerald-600 font-heading">8<\/div>/,
  '<div className="text-xl sm:text-4xl font-black text-emerald-600 font-heading">{internshipCount}</div>'
);

fs.writeFileSync('src/components/Hero.jsx', heroFile);
console.log('Hero and App updated for live programs and internship track counts!');
