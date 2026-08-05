const fs = require('fs');
let file = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf-8');

// Add company and mode fields to Internship form
file = file.replace(
  /<Field label="Stipend">/,
  `<Field label="Company">
    <input type="text" value={editInt ? editInt.company : iForm.company} onChange={e => editInt ? setEditInt(p => ({...p, company: e.target.value})) : setIForm(p => ({ ...p, company: e.target.value }))} className={INP} />
  </Field>
  <Field label="Mode">
    <input type="text" value={editInt ? editInt.mode : iForm.mode} onChange={e => editInt ? setEditInt(p => ({...p, mode: e.target.value})) : setIForm(p => ({ ...p, mode: e.target.value }))} className={INP} />
  </Field>
  <Field label="Stipend">`
);

// Add duration, badge, and level fields to Course form
file = file.replace(
  /<Field label="Price \(₹\)">/,
  `<Field label="Duration">
    <input type="text" placeholder="e.g. 12 Weeks" value={editCrs ? editCrs.duration : cForm.duration} onChange={e => editCrs ? setEditCrs(p => ({...p, duration: e.target.value})) : setCForm(p => ({ ...p, duration: e.target.value }))} className={INP} />
  </Field>
  <Field label="Badge">
    <input type="text" placeholder="e.g. New" value={editCrs ? editCrs.badge : cForm.badge} onChange={e => editCrs ? setEditCrs(p => ({...p, badge: e.target.value})) : setCForm(p => ({ ...p, badge: e.target.value }))} className={INP} />
  </Field>
  <Field label="Level">
    <input type="text" placeholder="e.g. All Levels" value={editCrs ? editCrs.level : cForm.level} onChange={e => editCrs ? setEditCrs(p => ({...p, level: e.target.value})) : setCForm(p => ({ ...p, level: e.target.value }))} className={INP} />
  </Field>
  <Field label="Price (₹)">`
);

fs.writeFileSync('src/components/AdminDashboard.jsx', file);
console.log('UI inputs updated!');
