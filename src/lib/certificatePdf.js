import { jsPDF } from 'jspdf';

const formatDate = (dateValue) => {
  const date = dateValue ? new Date(`${dateValue}T00:00:00`) : new Date();

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export function createCertificatePdf({
  certificateNumber,
  studentName,
  programName,
  certificateType,
  issuedDate
}) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const navy = [12, 45, 92];
  const blue = [37, 99, 235];
  const gold = [202, 138, 4];

  // Background and double border
  doc.setFillColor(250, 252, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setDrawColor(...navy);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Brand heading
  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('DIBUZZ DIGITAL PRIVATE LIMITED', pageWidth / 2, 31, {
    align: 'center'
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('IDEAS  •  BRANDS  •  RESULTS', pageWidth / 2, 38, {
    align: 'center'
  });

  doc.setDrawColor(...gold);
  doc.setLineWidth(0.8);
  doc.line(112, 43, 185, 43);

  // Certificate title
  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(25);
  doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 60, {
    align: 'center'
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...blue);
  doc.text(
    certificateType === 'internship'
      ? 'INTERNSHIP PROGRAM'
      : 'PROFESSIONAL COURSE PROGRAM',
    pageWidth / 2,
    68,
    { align: 'center' }
  );

  // Student and programme
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('This is to certify that', pageWidth / 2, 84, {
    align: 'center'
  });

  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(studentName, pageWidth / 2, 99, {
    align: 'center',
    maxWidth: 240
  });

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(
    certificateType === 'internship'
      ? 'has successfully completed the internship program in'
      : 'has successfully completed the professional course in',
    pageWidth / 2,
    113,
    { align: 'center' }
  );

  doc.setTextColor(...blue);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);

  const programLines = doc.splitTextToSize(programName, 210);
  doc.text(programLines, pageWidth / 2, 126, {
    align: 'center'
  });

  // Certificate information
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(52, 143, 193, 22, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('CERTIFICATE NO.', 72, 151, { align: 'center' });
  doc.text('ISSUE DATE', 148, 151, { align: 'center' });
  doc.text('VERIFICATION', 224, 151, { align: 'center' });

  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(certificateNumber, 72, 159, { align: 'center' });
  doc.text(formatDate(issuedDate), 148, 159, { align: 'center' });
  doc.text('dibuzz.in/#verify', 224, 159, { align: 'center' });

  // Signature area
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.3);
  doc.line(48, 181, 105, 181);
  doc.line(192, 181, 249, 181);

  doc.setTextColor(...navy);
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(15);
  doc.text('Gautam Kumar', 76.5, 176, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('AUTHORIZED SIGNATORY', 76.5, 188, { align: 'center' });
  doc.text('DIBUZZ DIGITAL PRIVATE LIMITED', 220.5, 188, {
    align: 'center'
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'This certificate can be verified using its unique certificate number on the DIBUZZ public registry.',
    pageWidth / 2,
    199,
    { align: 'center' }
  );

  return doc.output('blob');
}