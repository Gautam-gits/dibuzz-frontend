import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

/* ---------- Helpers ---------- */

// Letter-spacing wala text ekdum sahi centre me draw karta hai.
function drawSpacedCentered(doc, text, centerX, y, charSpace = 0) {
  const w = doc.getTextWidth(text) + charSpace * (text.length - 1);
  doc.text(text, centerX - w / 2, y, { charSpace });
}

// Centred, word-wrapped paragraph made of mixed-style pieces.
function drawRichParagraph(doc, segments, centerX, startY, maxWidth, lineHeight, fontSize) {
  doc.setFontSize(fontSize);

  const words = [];
  let current = [];
  segments.forEach(({ text, font = 'times', style = 'normal', color = [50, 50, 50] }) => {
    text.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        if (current.length) words.push(current);
        current = [];
      } else {
        current.push({ text: part, font, style, color });
      }
    });
  });
  if (current.length) words.push(current);

  const measure = (piece) => {
    doc.setFont(piece.font, piece.style);
    return doc.getTextWidth(piece.text);
  };
  const wordWidth = (w) => w.reduce((sum, p) => sum + measure(p), 0);

  doc.setFont('times', 'normal');
  const spaceW = doc.getTextWidth(' ');

  const lines = [];
  let line = [];
  let lineW = 0;
  words.forEach((w) => {
    const ww = wordWidth(w);
    const needed = line.length ? lineW + spaceW + ww : ww;
    if (needed > maxWidth && line.length) {
      lines.push({ words: line, width: lineW });
      line = [w];
      lineW = ww;
    } else {
      line.push(w);
      lineW = needed;
    }
  });
  if (line.length) lines.push({ words: line, width: lineW });

  lines.forEach((ln, i) => {
    let x = centerX - ln.width / 2;
    const y = startY + i * lineHeight;
    ln.words.forEach((w, wi) => {
      w.forEach((p) => {
        doc.setFont(p.font, p.style);
        doc.setTextColor(...p.color);
        doc.text(p.text, x, y);
        x += doc.getTextWidth(p.text);
      });
      if (wi < ln.words.length - 1) x += spaceW;
    });
  });

  return startY + lines.length * lineHeight;
}

function drawImageSafe(doc, src, x, y, w, h) {
  try {
    let format = 'PNG';
    const m = typeof src === 'string' && src.match(/^data:image\/(png|jpe?g)/i);
    if (m) format = m[1].toLowerCase().startsWith('jp') ? 'JPEG' : 'PNG';
    doc.addImage(src, format, x, y, w, h);
    return true;
  } catch (e) {
    return false;
  }
}

// Preload external images (logo, badges, stamp, etc.)
export async function preloadCertificateImages(paths = {
  logo: '/logo.png',
  msme: '/msme.png',
  iso: '/iso.png',
  mca: '/mca.png',
  stamp: '/stamp.png'
}) {
  const out = {};
  await Promise.all(
    Object.entries(paths).map(async ([key, url]) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const blob = await res.blob();
        if (!blob.type.startsWith('image/')) return;
        out[key] = await new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.readAsDataURL(blob);
        });
      } catch (e) { /* missing image skip */ }
    })
  );
  return out;
}

/* ---------- Main (Async to support QR code generation) ---------- */

