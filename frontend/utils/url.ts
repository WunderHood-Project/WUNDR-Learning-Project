// normalize URl
export const normalizeWebsite = (s?: string | null) => {
  const raw = (s ?? "").trim();
  if (!raw) return null;
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try { new URL(withScheme); return withScheme; } catch { return null; }
};
