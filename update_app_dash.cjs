const fs = require('fs');

let file = fs.readFileSync('src/App.jsx', 'utf-8');

file = file.replace(
  /<StudentDashboard\s+currentUser=\{currentUser\}\s+courses=\{courses\}\s+userTransactions=\{transactions\.filter\(t => t\.userEmail === currentUser\?\.email\)\}\s+verifiedCertificates=\{verifiedCertificates\}\s+setActiveTab=\{handleTabChange\}\s+\/>/,
  `<StudentDashboard
            currentUser={currentUser}
            courses={courses}
            internships={internships}
            userTransactions={transactions.filter(t => t.userEmail === currentUser?.email)}
            verifiedCertificates={verifiedCertificates}
            setActiveTab={handleTabChange}
            companyInfo={companyInfo}
            onSelectCourse={handleSelectCourse}
            onEnrollCourse={handleEnrollTrigger}
            userEnrolledIds={userEnrolledIds}
            onOpenAuthModal={handleOpenAuthModal}
          />`
);

fs.writeFileSync('src/App.jsx', file);