export async function createCertificatePdf(data) {
  const {
    certificateNumber = 'DBZ-2026-890874C2',
    aicteRefId = 'CORPORATE6a6f13865f5d91785664390',
    studentName = '',
    collegeName = '',
    regRollNo = '',
    programName = '',
    companyName = 'DIBUZZ DIGITAL PRIVATE LIMITED',
    startDate = '',
    endDate = '',
    grade = 'A',
    certificateType = 'internship',
    issuedDate = new Date().toISOString().split('T')[0],
    signatoryName = 'Gautam Kumar',
    signatoryTitle = 'Director',
    verifyBaseUrl = 'https://www.dibuzz.in/verify',
    images = {},
    internshipMode = 'online' // 'online' | 'offline'
  } = data;

  // Generate verification URL for QR code (uses query parameter for existing verifier route)
  const verifyUrl = `${verifyBaseUrl}?id=${certificateNumber}`;
  let qrDataUrl = images.qr;

  if (!qrDataUrl) {
    try {
      qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 150
      });
    } catch (err) {
      console.error('Failed to generate QR code', err);
    }
  }

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const pageWidth = 297;
  const pageHeight = 210;
  const cx = pageWidth / 2;

  const NAVY = [18, 52, 86];
  const DEEP = [12, 45, 92];
  const TEAL = [23, 115, 140];
  const GOLD = [176, 141, 62];
  const TEXT = [55, 55, 55];
  const GRAY = [110, 110, 110];

  const isCourse = certificateType === 'course';

  /* ----- Background, frame, watermark ----- */

  doc.setFillColor(...DEEP);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(6, 6, pageWidth - 12, pageHeight - 12, 'F');

  // Soft watermark
  try {
    doc.setGState(new doc.GState({ opacity: 0.045 }));
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(90);
    doc.setTextColor(...NAVY);
    doc.text('DIBUZZ', cx, 132, { align: 'center' });
    doc.setGState(new doc.GState({ opacity: 1 }));
  } catch (e) { /* watermark skip */ }

  // Gold double border
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.7);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.setLineWidth(0.2);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  /* ----- Top Header Section ----- */

  // AICTE Org. Ref. Id (Top Left Line 1)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text('AICTE Org. Ref. Id:', 16, 17);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...NAVY);
  doc.text(aicteRefId, 16 + doc.getTextWidth('AICTE Org. Ref. Id: '), 17);

  // Certificate Number (Top Left Line 2)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...NAVY);
  const label = 'CERTIFICATE NO: ';
  doc.text(label, 16, 24);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...TEAL);
  doc.text(certificateNumber, 16 + doc.getTextWidth(label), 24);

  // Logo (Top Right)
  if (!drawImageSafe(doc, images.logo || '/logo.png', 246, 16, 35, 18)) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...DEEP);
    doc.text('DIBUZZ', 263, 26, { align: 'center' });
  }

  // Company Name Header (Centered)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEAL);
  drawSpacedCentered(doc, companyName.toUpperCase(), cx, 24, 2);

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(...NAVY);
  drawSpacedCentered(doc, 'CERTIFICATE', cx, 44, 2);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(...GRAY);
  drawSpacedCentered(doc, 'OF ACHIEVEMENT', cx, 52, 3.5);

  // Gold divider with diamond accent
  const divY = 58.5;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(cx - 45, divY, cx - 5, divY);
  doc.line(cx + 5, divY, cx + 45, divY);
  doc.setFillColor(...GOLD);
  doc.triangle(cx, divY - 2, cx + 2.2, divY, cx, divY + 2, 'F');
  doc.triangle(cx, divY - 2, cx - 2.2, divY, cx, divY + 2, 'F');

  /* ----- Body Section ----- */

  doc.setFont('times', 'italic');
  doc.setFontSize(12.5);
  doc.setTextColor(...GRAY);
  doc.text('This is to certify that Mr./Ms.', cx, 69, { align: 'center' });

  // Student name (auto-shrink if too long)
  let nameSize = 30;
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(nameSize);
  while (doc.getTextWidth(studentName) > 200 && nameSize > 16) {
    nameSize -= 1;
    doc.setFontSize(nameSize);
  }
  doc.setTextColor(...NAVY);
  doc.text(studentName, cx, 82, { align: 'center' });

  const nameW = Math.min(doc.getTextWidth(studentName) + 16, 220);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.4);
  doc.line(cx - nameW / 2, 85, cx + nameW / 2, 85);

  const formatDate = (d) =>
    d ? new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
  const periodText = startDate && endDate
    ? `from ${formatDate(startDate)} to ${formatDate(endDate)}`
    : (isCourse ? 'the course period' : 'the internship period');

  // Determine mode label for paragraph
  const modeLabel = internshipMode === 'online' ? 'Online' : 'Offline';
  const programLabel = isCourse ? 'Course' : 'Internship';
  const article = (modeLabel === 'Online' || modeLabel === 'Offline') ? 'an' : 'a';

  const N = { font: 'times', style: 'normal', color: TEXT };
  const B = { font: 'times', style: 'bold', color: NAVY };
  const BI = { font: 'times', style: 'bolditalic', color: TEAL };

  const yEnd = drawRichParagraph(
    doc,
    [
      { ...N, text: 'student of ' },
      { ...B, text: collegeName },
      { ...N, text: ', bearing Reg. / Roll No: ' },
      { ...B, text: regRollNo },
      { ...N, text: `, has successfully completed ${article} ${modeLabel} ${programLabel} in ` },
      { ...B, text: programName },
      { ...N, text: ' at ' },
      { ...BI, text: `${companyName}.` },
      { ...N, text: ' During the period ' },
      { ...B, text: periodText },
      {
        ...N,
        text: `, the candidate demonstrated commendable technical skills, professionalism, discipline, and a strong commitment to learning. Based on overall performance, project work, and conduct, the ${isCourse ? 'learner' : 'intern'} has been awarded.`
      }
    ],
    cx, 95, 215, 7, 11.5
  );

  // Grade badge
  const gy = yEnd - 2;
  doc.setFillColor(...NAVY);
  doc.roundedRect(cx - 24, gy, 48, 9, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  drawSpacedCentered(doc, `GRADE: ${grade}`, cx, gy + 6.3, 0.6);

  // Closing remark
  drawRichParagraph(
    doc,
    [{
      ...N,
      text: 'We found the candidate to be sincere and dedicated in all assigned responsibilities. We wish them every success in their future academic and professional endeavors.'
    }],
    cx, gy + 18, 215, 6, 10.5
  );

  /* ----- Footer Row (Scannable QR Code, Date, Signature, Stamp, Badges) ----- */

  const lineY = 166;

  // Bottom-Left: Automatically Generated Scannable QR Code + Date of Issue
  const qrX = 18;
  const qrY = 144;
  const qrSize = 21;

  if (qrDataUrl) {
    drawImageSafe(doc, qrDataUrl, qrX, qrY, qrSize, qrSize);
  }

  // Issue Date right beside QR code area
  const formattedIssuedDate = new Date(`${issuedDate}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short', day: '2-digit', year: 'numeric'
  });
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...NAVY);
  doc.text(formattedIssuedDate, qrX + qrSize + 14, lineY - 3, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  drawSpacedCentered(doc, 'DATE OF ISSUE', qrX + qrSize + 14, lineY + 6, 0.6);

  // Center: Signature & Authority details
  const sigX = cx + 15;
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 30);
  doc.text(signatoryName, sigX, lineY - 3, { align: 'center' });
  doc.setDrawColor(90, 90, 90);
  doc.setLineWidth(0.3);
  doc.line(sigX - 28, lineY, sigX + 28, lineY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  drawSpacedCentered(doc, signatoryName.toUpperCase(), sigX, lineY + 6, 0.6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  doc.text(signatoryTitle, sigX, lineY + 11, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...TEAL);
  doc.text(`Authorised Signatory - ${signatoryName}`, sigX, lineY + 16.5, { align: 'center' });

  // Company stamp overlaying signature block
  if (images.stamp) {
    const stampSize = 28;
    const stampX = sigX - 2;
    const stampY = 148;
    try {
      doc.setGState(new doc.GState({ opacity: 0.9 }));
    } catch (e) { /* fallback */ }
    drawImageSafe(doc, images.stamp, stampX, stampY, stampSize, stampSize);
    try {
      doc.setGState(new doc.GState({ opacity: 1 }));
    } catch (e) { /* skip */ }
  }

  // Bottom-Right: Accreditation Badges (MSME, ISO, MCA)
  const badges = [
    { key: 'msme', path: '/msme.png', x: 207 },
    { key: 'iso', path: '/iso.png', x: 230 },
    { key: 'mca', path: '/mca.png', x: 253 }
  ];
  const anyDrawn = badges
    .map((b) => drawImageSafe(doc, images[b.key] || b.path, b.x, 156, 20, 20))
    .some(Boolean);

  if (!anyDrawn) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text('MSME | ISO CERTIFIED | MCA', 245, 168, { align: 'center' });
  }

  // Bottom Footer Fine Print
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(140, 140, 140);
  const footerText = `AICTE Org. Ref. Id: ${aicteRefId}   |   Certificate ID: ${certificateNumber}   |   Verify: ${verifyUrl}`;
  doc.text(footerText, cx, 192, { align: 'center' });

  return doc.output('blob');
}