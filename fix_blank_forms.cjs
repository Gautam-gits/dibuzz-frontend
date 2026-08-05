const fs = require('fs');

let file = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf-8');

// 1. Make blank forms empty strings
file = file.replace(
  /const blankInt = \{ title: '', company: 'DIBUZZ DIGITAL', type: '3rd Semester Training', stipend: 'Flat ₹444', mode: 'Online', duration: '4 to 6 Weeks', openings: 25, badge: '3rd Sem', description: '', image: '', skills: '' \};/,
  "const blankInt = { title: '', company: '', type: '', stipend: '', mode: '', duration: '', openings: '', badge: '', description: '', image: '', skills: '' };"
);

file = file.replace(
  /const blankCrs = \{ title: '', category: 'Web Development', price: 444, originalPrice: 1499, description: '', image: '', duration: '12 Weeks', badge: 'New', level: 'All Levels', rating: 5\.0, studentsCount: 0, reviewsCount: 1 \};/,
  "const blankCrs = { title: '', category: '', price: '', originalPrice: '', description: '', image: '', duration: '', badge: '', level: '', rating: '', studentsCount: '', reviewsCount: '' };"
);

// 2. Remove default fallbacks from payload when submitting "Add New"
// We don't want to save 'New' or '12 Weeks' if the admin intentionally left it blank or typed something else.
file = file.replace(
  /const payload = \{ title: cForm\.title\.trim\(\), category: cForm\.category, price: Number\(cForm\.price\), original_price: Number\(cForm\.originalPrice\), description: cForm\.description, image: cForm\.image, badge: cForm\.badge \|\| 'New', level: cForm\.level \|\| 'All Levels', duration: cForm\.duration \|\| '12 Weeks', rating: Number\(cForm\.rating \|\| 5\.0\), reviews_count: Number\(cForm\.reviewsCount \|\| 1\), students_count: Number\(cForm\.studentsCount \|\| 0\), highlights: \['Live Project Sprints', 'ISO & MCA Verifiable Certificate'\], syllabus: \[\] \};/,
  "const payload = { title: cForm.title.trim(), category: cForm.category, price: Number(cForm.price), original_price: Number(cForm.originalPrice), description: cForm.description, image: cForm.image, badge: cForm.badge, level: cForm.level, duration: cForm.duration, rating: Number(cForm.rating), reviews_count: Number(cForm.reviewsCount), students_count: Number(cForm.studentsCount), highlights: [], syllabus: [] };"
);

// Do the same for Course Update Payload
file = file.replace(
  /const payload = \{ title: editCrs\.title, category: editCrs\.category, price: Number\(editCrs\.price\), original_price: Number\(editCrs\.originalPrice \|\| editCrs\.original_price\), description: editCrs\.description, image: editCrs\.image, badge: editCrs\.badge \|\| 'New', level: editCrs\.level \|\| 'All Levels', duration: editCrs\.duration \|\| '12 Weeks', rating: Number\(editCrs\.rating \|\| 5\.0\), reviews_count: Number\(editCrs\.reviewsCount \|\| editCrs\.reviews_count \|\| 1\), students_count: Number\(editCrs\.studentsCount \|\| editCrs\.students_count \|\| 0\) \};/,
  "const payload = { title: editCrs.title, category: editCrs.category, price: Number(editCrs.price), original_price: Number(editCrs.originalPrice || editCrs.original_price), description: editCrs.description, image: editCrs.image, badge: editCrs.badge, level: editCrs.level, duration: editCrs.duration, rating: Number(editCrs.rating), reviews_count: Number(editCrs.reviewsCount || editCrs.reviews_count), students_count: Number(editCrs.studentsCount || editCrs.students_count) };"
);

// We should also remove 'Enrollment Open' default for last_date in internships if they add it. 
// But if last_date is required by DB, maybe we should keep a generic default or leave it empty if allowed.
// Let's just leave last_date as 'Enrollment Open' since there's no input field for it in the UI right now!

fs.writeFileSync('src/components/AdminDashboard.jsx', file);
console.log('Cleared default placeholder fields!');
