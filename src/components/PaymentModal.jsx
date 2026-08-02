import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, QrCode, CreditCard, Building, Lock, Printer, BookOpen, Award, Clock, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

export function PaymentModal({ course, currentUser, onClose, onPaymentSuccess, companyInfo }) {
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [coupon, setCoupon] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(1);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);
  
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editCollege, setEditCollege] = useState(currentUser ? `${currentUser.collegeName || currentUser.college_name || ''} - ${currentUser.branch || ''}` : '');

  const [cardNumber, setCardNumber] = useState('4532 1289 9012 3456');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('789');
  const [cardName, setCardName] = useState(currentUser ? currentUser.name : 'Manan Sharma');
  const [upiId, setUpiId] = useState(currentUser ? `${currentUser.email.split('@')[0]}@upi` : 'student@upi');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!course) return null;

  const basePrice = course.price || 444;
  const discountAmount = discountApplied ? Math.round(basePrice * 0.1) : 0;
  const taxableAmount = basePrice - discountAmount;
  const gstAmount = Math.round(taxableAmount * 0.18);
  const finalTotal = taxableAmount + gstAmount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'DIBUZZ10') {
      setDiscountApplied(true);
    } else {
      alert('Invalid Coupon Code! Try using "DIBUZZ10" for 10% off.');
    }
  };

  const handlePay = () => {
    setIsProcessing(true);
    setProcessStep(1);

    setTimeout(() => setProcessStep(2), 1000);
    setTimeout(() => setProcessStep(3), 2200);

    setTimeout(() => {
      setIsProcessing(false);
      const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      const receiptData = {
        txnId,
        date: new Date().toLocaleString(),
        amount: finalTotal,
        method: paymentMethod === 'upi' ? `UPI (${upiId})` : paymentMethod === 'card' ? 'Credit Card (Visa)' : `Netbanking (${selectedBank})`,
        courseTitle: course.title,
        studentName: editName || (currentUser ? currentUser.name : cardName),
        studentEmail: editEmail || (currentUser ? currentUser.email : 'student@dibuzz.com')
      };

      setPaymentSuccessData(receiptData);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }

      onPaymentSuccess(course.id, receiptData);
    }, 3200);
  };

  return (
    
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

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Applicant Details (Auto-Synced)</h3>
                
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
{/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading">DIBUZZ SafePay Gateway</h2>
              <p className="text-xs text-slate-300 font-normal">256-Bit SSL Encrypted Official Payment Portal</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400 font-bold bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ISO Certified Billing</span>
          </div>
        </div>

        {/* Success */}
        {paymentSuccessData ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 font-heading">Payment Approved!</h3>
              <p className="text-sm text-slate-600 mt-1">
                You are enrolled in <strong className="text-slate-900">{course.title}</strong>
              </p>
            </div>

            {/* Receipt Box */}
            <div className="printable-area max-w-lg mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-3 font-mono">
              <div className="flex justify-between pb-3 border-b border-slate-200">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-bold text-sky-700">{paymentSuccessData.txnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name</span>
                <span className="text-slate-900 font-bold">{paymentSuccessData.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Course Program</span>
                <span className="text-slate-800">{course.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode</span>
                <span className="text-slate-700">{paymentSuccessData.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time</span>
                <span className="text-slate-700">{paymentSuccessData.date}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200 text-sm">
                <span className="text-slate-600 font-bold">Total Paid (incl. GST)</span>
                <span className="font-black text-slate-900">₹{paymentSuccessData.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-all cursor-pointer"
              >
                Go to Learning Portal
              </button>
            </div>
          </div>
        ) : isProcessing ? (
          /* Processing Loader */
          <div className="p-12 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin"></div>
              <Lock className="w-6 h-6 text-sky-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 font-heading">Processing Payment...</h3>
              <p className="text-xs text-slate-500 font-medium">Please do not close or refresh this window.</p>
            </div>

            <div className="max-w-md mx-auto space-y-2 text-xs">
              <div className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${processStep >= 1 ? 'bg-sky-50 border-sky-200 text-sky-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <CheckCircle2 className={`w-4 h-4 ${processStep >= 1 ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Step 1: Connecting to Banking Gateway...</span>
              </div>
              <div className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${processStep >= 2 ? 'bg-sky-50 border-sky-200 text-sky-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <CheckCircle2 className={`w-4 h-4 ${processStep >= 2 ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Step 2: Authorizing Payment Transaction...</span>
              </div>
              <div className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${processStep >= 3 ? 'bg-sky-50 border-sky-200 text-sky-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <CheckCircle2 className={`w-4 h-4 ${processStep >= 3 ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Step 3: Generating Official GST Tax Receipt...</span>
              </div>
            </div>
          </div>
        ) : (
          /* Form View */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            <div className="md:col-span-7 p-6 space-y-6 border-b md:border-b-0 md:border-r border-slate-200">
              
              {/* Switcher */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${paymentMethod === 'upi' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${paymentMethod === 'card' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${paymentMethod === 'netbanking' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Building className="w-4 h-4" />
                  <span>Netbanking</span>
                </button>
              </div>

              {/* UPI */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                    <p className="text-xs text-slate-600 font-semibold">Scan QR code using GPay, PhonePe, Paytm, or BHIM</p>
                    <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-200 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                        <rect x="10" y="10" width="25" height="25" fill="#0f172a"/>
                        <rect x="15" y="15" width="15" height="15" fill="#ffffff"/>
                        <rect x="65" y="10" width="25" height="25" fill="#0f172a"/>
                        <rect x="70" y="15" width="15" height="15" fill="#ffffff"/>
                        <rect x="10" y="65" width="25" height="25" fill="#0f172a"/>
                        <rect x="15" y="70" width="15" height="15" fill="#ffffff"/>
                        <rect x="40" y="40" width="20" height="20" fill="#0284c7"/>
                        <rect x="45" y="15" width="10" height="20" fill="#0f172a"/>
                        <rect x="70" y="55" width="20" height="10" fill="#0f172a"/>
                        <rect x="40" y="70" width="15" height="20" fill="#0f172a"/>
                        <rect x="65" y="75" width="20" height="15" fill="#0f172a"/>
                      </svg>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono font-bold">DIBUZZ DIGITAL PVT LTD @ HDFC</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Or Enter VPA / UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobileNumber@upi"
                      className="w-full px-3.5 py-2.5 text-xs edumantra-input"
                    />
                  </div>
                </div>
              )}

              {/* Card */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3.5 py-2.5 edumantra-input"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 edumantra-input font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 edumantra-input font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">CVV Code</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        maxLength={4}
                        className="w-full px-3.5 py-2.5 edumantra-input font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Netbanking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3 text-xs">
                  <label className="block font-semibold text-slate-700">Select Bank</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${selectedBank === bank ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Summary */}
            <div className="md:col-span-5 p-6 bg-slate-50 flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 font-heading">Order Summary</h3>
                
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 mb-4 shadow-xs">
                  <p className="text-xs font-bold text-sky-800 line-clamp-2">{course.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1 font-medium">{course.duration} | {course.category}</p>
                </div>

                {/* Coupon */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Coupon (Try DIBUZZ10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    disabled={discountApplied}
                    className="flex-1 px-3 py-2 text-xs rounded-xl edumantra-input uppercase font-mono"
                  />
                  <button
                    type="submit"
                    disabled={discountApplied}
                    className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    {discountApplied ? 'Applied' : 'Apply'}
                  </button>
                </form>

                {/* Itemization */}
                <div className="space-y-2 text-xs text-slate-700 border-t border-slate-200 pt-3 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Course Fee:</span>
                    <span>₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Promo Discount (10%):</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">GST (18% Govt Tax):</span>
                    <span>+₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                    <span>Total Payable:</span>
                    <span className="text-sky-700">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <div>
                <button
                  onClick={handlePay}
                  className="w-full py-3.5 rounded-xl font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{finalTotal.toLocaleString('en-IN')}</span>
                </button>
                <p className="text-[10px] text-center text-slate-500 mt-2 font-semibold">
                  {companyInfo.name} ({companyInfo.registration})
                </p>
              </div>

            </div>

          </div>
        )}

            </div>
        )}
      </div>
    </div>
  );
}