const fs = require('fs');
let file = fs.readFileSync('src/components/PaymentModal.jsx', 'utf-8');

file = file.replace(/const \[paymentMethod, setPaymentMethod\] = useState\('upi'\);/, 
`const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');`);

file = file.replace(/const basePrice = course\.price;/, 'const basePrice = course.price || 444;');

// Replace the main return
const newReturn = `
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {!isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* VERIFICATION STEP */}
        {!showPaymentGateway && !paymentSuccessData ? (
          <div>
            <div className="p-6 sm:p-8 border-b border-slate-200 bg-slate-50">
              <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 font-bold text-xs uppercase tracking-wider mb-3 inline-block">Review Details</span>
              <h2 className="text-2xl font-black text-slate-900 font-heading">{course.title}</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">{course.category || course.type || 'Professional Training'}</p>
            </div>
            
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Applicant Details (Auto-Synced)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase mb-1">Full Name</span>
                    <span className="font-semibold text-slate-900">{currentUser?.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase mb-1">Email Address</span>
                    <span className="font-semibold text-slate-900">{currentUser?.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase mb-1">Phone Number</span>
                    <span className="font-semibold text-slate-900">{currentUser?.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 font-bold uppercase mb-1">College & Branch</span>
                    <span className="font-semibold text-slate-900\">{currentUser?.collegeName || currentUser?.college_name || 'N/A'} - {currentUser?.branch || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-sky-600 font-bold uppercase tracking-wider">Total Payable Amount</div>
                  <div className="text-2xl font-black text-slate-900">₹{basePrice}</div>
                </div>
                <button
                  onClick={() => setShowPaymentGateway(true)}
                  className="px-6 py-3 rounded-xl bg-sky-600 text-white text-sm font-bold shadow-md hover:bg-sky-700 transition-all cursor-pointer"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
`;

file = file.replace(
  /<div className=\"fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900\/50 backdrop-blur-xs overflow-y-auto\">[\s\S]*?(?=<!-- Header -->|\{\/\* Header \*\/})/,
  newReturn
);

// Close the wrapper div at the end
file = file.replace(
  /<\/div>\s*<\/div>\s*\)\;\s*\}\s*$/,
  "      </div>\n    </div>\n    </div>\n    </div>\n  );\n}"
);

fs.writeFileSync('src/components/PaymentModal.jsx', file);
