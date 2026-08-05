import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/components/AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Theming replacements (Dark to Light)
const replacements = [
  // Backgrounds
  { search: /bg-\[\#080b14\]/g, replace: 'bg-slate-50' },
  { search: /bg-slate-900\/90/g, replace: 'bg-white/90' },
  { search: /bg-slate-900\/80/g, replace: 'bg-slate-50/80' },
  { search: /bg-slate-900/g, replace: 'bg-white' },
  
  { search: /bg-slate-800\/80/g, replace: 'bg-white' },
  { search: /bg-slate-800\/60/g, replace: 'bg-slate-50' },
  { search: /bg-slate-800/g, replace: 'bg-white' },
  
  { search: /bg-slate-700\/30/g, replace: 'bg-slate-100/50' },
  { search: /bg-slate-700/g, replace: 'bg-slate-100' },
  
  // Text Colors
  { search: /text-slate-100/g, replace: 'text-slate-900' },
  { search: /text-white/g, replace: 'text-slate-900' },
  { search: /text-slate-200/g, replace: 'text-slate-800' },
  { search: /text-slate-300/g, replace: 'text-slate-700' },
  { search: /text-slate-400/g, replace: 'text-slate-600' },
  { search: /text-slate-500/g, replace: 'text-slate-500' }, // leave 500

  // Borders
  { search: /border-slate-800\/80/g, replace: 'border-slate-200/80' },
  { search: /border-slate-700\/80/g, replace: 'border-slate-200/80' },
  { search: /border-slate-700\/60/g, replace: 'border-slate-200/60' },
  { search: /border-slate-700\/50/g, replace: 'border-slate-200/50' },
  { search: /border-slate-700\/40/g, replace: 'border-slate-200/40' },
  { search: /border-slate-700/g, replace: 'border-slate-200' },
  { search: /border-slate-600/g, replace: 'border-slate-300' },
  
  // Specific tweaks
  { search: /bg-gradient-to-br from-slate-800 to-slate-900/g, replace: 'bg-gradient-to-br from-white to-slate-50' },
  { search: /shadow-violet-950\/50/g, replace: 'shadow-violet-200' },
  { search: /shadow-violet-950\/40/g, replace: 'shadow-violet-200' },
  { search: /bg-violet-500\/10/g, replace: 'bg-violet-100' },
  { search: /text-violet-300/g, replace: 'text-violet-700' },
  { search: /text-indigo-300/g, replace: 'text-indigo-700' },
  { search: /text-emerald-300/g, replace: 'text-emerald-700' },
  { search: /text-red-300/g, replace: 'text-red-700' },
  { search: /text-amber-300/g, replace: 'text-amber-700' },
  { search: /text-violet-200/g, replace: 'text-violet-800' },
  
  // Inputs
  { search: /placeholder-slate-600/g, replace: 'placeholder-slate-400' },
];

let newContent = content;
for (const rep of replacements) {
  newContent = newContent.replace(rep.search, rep.replace);
}

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('Theme updated successfully.');
