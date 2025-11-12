/** Formats any ISO/date string as M/D/YYYY in UTC (no TZ drift). */
export const numericFormatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC', // force UTC to avoid -1 day shifts
  });
};

/** 12/24h timestamp for notifications, e.g. "11-07-2025 09:15". Uses local time. */
export const formatNotificationTime = (iso: string): string => {
  const d = new Date(iso);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day   = String(d.getDate()).padStart(2, '0');
  const year  = d.getFullYear();
  const hrs   = String(d.getHours()).padStart(2, '0');
  const mins  = String(d.getMinutes()).padStart(2, '0');
  return `${month}-${day}-${year} ${hrs}:${mins}`;
};

/**
 * Human-ish relative label for a timestamp:
 * "Today 09:15", "Yesterday 18:30", "3 days ago", or a locale date.
 * Uses local time.
 */
export function formatWhen(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  const timeHHMM = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (diffDays === 0) return `Today ${timeHHMM}`;
  if (diffDays === 1) return `Yesterday ${timeHHMM}`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

/** "Nov 7, 2025" (local). */
export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Builds a 12h time range like "9:00 AM – 11:30 AM" from a date (ISO) + HH:mm edges.
 * Uses LOCAL time (for event cards shown to the user).
 */
export function formatTimeRange12h(dateISO: string, start?: string | null, end?: string | null): string {
  const fmt = (hhmm?: string | null) =>
    hhmm
      ? combineLocal(dateISO, hhmm).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      : '';

  const s = fmt(start);
  const e = fmt(end);
  return s && e ? `${s} – ${e}` : (s || e);
}

/**
 * Combine a date-only string "YYYY-MM-DD" (or ISO with date part)
 * with "HH:mm" into a LOCAL Date object (no timezone math).
 */
export const combineLocal = (isoOrDateOnly: string, timeStr = '00:00') => {
  if (!isoOrDateOnly) return new Date(NaN);

  // Extract just the date part
  const m = isoOrDateOnly.match(/^\d{4}-\d{2}-\d{2}/);
  if (!m) return new Date(NaN);

  const [y, mm, d] = m[0].split('-').map(Number);
  const [hh = 0, min = 0] = timeStr.split(':').map(Number);

  return new Date(y, mm - 1, d, hh, min, 0, 0);
};

/**
 * ⚠️ DEPRECATED: Do NOT use this for <input type="date"> values ("YYYY-MM-DD").
 * `new Date('YYYY-MM-DD')` is parsed as local midnight then converted to UTC by
 * `toISOString()`, which can shift the calendar day backward/forward.
 * Use `ymdToIsoNoShift()` instead.
 */
export const convertStringToIsoFormat = (date: string) => {
  const d = new Date(date);
  return d.toISOString();
};

/** Today's date as "YYYY-MM-DD" in LOCAL TZ (handy for UI inputs). */
export const toYMDLocal = (d: Date = new Date()): string =>
  d.toLocaleDateString('en-CA');

/**
 * Converts any parseable date string into "YYYY-MM-DD" for <input type="date">.
 * If user gives "MM/DD/YYYY", it falls back to a manual split.
 */
export const toYMDForInput = (s: string): string => {
  if (!s) return '';
  const d = new Date(s);

  if (!Number.isNaN(d.getTime())) return d.toLocaleDateString('en-CA'); // YYYY-MM-DD

  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[1]}-${m[2]}` : '';
};

/** "Nov 7, 2025, 9:15 AM" (local). */
export const formatDateTimeLocal = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '';

/**
 * ✅ SAFE for <input type="date"> strings.
 * "YYYY-MM-DD" -> ISO set to 12:00 UTC (noon) to avoid date shifting across timezones.
 * Backend stores the intended calendar day regardless of client TZ.
 */
export function ymdToIsoNoShift(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0)); // noon UTC
  return dt.toISOString();
}

/** ISO -> "YYYY-MM-DD" using UTC parts (stable across TZ). */
export function isoToYMD(iso?: string | null): string {
  if (!iso) return '';
  const dt = new Date(iso);
  const y  = dt.getUTCFullYear();
  const m  = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d  = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Today's date as "YYYY-MM-DD" in UTC (useful for min/max in date inputs). */
export function todayYMDUTC(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Chooses the best timestamp to display for a notification-like object.
 * Prefer `createdAt`, then `eventDate`, otherwise now.
 */
export function pickDisplayTime(obj: { createdAt?: string; eventDate?: string }): string {
  return obj.createdAt ?? obj.eventDate ?? new Date().toISOString();
}
