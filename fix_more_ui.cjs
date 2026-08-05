const fs = require('fs');
let file = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf-8');

// For Internships, let's replace <Field label="Duration"> section to inject more fields.
file = file.replace(
  /<Field label="Duration">/,
  `<Field label="Type">
     <input type="text" placeholder="e.g. 3rd Semester Training" value={editInt ? editInt.type : iForm.type} onChange={e => editInt ? setEditInt(p => ({...p, type: e.target.value})) : setIForm(p => ({ ...p, type: e.target.value }))} className={INP} />
   </Field>
   <Field label="Openings">
     <input type="number" value={editInt ? editInt.openings : iForm.openings} onChange={e => editInt ? setEditInt(p => ({...p, openings: e.target.value})) : setIForm(p => ({ ...p, openings: e.target.value }))} className={INP} />
   </Field>
   <Field label="Duration">`
);

// For Courses, let's replace <Field label="Original Price (₹)"> section to inject more fields.
file = file.replace(
  /<Field label="Original Price \(₹\)">[\s\S]*?<\/Field>/,
  `<Field label="Original Price (₹)">
    <input type="number" value={editCrs ? (editCrs.originalPrice || editCrs.original_price) : cForm.originalPrice} onChange={e => editCrs ? setEditCrs(p => ({...p, originalPrice: e.target.value})) : setCForm(p => ({ ...p, originalPrice: e.target.value }))} className={INP} />
  </Field>
  <Field label="Rating (0-5)">
    <input type="number" step="0.1" value={editCrs ? editCrs.rating : cForm.rating} onChange={e => editCrs ? setEditCrs(p => ({...p, rating: e.target.value})) : setCForm(p => ({ ...p, rating: e.target.value }))} className={INP} />
  </Field>
  <Field label="Students Count">
    <input type="number" value={editCrs ? (editCrs.studentsCount || editCrs.students_count) : cForm.studentsCount} onChange={e => editCrs ? setEditCrs(p => ({...p, studentsCount: e.target.value})) : setCForm(p => ({ ...p, studentsCount: e.target.value }))} className={INP} />
  </Field>
  <Field label="Reviews Count">
    <input type="number" value={editCrs ? (editCrs.reviewsCount || editCrs.reviews_count) : cForm.reviewsCount} onChange={e => editCrs ? setEditCrs(p => ({...p, reviewsCount: e.target.value})) : setCForm(p => ({ ...p, reviewsCount: e.target.value }))} className={INP} />
  </Field>`
);

// Update blank forms with missing keys
file = file.replace(
  /const blankCrs = \{ title: '', category: 'Web Development', price: 444, originalPrice: 1499, description: '', image: '', duration: '12 Weeks', badge: 'New', level: 'All Levels' \};/,
  "const blankCrs = { title: '', category: 'Web Development', price: 444, originalPrice: 1499, description: '', image: '', duration: '12 Weeks', badge: 'New', level: 'All Levels', rating: 5.0, studentsCount: 0, reviewsCount: 1 };"
);

// We need to update addCrs payload to map rating, studentsCount, reviewsCount correctly
file = file.replace(
  /rating: 5\.0, reviews_count: 1, students_count: 0,/g,
  "rating: Number(cForm.rating || 5.0), reviews_count: Number(cForm.reviewsCount || 1), students_count: Number(cForm.studentsCount || 0),"
);

file = file.replace(
  /const payload = \{ title: editCrs\.title, category: editCrs\.category, price: Number\(editCrs\.price\), original_price: Number\(editCrs\.originalPrice \|\| editCrs\.original_price\), description: editCrs\.description, image: editCrs\.image, badge: editCrs\.badge \|\| 'New', level: editCrs\.level \|\| 'All Levels', duration: editCrs\.duration \|\| '12 Weeks' \};/,
  "const payload = { title: editCrs.title, category: editCrs.category, price: Number(editCrs.price), original_price: Number(editCrs.originalPrice || editCrs.original_price), description: editCrs.description, image: editCrs.image, badge: editCrs.badge || 'New', level: editCrs.level || 'All Levels', duration: editCrs.duration || '12 Weeks', rating: Number(editCrs.rating || 5.0), reviews_count: Number(editCrs.reviewsCount || editCrs.reviews_count || 1), students_count: Number(editCrs.studentsCount || editCrs.students_count || 0) };"
);


fs.writeFileSync('src/components/AdminDashboard.jsx', file);
console.log('UI inputs updated successfully!');
