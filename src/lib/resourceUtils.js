export function getSafeExternalUrl(value = '') {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

// Turns an allowlisted HTTPS video link into something we can show inside an <iframe>.
export function getEmbedUrl(value = '') {
  const url = getSafeExternalUrl(value);
  if (!url) return null;
  const parsed = new URL(url);
  const host = parsed.hostname.toLowerCase();
  const isYoutube = host === 'youtu.be' || host === 'www.youtube.com' || host === 'youtube.com';
  if (isYoutube) {
    const id = host === 'youtu.be'
      ? parsed.pathname.split('/').filter(Boolean)[0]
      : parsed.searchParams.get('v') || parsed.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})/)?.[1];
    if (id && /^[\w-]{11}$/.test(id)) return `https://www.youtube.com/embed/${id}?rel=0`;
  }
  if (host === 'drive.google.com') {
    const id = parsed.pathname.match(/^\/file\/d\/([\w-]+)/)?.[1] || parsed.searchParams.get('id');
    if (id && /^[\w-]+$/.test(id)) return `https://drive.google.com/file/d/${id}/preview`;
  }
  return null;
}

export const RESOURCE_TYPES = [
  { value: 'video', label: 'Video (YouTube / Drive)' },
  { value: 'pdf', label: 'PDF / Document link' },
  { value: 'link', label: 'Website link' },
  { value: 'notes', label: 'Text notes' },
];

// Small preview picture for a YouTube link (Drive links have none)
export function getYouTubeThumb(url = '') {
  const embed = getEmbedUrl(url);
  const id = embed?.match(/\/embed\/([\w-]{11})/)?.[1];
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}
