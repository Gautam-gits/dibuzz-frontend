// Turns a pasted link into something we can show inside an <iframe>.
export function getEmbedUrl(url = '') {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const drive = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`;
  return null;
}

export const RESOURCE_TYPES = [
  { value: 'video', label: 'Video (YouTube / Drive)' },
  { value: 'pdf', label: 'PDF / Document link' },
  { value: 'link', label: 'Website link' },
  { value: 'notes', label: 'Text notes' },
];
