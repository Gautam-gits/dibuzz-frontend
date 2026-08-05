const fs = require('fs');

let file = fs.readFileSync('src/components/PaymentModal.jsx', 'utf-8');

// Update imports
file = file.replace(
  /import \{ X, ShieldCheck, CheckCircle2, QrCode, CreditCard, Building, Lock, Printer \} from 'lucide-react';/,
  "import { X, ShieldCheck, CheckCircle2, QrCode, CreditCard, Building, Lock, Printer, BookOpen, Award, Clock, Star } from 'lucide-react';"
);

// Add state variables
file = file.replace(
  /const \[paymentSuccessData, setPaymentSuccessData\] = useState\(null\);/,
  `const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editCollege, setEditCollege] = useState(currentUser ? \`\${currentUser.collegeName || currentUser.college_name || ''} - \${currentUser.branch || ''}\` : '');`
);

// Fix handlePay to use the edited values
file = file.replace(
  /studentName: currentUser \? currentUser\.name : cardName,/,
  "studentName: editName || (currentUser ? currentUser.name : cardName),"
);
file = file.replace(
  /studentEmail: currentUser \? currentUser\.email : 'student@dibuzz\.com'/,
  "studentEmail: editEmail || (currentUser ? currentUser.email : 'student@dibuzz.com')"
);

// Update Review Details UI
const newReviewUI = `
            <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50">
              <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 font-bold text-xs uppercase tracking-wider mb-3 inline-block">Review Details</span>
              <h2 className="text-2xl font-black text-slate-900 font-heading">{course.title}</h2>
              <p className="text-sm text-slate-500 font-medium mt-1 mb-5">{course.category || course.type || 'Professional Training'}</p>
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-sm">
                <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">Program Overview</h4>
                <p className="text-slate-600 mb-4 text-xs leading-relaxed">{course.description || 'Join this premium program to accelerate your career and gain industry-relevant skills. Lifetime access included.'}</p>
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                   <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-sky-600"/> <span>{course.duration || 'Flexible Duration'}</span></div>
                   <div className="flex items-center gap-2"><Award className="w-4 h-4 text-emerald-600"/> <span>ISO Certified</span></div>
                   {course.stipend && <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-purple-600"/> <span>Stipend: {course.stipend}</span></div>}
                   {course.skills && <div className="flex items-center gap-2"><Star className="w-4 h-4 text-orange-500"/> <span>{course.skills.length} Core Skills</span></div>}
                </div>
              </div>
            </div>
`;

file = file.replace(
  /<div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50">[\s\S]*?<\/div>\s*<div className="p-6 sm:p-8 space-y-6">/,
  newReviewUI + '\n            <div className="p-6 sm:p-8 space-y-6">'
);

// Update Editable Inputs to use state and onChange
const editableInputs = `
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs text-slate-500 font-bold uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 font-bold uppercase mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 font-bold uppercase mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 font-bold uppercase mb-1">College & Branch</label>
                    <input 
                      type="text" 
                      value={editCollege}
                      onChange={(e) => setEditCollege(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-sm"
                    />
                  </div>
                </div>
`;

file = file.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">[\s\S]*?<\/div>\s*<\/div>\s*<div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-center justify-between">/,
  editableInputs + '\n              </div>\n              \n              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-center justify-between">'
);

fs.writeFileSync('src/components/PaymentModal.jsx', file);
