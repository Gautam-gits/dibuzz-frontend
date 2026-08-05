const fs = require('fs');

// 1. App.jsx: Order by ID descending & pass internships to HomeSections
let appFile = fs.readFileSync('src/App.jsx', 'utf-8');
appFile = appFile.replace(/\.order\('id'\)/g, ".order('id', { ascending: false })");
appFile = appFile.replace(
  /<HomeSections\s+companyInfo=\{companyInfo\}/,
  "<HomeSections\n              internships={internships}\n              companyInfo={companyInfo}"
);
fs.writeFileSync('src/App.jsx', appFile);


// 2. HomeSections.jsx: Use the real internships prop
let homeFile = fs.readFileSync('src/components/HomeSections.jsx', 'utf-8');
// Update component props
homeFile = homeFile.replace(
  /export function HomeSections\(\{ companyInfo, setActiveTab, currentUser, onOpenAuthModal \}\) \{/,
  "export function HomeSections({ companyInfo, setActiveTab, currentUser, onOpenAuthModal, internships = [] }) {"
);

// Map over real data
// We'll define displayInternships right before it maps over homeInternships
homeFile = homeFile.replace(
  /\{homeInternships\.map\(\(item\) => \(/,
  `{ (internships.length > 0 ? internships.slice(0, 3) : homeInternships).map((item) => (`
);

// Also we need to fix the getImage and icon rendering because HomeSections uses hardcoded images
// wait, HomeSections uses \`item.image\` and in the dummy data it's \`/python-card.jpg\`. 
// If real data lacks image, let's inject a fallback
homeFile = homeFile.replace(
  /<img src=\{item\.image\} alt=\{item\.title\}/,
  "<img src={item.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'} alt={item.title}"
);

// also fix the stipend/fee and badge
homeFile = homeFile.replace(
  /<span className="text-xs font-black text-white font-mono bg-emerald-600 px-2\.5 py-0\.5 rounded-md shadow-xs">[\s\S]*?₹444[\s\S]*?<\/span>/,
  '<span className="text-xs font-black text-white font-mono bg-emerald-600 px-2.5 py-0.5 rounded-md shadow-xs">{item.stipend || "₹444"}</span>'
);

homeFile = homeFile.replace(
  /item\.badge/g,
  "(item.badge || '3rd Sem')"
);

fs.writeFileSync('src/components/HomeSections.jsx', homeFile);


// 3. AdminDashboard.jsx: Sequential IDs
let adminFile = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf-8');

adminFile = adminFile.replace(
  /\{String\(u\.id\)\.slice\(-4\)\}/g,
  "{users.length - users.findIndex(x => x.id === u.id)}"
);

adminFile = adminFile.replace(
  /<td className="px-4 py-3 font-mono text-violet-600 text-\[10px\]">\{String\(t\.id\)\.slice\(-8\)\}<\/td>/g,
  '<td className="px-4 py-3 font-mono text-violet-600 text-[10px]">#{transactions.length - transactions.findIndex(x => x.id === t.id)}</td>'
);

// Also for internships/courses if they have tables. 
// I'll check if they use {String(i.id).slice(-4)} etc.
adminFile = adminFile.replace(/\{String\(item\.id\)\.slice\(-4\)\}/g, "{index + 1}");

fs.writeFileSync('src/components/AdminDashboard.jsx', adminFile);

console.log('Fixes applied successfully');
