const fs = require('fs');
let file = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf-8');

// Add refreshData prop
file = file.replace(/export function AdminDashboard\(\{(.*?)\}\) \{/s, (m, p1) => {
  return 'export function AdminDashboard({' + p1 + ', refreshData}) {';
});

// Update the manual refresh button
file = file.replace(
  /const refresh = async \(\) => \{[\s\S]*?\};/,
  `const refresh = async () => {
    setBusy(true);
    if (refreshData) await refreshData();
    add('Data synced with Supabase!', 'success');
    setBusy(false);
  };`
);

// Inject refreshData() call after every successful DB operation
const replacements = [
  { search: /add\('Internship published! \([^)]+\)', 'success'\);/, replace: "if (refreshData) refreshData(); add('Internship published!', 'success');" },
  { search: /add\('Internship updated!', 'success'\);/, replace: "if (refreshData) refreshData(); add('Internship updated!', 'success');" },
  { search: /add\('Internship deleted!', 'success'\);/, replace: "if (refreshData) refreshData(); add('Internship deleted!', 'success');" },
  { search: /add\('Course published!', 'success'\);/, replace: "if (refreshData) refreshData(); add('Course published!', 'success');" },
  { search: /add\('Course updated!', 'success'\);/, replace: "if (refreshData) refreshData(); add('Course updated!', 'success');" },
  { search: /add\('Course deleted!', 'success'\);/, replace: "if (refreshData) refreshData(); add('Course deleted!', 'success');" },
  { search: /add\('User created successfully!', 'success'\);/, replace: "if (refreshData) refreshData(); add('User created successfully!', 'success');" },
  { search: /add\('User deleted!', 'success'\);/, replace: "if (refreshData) refreshData(); add('User deleted!', 'success');" },
  { search: /add\('FAQ Added!', 'success'\);/, replace: "if (refreshData) refreshData(); add('FAQ Added!', 'success');" },
  { search: /add\('FAQ Updated!', 'success'\);/, replace: "if (refreshData) refreshData(); add('FAQ Updated!', 'success');" },
  { search: /add\('FAQ Deleted!', 'success'\);/, replace: "if (refreshData) refreshData(); add('FAQ Deleted!', 'success');" }
];

replacements.forEach(r => {
  file = file.replace(r.search, r.replace);
});

fs.writeFileSync('src/components/AdminDashboard.jsx', file);
console.log('AdminDashboard updated with refreshData injection!');
