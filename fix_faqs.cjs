const fs = require('fs');

// 1. App.jsx: Pass faqs to HomeSections
let appFile = fs.readFileSync('src/App.jsx', 'utf-8');
appFile = appFile.replace(
  /<HomeSections\s+internships=\{internships\}\s+companyInfo=\{companyInfo\}/,
  "<HomeSections\n              faqs={faqs}\n              internships={internships}\n              companyInfo={companyInfo}"
);
fs.writeFileSync('src/App.jsx', appFile);

// 2. HomeSections.jsx: Add faqs to props, use them instead of hardcoded ones
let homeFile = fs.readFileSync('src/components/HomeSections.jsx', 'utf-8');

homeFile = homeFile.replace(
  /export function HomeSections\(\{ companyInfo, setActiveTab, currentUser, onOpenAuthModal, internships = \[\] \}\) \{/,
  "export function HomeSections({ companyInfo, setActiveTab, currentUser, onOpenAuthModal, internships = [], faqs = [] }) {"
);

// Remove the hardcoded const faqs = [...] array completely.
// Since it's big, we'll use a regex that matches const faqs = [ ... ];
homeFile = homeFile.replace(
  /const faqs = \[\s*\{[\s\S]*?\}\s*\];/g,
  ""
);

// Actually, I should also make sure it safely falls back if faqs is empty just in case.
// If faqs.length === 0, let's just let it be empty since it's now in Supabase.

fs.writeFileSync('src/components/HomeSections.jsx', homeFile);
console.log('App and HomeSections updated for FAQs.');
