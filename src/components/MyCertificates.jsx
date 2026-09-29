import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Download,
  LoaderCircle,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const formatDate = (dateValue) => {
  if (!dateValue) return '—';

  return new Date(`${dateValue}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export function MyCertificates({ currentUser }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const loadCertificates = useCallback(async () => {
    if (!currentUser?.id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('student_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setCertificates(data || []);
    }

    setLoading(false);
  }, [currentUser?.id]);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const downloadCertificate = async (certificate) => {
    if (certificate.status === 'revoked') {
      setMessage({
        type: 'error',
        text: 'This certificate has been revoked and cannot be downloaded.'
      });
      return;
    }

    if (!certificate.file_path) {
      setMessage({
        type: 'error',
        text: 'Certificate PDF is not available yet. Please contact support.'
      });
      return;
    }

    const { data, error } = await supabase.storage
      .from('certificates')
      .createSignedUrl(certificate.file_path, 120);

    if (error) {
      setMessage({ type: 'error', text: error.message });
      return;
    }

    const link = document.createElement('a');
    link.href = data.signedUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">My Certificates</h2>
          <p className="mt-1 text-sm text-slate-500">
            Download your official course and internship certificates.
          </p>
        </div>

        <button
          onClick={loadCertificates}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {message && (
        <div
          className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            message.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-60 items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white text-sm font-semibold text-slate-500">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading certificates…
        </div>
      ) : certificates.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4">
            <Award className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Certificates Yet</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Your official certificate will appear here after an admin issues it.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {certificates.map((certificate) => {
            const isIssued = certificate.status === 'issued';

            return (
              <article
                key={certificate.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                <div
                  className={`p-6 ${
                    isIssued
                      ? 'bg-gradient-to-br from-sky-950 via-sky-800 to-indigo-700'
                      : 'bg-gradient-to-br from-slate-700 to-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 text-white">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-200">
                        DIBUZZ Digital Private Limited
                      </p>
                      <h3 className="mt-3 text-lg font-black">
                        Certificate of Completion
                      </h3>
                    </div>
                    <Award className="h-9 w-9 text-amber-300" />
                  </div>

                  <div className="mt-8">
                    <p className="text-xs text-sky-100">Awarded to</p>
                    <p className="mt-1 text-xl font-black">{certificate.student_name}</p>
                    <p className="mt-3 text-sm font-semibold text-sky-100">
                      {certificate.program_name}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Certificate Number
                      </p>
                      <p className="mt-1 font-mono text-xs font-black text-sky-700">
                        {certificate.certificate_number}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                        isIssued
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isIssued ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5" />
                      )}
                      {certificate.status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-sky-600" />
                    Issued on {formatDate(certificate.issued_date)}
                  </div>

                  <button
                    onClick={() => downloadCertificate(certificate)}
                    disabled={!isIssued}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition-all ${
                      isIssued
                        ? 'bg-sky-600 text-white hover:bg-sky-700'
                        : 'cursor-not-allowed bg-slate-100 text-slate-400'
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    Download PDF Certificate
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}