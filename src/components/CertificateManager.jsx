import React, { useCallback, useEffect, useState } from 'react';
import {
  Award,
  Ban,
  CheckCircle2,
  Download,
  FilePlus2,
  LoaderCircle,
  RefreshCw,
  Search,
  X
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createCertificatePdf, preloadCertificateImages } from '../lib/certificatePdf';

const initialForm = {
  studentId: '',
  programName: '',
  certificateType: 'internship',
  collegeName: '',
  regRollNo: '',
  startDate: '',
  endDate: '',
  grade: 'A'
};

const formatDate = (dateValue) => {
  if (!dateValue) return '—';

  return new Date(`${dateValue}T00:00:00`).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export function CertificateManager() {
  const [certificates, setCertificates] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    window.setTimeout(() => setMessage(null), 4500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);

    const [certificateResponse, studentResponse] = await Promise.all([
      supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('role', 'student')
        .order('full_name', { ascending: true })
    ]);

    if (certificateResponse.error) {
      showMessage(certificateResponse.error.message, 'error');
    } else {
      setCertificates(certificateResponse.data || []);
    }

    if (studentResponse.error) {
      showMessage(studentResponse.error.message, 'error');
    } else {
      setStudents(studentResponse.data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const issueCertificate = async (event) => {
    event.preventDefault();

    const selectedStudent = students.find((student) => student.id === form.studentId);

    if (!selectedStudent || !form.programName.trim()) {
      showMessage('Please select a student and enter the program name.', 'error');
      return;
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      showMessage('End date cannot be before the start date.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const {
        data: { user: adminUser }
      } = await supabase.auth.getUser();

      if (!adminUser) {
        throw new Error('Admin session not found. Please sign in again.');
      }

      const { data: certificate, error: createError } = await supabase
        .from('certificates')
        .insert({
          student_id: selectedStudent.id,
          student_name: selectedStudent.full_name || selectedStudent.email,
          program_name: form.programName.trim(),
          certificate_type: form.certificateType,
          college_name: form.collegeName.trim(),
          reg_roll_no: form.regRollNo.trim(),
          start_date: form.startDate,
          end_date: form.endDate,
          grade: form.grade,
          issued_by: adminUser.id
        })
        .select()
        .single();

      if (createError) throw createError;

      // Load MSME / ISO / MCA / logo images from /public so they appear in the PDF
      const images = await preloadCertificateImages();

      const pdfBlob = createCertificatePdf({
        certificateNumber: certificate.certificate_number,
        studentName: certificate.student_name,
        programName: certificate.program_name,
        collegeName: form.collegeName.trim(),
        regRollNo: form.regRollNo.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        grade: form.grade,
        certificateType: certificate.certificate_type,
        issuedDate: certificate.issued_date,
        images
      });

      const filePath = `${selectedStudent.id}/${certificate.certificate_number}.pdf`;

      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(filePath, pdfBlob, {
          contentType: 'application/pdf',
          upsert: false
        });

      if (uploadError) {
        await supabase.from('certificates').delete().eq('id', certificate.id);
        throw uploadError;
      }

      const { error: updateError } = await supabase
        .from('certificates')
        .update({ file_path: filePath })
        .eq('id', certificate.id);

      if (updateError) {
        // Roll back so we never keep a certificate row without a file path
        await supabase.storage.from('certificates').remove([filePath]);
        await supabase.from('certificates').delete().eq('id', certificate.id);
        throw updateError;
      }

      setForm(initialForm);
      setShowIssueModal(false);
      showMessage(
        `Certificate ${certificate.certificate_number} issued to ${certificate.student_name}. It is now visible in their dashboard.`
      );
      await loadData();
    } catch (error) {
      showMessage(error.message || 'Certificate could not be issued.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadCertificate = async (certificate) => {
    if (!certificate.file_path) {
      showMessage('PDF file is not available for this certificate.', 'error');
      return;
    }

    const { data, error } = await supabase.storage
      .from('certificates')
      .createSignedUrl(certificate.file_path, 120);

    if (error) {
      showMessage(error.message, 'error');
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

  const revokeCertificate = async (certificate) => {
    const confirmed = window.confirm(
      `Revoke certificate ${certificate.certificate_number}? It will no longer show as valid and the student will not be able to download it.`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('certificates')
      .update({ status: 'revoked' })
      .eq('id', certificate.id);

    if (error) {
      showMessage(error.message, 'error');
      return;
    }

    showMessage('Certificate revoked.');
    await loadData();
  };

  const visibleCertificates = certificates.filter((certificate) => {
    const text = search.toLowerCase();

    return (
      (certificate.student_name || '').toLowerCase().includes(text) ||
      (certificate.program_name || '').toLowerCase().includes(text) ||
      (certificate.certificate_number || '').toLowerCase().includes(text)
    );
  });

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
            message.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">Certificates</h2>
          <p className="mt-1 text-sm text-slate-500">
            Issue, download and revoke official student certificates.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            onClick={() => setShowIssueModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-violet-700"
          >
            <FilePlus2 className="h-4 w-4" />
            Issue Certificate
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by student, programme or certificate number"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm font-semibold text-slate-500">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Loading certificates…
          </div>
        ) : visibleCertificates.length === 0 ? (
          <div className="p-12 text-center">
            <Award className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 font-bold text-slate-900">No certificates yet</h3>
            <p className="mt-1 text-sm text-slate-500">
              Issue the first certificate from the button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Programme</th>
                  <th className="px-4 py-3">Certificate No.</th>
                  <th className="px-4 py-3">Issued</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleCertificates.map((certificate) => (
                  <tr key={certificate.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {certificate.student_name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="block font-medium">{certificate.program_name}</span>
                      <span className="text-[10px] uppercase text-slate-400">
                        {certificate.certificate_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-violet-700">
                      {certificate.certificate_number}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(certificate.issued_date)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-[10px] font-black uppercase ${
                          certificate.status === 'issued'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {certificate.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => downloadCertificate(certificate)}
                          className="inline-flex items-center gap-1 rounded-lg bg-sky-50 px-2.5 py-1.5 font-bold text-sky-700 hover:bg-sky-100"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </button>

                        {certificate.status === 'issued' && (
                          <button
                            onClick={() => revokeCertificate(certificate)}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 font-bold text-red-700 hover:bg-red-100"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showIssueModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <form
            onSubmit={issueCertificate}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5"
          >
            <div className="sticky top-0 -mt-2 -mx-2 pt-2 pb-4 bg-white/95 backdrop-blur z-10 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-50 p-2.5 text-violet-700">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Issue Certificate</h3>
                  <p className="text-xs text-slate-500">
                    The certificate will appear in the student's dashboard.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">
                  Select Student <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.studentId}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      studentId: event.target.value
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                >
                  <option value="">Choose a student from list…</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.full_name || student.email} ({student.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Course / Domain Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.programName}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        programName: event.target.value
                      }))
                    }
                    placeholder="e.g. Machine Learning"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Certificate Type
                  </label>
                  <select
                    value={form.certificateType}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        certificateType: event.target.value
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                  >
                    <option value="internship">Internship Completion</option>
                    <option value="course">Course Completion</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    College / Institute Name
                  </label>
                  <input
                    required
                    value={form.collegeName}
                    onChange={(e) => setForm((prev) => ({ ...prev, collegeName: e.target.value }))}
                    placeholder="e.g. MIT Muzaffarpur"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">
                    Reg. / Roll No.
                  </label>
                  <input
                    required
                    value={form.regRollNo}
                    onChange={(e) => setForm((prev) => ({ ...prev, regRollNo: e.target.value }))}
                    placeholder="e.g. 24106107902"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">Start Date</label>
                  <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700">End Date</label>
                  <input
                    required
                    type="date"
                    min={form.startDate || undefined}
                    value={form.endDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Grade Awarded</label>
                <select
                  value={form.grade}
                  onChange={(e) => setForm((prev) => ({ ...prev, grade: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 transition"
                >
                  <option value="A+">Grade A+ (Outstanding)</option>
                  <option value="A">Grade A (Excellent)</option>
                  <option value="B+">Grade B+ (Very Good)</option>
                  <option value="B">Grade B (Good)</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 hover:bg-violet-700 transition disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Generating Certificate PDF…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Generate & Issue Certificate
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}