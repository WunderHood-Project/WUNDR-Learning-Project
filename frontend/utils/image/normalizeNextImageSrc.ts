export function normalizeNextImageSrc(
  raw?: string | null
): { src: string; unoptimized: boolean } | null {
  if (!raw) return null;
  const src = String(raw).trim();

  // data-uri or blob – rendering without optimization
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    return { src, unoptimized: true };
  }

  // Absolute http/https – render without optimization (to avoid editing next.config)
  if (/^https?:\/\//i.test(src)) {
    return { src, unoptimized: true };
  }

  // relative paths → convert to leading slash
  // remove any leading dots/backslashes
  const cleaned = src.replace(/^[.\s/\\]+/, '');
  if (!cleaned) return null;

  return { src: `/${cleaned}`, unoptimized: false };
}
