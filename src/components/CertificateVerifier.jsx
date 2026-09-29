import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, CheckCircle2, Printer, AlertCircle, LoaderCircle, XCircle } from 'lucide-react';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';

const formatDate = (value) => {
  if (!value) return '—';
  const dateOnly = String(value).slice(0, 10);
  return new Date(`${dateOnly}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export function CertificateVerifier({ companyInfo }) {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyById = async (rawId) => {
    const cleaned = (rawId || '').trim().toUpperCase();
    if (!cleaned) return;

    setLoading(true);
    setError('');
    setResult(null);

    const { data, error: rpcError } = await supabase.rpc('verify_certificate', {
      p_certificate_number: cleaned
    });

    if (rpcError) {
      setError('Verification service is unavailable right now. Please try again in a moment.');
    } else {
      setResult(data && data.length > 0 ? data[0] : null);
    }

    setSearched(true);
    setLoading(false);
  };

  const handleVerify = (e) => {
    e?.preventDefault();
    verifyById(searchId);
  };

  // Link se aane par auto-verify: /verify?id=DBZ-2026-XXXX (ya ?cert=)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idFromUrl = params.get('id') || params.get('cert');
    if (idFromUrl) {
      setSearchId(idFromUrl.toUpperCase());
      verifyById(idFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValid = result?.status === 'issued';
  const typeLabel = result?.certificate_type === 'course' ? 'course' : 'internship';

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
            Verify MCA & MSME Recognized Certificate
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
                placeholder="Enter Certificate ID (e.g. DBZ-2026-6D01DBE5)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-sm edumantra-input font-mono uppercase focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchId.trim()}
              className="px-6 py-3 rounded-xl font-extrabold text-white bg-sky-600 hover:bg-sky-700 shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoaderCircle className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <ShieldCheck className="w-4.5 h-4.5" />
              )}
              <span>{loading ? 'Checking…' : 'Verify ID'}</span>
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-500 font-medium">
            The Certificate ID is printed at the top-left and bottom of your certificate.
          </p>
        </div>

        {/* Service error */}
        {error && (
          <div className="bg-white p-6 rounded-2xl border border-amber-200 text-center shadow-xs">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <p className="text-sm text-slate-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Result */}
        {!error && searched && !loading && (
          result ? (
            <div
              className={`printable-area p-8 sm:p-12 rounded-3xl border-4 bg-white relative shadow-xl ${
                isValid ? 'border-amber-400' : 'border-red-300'
              }`}
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 gap-4">
                <Logo />
                {isValid ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Valid Certificate</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-800 border border-red-300 text-xs font-bold">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Revoked</span>
                  </div>
                )}
              </div>

              {!isValid && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 text-center">
                  This certificate has been revoked by the issuing organisation and is no longer valid.
                </div>
              )}

              <div className="my-8 text-center space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-extrabold">
                  OFFICIAL CERTIFICATE OF COMPLETION
                </p>
                <p className="text-sm text-slate-600 font-medium">This is to certify that</p>
                <h2 className="text-3xl sm:text-4xl font-black text-sky-900 font-heading">
                  {result.student_name}
                </h2>
                {result.college_name && (
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    student of <span className="font-bold text-slate-800">{result.college_name}</span>
                  </p>
                )}
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  has successfully completed the {typeLabel} program in
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  {result.program_name}
                </h3>

                {result.start_date && result.end_date && (
                  <p className="text-xs text-slate-500 font-semibold">
                    {formatDate(result.start_date)} to {formatDate(result.end_date)}
                  </p>
                )}

                <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-700 font-mono">
                  <div className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-slate-500">ID:</span>{' '}
                    <span className="font-bold text-sky-700">{result.certificate_number}</span>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                    <span className="text-slate-500">Issue Date:</span>{' '}
                    <span className="font-bold text-slate-900">{formatDate(result.issued_date)}</span>
                  </div>
                  {result.grade && (
                    <div className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200">
                      <span className="text-slate-500">Grade:</span>{' '}
                      <span className="font-bold text-amber-700">{result.grade}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <div className="font-bold text-slate-900">MCA & MSME Recognized</div>
                  <div className="text-[10px] text-slate-500">Quality Management Standard</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900">Govt. MCA Registered</div>
                  <div className="text-[10px] text-slate-500">{companyInfo?.cin || 'Dibuzz Digital Private Limited'}</div>
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
                  <span>Print Verification</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-red-200 text-center space-y-3 shadow-xs">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 font-heading">Certificate Not Found</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                No record found for ID "<span className="font-mono text-red-600 font-bold">{searchId.trim().toUpperCase()}</span>". Please double check the ID.
              </p>
            </div>
          )
        )}

      </div>
    </section>
  );
}