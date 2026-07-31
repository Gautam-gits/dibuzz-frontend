import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, Printer, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';

export function CertificateVerifier({ verifiedCertificates }) {
  const [searchId, setSearchId] = useState('DBZ-2026-8891');
  const [result, setResult] = useState(verifiedCertificates['DBZ-2026-8891']);
  const [searched, setSearched] = useState(true);

  const handleVerify = (e) => {
    e?.preventDefault();
    const cleaned = searchId.trim().toUpperCase();
    if (verifiedCertificates[cleaned]) {
      setResult(verifiedCertificates[cleaned]);
    } else {
      setResult(null);
    }
    setSearched(true);
  };

  const handleQuickTest = (id) => {
    setSearchId(id);
    setResult(verifiedCertificates[id]);
    setSearched(true);
  };

  return (
    <section className="py-16 bg-slate-50 relative min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Public Certificate Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading">
            Verify ISO 9001:2015 Certificate
          </h1>
          <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto font-medium">
            Validate official completion credentials issued by DIBUZZ DIGITAL PRIVATE LIMITED.
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs mb-10">
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. DBZ-2026-8891)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm edumantra-input font-mono uppercase focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <ShieldCheck className="w-4.5 h-4.5" />
              <span>Verify ID</span>
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-semibold">
            <span>Sample Verifiable IDs:</span>
            {['DBZ-2026-8891', 'DBZ-2026-1042', 'DBZ-2026-5531'].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => handleQuickTest(id)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-mono hover:text-sky-600 hover:border-sky-300 transition-colors cursor-pointer"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Result Certificate Card */}
        {searched && (
          result ? (
            <div className="printable-area p-8 sm:p-12 rounded-3xl border-4 border-amber-400 bg-white relative shadow-xl">
              
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 gap-4">
                <Logo />
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{result.status}</span>
                </div>
              </div>

              <div className="my-8 text-center space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-extrabold">
                  OFFICIAL CERTIFICATE OF COMPLETION
                </p>
                <p className="text-sm text-slate-600 font-medium">This is to certify that</p>
                <h2 className="text-3xl sm:text-4xl font-black text-sky-900 font-heading">
                  {result.studentName}
                </h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  has successfully completed the industrial training program in
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  {result.courseTitle}
                </h3>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-700 font-mono">
                  <div className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-slate-500">ID:</span> <span className="font-bold text-sky-700">{result.certificateId}</span>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-slate-500">Issue Date:</span> <span className="font-bold text-slate-900">{result.completionDate}</span>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-slate-500">Grade:</span> <span className="font-bold text-amber-700">{result.grade}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <div className="font-bold text-slate-900">ISO 9001:2015</div>
                  <div className="text-[10px] text-slate-500">Quality Management Standard</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Govt. MCA Registered</div>
                  <div className="text-[10px] text-slate-500">{result.mcaCin}</div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="font-bold text-sky-700">DIBUZZ DIGITAL PVT LTD</div>
                  <div className="text-[10px] text-slate-500">Authorized Registry Seal</div>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-3 no-print">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Certificate</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-red-200 text-center space-y-3 shadow-xs">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 font-heading">Certificate Not Found</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                No record found for ID "<span className="font-mono text-red-600 font-bold">{searchId}</span>". Please double check the ID.
              </p>
            </div>
          )
        )}

      </div>
    </section>
  );
}
