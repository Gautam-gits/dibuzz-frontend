const fs = require('fs');

// Update App.jsx to pass onEnrollCourse to InternshipSection
let appFile = fs.readFileSync('src/App.jsx', 'utf-8');
appFile = appFile.replace(
  /<InternshipSection\s+companyInfo=\{companyInfo\}\s+internships=\{internships\}\s+currentUser=\{currentUser\}\s+onOpenAuthModal=\{handleOpenAuthModal\}\s+\/>/,
  `<InternshipSection
              companyInfo={companyInfo}
              internships={internships}
              currentUser={currentUser}
              onOpenAuthModal={handleOpenAuthModal}
              onEnrollCourse={handleEnrollTrigger}
            />`
);

appFile = appFile.replace(
  /<HomeSections\s+faqs=\{faqs\}\s+internships=\{internships\}\s+companyInfo=\{companyInfo\}\s+setActiveTab=\{handleTabChange\}\s+currentUser=\{currentUser\}\s+onOpenAuthModal=\{handleOpenAuthModal\}\s+\/>/,
  `<HomeSections
              faqs={faqs}
              internships={internships}
              companyInfo={companyInfo}
              setActiveTab={handleTabChange}
              currentUser={currentUser}
              onOpenAuthModal={handleOpenAuthModal}
              onEnrollCourse={handleEnrollTrigger}
            />`
);
fs.writeFileSync('src/App.jsx', appFile);


// Update InternshipSection.jsx to use onEnrollCourse
let internFile = fs.readFileSync('src/components/InternshipSection.jsx', 'utf-8');
internFile = internFile.replace(
  /export function InternshipSection\(\{ companyInfo, internships = \[\], currentUser, onOpenAuthModal \}\) \{/,
  "export function InternshipSection({ companyInfo, internships = [], currentUser, onOpenAuthModal, onEnrollCourse }) {"
);

// Replace handleApplyClick to trigger onEnrollCourse and not open local modal
internFile = internFile.replace(
  /const handleApplyClick = \(item\) => \{[\s\S]*?\};/,
  `const handleApplyClick = (item) => {
    if (onEnrollCourse) {
      onEnrollCourse(item);
    }
  };`
);
fs.writeFileSync('src/components/InternshipSection.jsx', internFile);

// Update HomeSections.jsx to use onEnrollCourse
let homeFile = fs.readFileSync('src/components/HomeSections.jsx', 'utf-8');
homeFile = homeFile.replace(
  /export function HomeSections\(\{ companyInfo, setActiveTab, currentUser, onOpenAuthModal, internships = \[\], faqs = \[\] \}\) \{/,
  "export function HomeSections({ companyInfo, setActiveTab, currentUser, onOpenAuthModal, internships = [], faqs = [], onEnrollCourse }) {"
);
homeFile = homeFile.replace(
  /const handleEnrollClick = \(item\) => \{[\s\S]*?\};/,
  `const handleEnrollClick = (item) => {
    if (onEnrollCourse) {
      onEnrollCourse(item);
    }
  };`
);
fs.writeFileSync('src/components/HomeSections.jsx', homeFile);
console.log('App, InternshipSection, HomeSections updated for unified enrollment flow.');
