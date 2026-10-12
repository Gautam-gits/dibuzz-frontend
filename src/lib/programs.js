// Helpers for the public Programs pages (Discover + Program Detail).
// Programs come from the existing `internships` data, so no database change is needed.

export function slugify(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Shareable address, e.g. /programs/python-programming-12  (the number is the program id)
export const programSlug = (item) => `${slugify(item.title) || 'program'}-${item.id}`;

export function findProgramBySlug(list = [], slug = '') {
  const match = String(slug).match(/-(\d+)$/);
  if (!match) return null;
  return list.find((item) => String(item.id) === match[1]) || null;
}

// "3rd Sem" / "3rd Semester Training" -> "3rd semester"
export function semesterLabel(item) {
  const match = `${item.badge || ''} ${item.type || ''}`.match(/(\d+)(st|nd|rd|th)/i);
  return match ? `${match[1]}${match[2].toLowerCase()} semester` : '';
}

export const isFree = (item) => !item.paymentRequired;

export function priceLabel(item) {
  return isFree(item) ? 'Free' : `₹${Number(item.feeAmount || 0).toLocaleString('en-IN')}`;
}

const IMAGE_RULES = [
  [/autocad/i, '/programs/autocad.webp'],
  [/solidworks/i, '/programs/solidworks.webp'],
  [/matlab/i, '/programs/matlab.webp'],
  [/machine|\bml\b/i, '/programs/ml.webp'],
  [/artificial|\bai\b/i, '/programs/ai.webp'],
  [/internet of things|\biot\b/i, '/programs/iot.webp'],
  [/python/i, '/programs/python.webp'],
  [/web/i, '/programs/webdev.webp'],
];

// Admin-set image first, then a local optimized photo, otherwise nothing (a clean gradient is shown)
export function programImage(item) {
  if (item.image) return item.image;
  const hit = IMAGE_RULES.find(([pattern]) => pattern.test(item.title || ''));
  return hit ? hit[1] : '';
}

// Online payment is built in Phase 8. Until then, paid programs that need no approval cannot be bought.
export const PAYMENTS_LIVE = false;

// Admin setting: does the student need approval (apply) or can they enroll directly?
export const needsApproval = (item) => item.approvalRequired !== false;

// Can the student finish the join step on the website right now?
export const canEnrollNow = (item) => needsApproval(item) || isFree(item) || PAYMENTS_LIVE;

export function ctaLabel(item) {
  if (needsApproval(item)) return 'Apply to join';
  return isFree(item) ? 'Enroll for free' : `Enroll – ${priceLabel(item)}`;
}
