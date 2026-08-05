const fs = require('fs');
let file = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf-8');

// Update blankInt
file = file.replace(
  /const blankInt = \{.*?\};/,
  "const blankInt = { title: '', company: 'DIBUZZ DIGITAL', type: '3rd Semester Training', stipend: 'Flat ₹444', mode: 'Online', duration: '4 to 6 Weeks', openings: 25, badge: '3rd Sem', description: '', image: '', skills: '' };"
);

// Update blankCrs
file = file.replace(
  /const blankCrs = \{.*?\};/,
  "const blankCrs = { title: '', category: 'Web Development', price: 444, originalPrice: 1499, description: '', image: '', duration: '12 Weeks', badge: 'New', level: 'All Levels' };"
);

// Update addCrs payload to use cForm values
file = file.replace(
  /badge: 'New', level: 'All Levels', duration: '12 Weeks'/g,
  "badge: cForm.badge || 'New', level: cForm.level || 'All Levels', duration: cForm.duration || '12 Weeks'"
);

fs.writeFileSync('src/components/AdminDashboard.jsx', file);
console.log('AdminDashboard state updated');
