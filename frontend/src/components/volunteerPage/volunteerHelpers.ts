const VERSION = 'v3';
const OLD_GEN = 'wh_v_general';
const OLD_OPP = 'wh_v_opps';

const hasLS = () =>
  typeof window !== 'undefined' && typeof localStorage !== 'undefined';

function parseJwtPayload(token: string | null) {
  try {
    if (!token) return null;
    const part = token.split('.')[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function uid() {
  try {
    const tok =
      localStorage.getItem('access_token') ||
      localStorage.getItem('token') ||
      '';
    const p = parseJwtPayload(tok);
    return (p?.uid || p?.user_id || p?.sub) ?? 'anon';
  } catch {
    return 'anon';
  }
}

function genKey() {
  return `wh:${VERSION}:${uid()}:v_general`;
}
function oppKey() {
  return `wh:${VERSION}:${uid()}:v_opps`;
}

// Migration of old global keys WE DO only for anonymous.
// For logged in we ignore (so as not to steal other people's flags).
function migrateIfNeeded() {
  if (!hasLS()) return;
  const id = uid();
  if (id !== 'anon') return; // important line: don't touch global keys for logged in users

  const gNew = genKey();
  const oNew = oppKey();

  const gOld = localStorage.getItem(OLD_GEN);
  const oOld = localStorage.getItem(OLD_OPP);

  if (gOld && localStorage.getItem(gNew) === null) localStorage.setItem(gNew, gOld);
  if (oOld && localStorage.getItem(oNew) === null) localStorage.setItem(oNew, oOld);
}

export const markGeneralSubmitted = () => {
  if (!hasLS()) return;
  migrateIfNeeded();
  localStorage.setItem(genKey(), '1');
};

export const isGeneralSubmitted = () => {
  if (!hasLS()) return false;
  migrateIfNeeded();
  return localStorage.getItem(genKey()) === '1';
};

export const markOppSubmitted = (id: string) => {
  if (!hasLS() || !id) return;
  migrateIfNeeded();
  const k = oppKey();
  const raw = localStorage.getItem(k);
  const set = new Set<string>(raw ? JSON.parse(raw) : []);
  set.add(id);
  localStorage.setItem(k, JSON.stringify([...set]));
};

export const isOppSubmitted = (id: string) => {
  if (!hasLS() || !id) return false;
  migrateIfNeeded();
  const k = oppKey();
  const raw = localStorage.getItem(k);
  const arr = raw ? (JSON.parse(raw) as string[]) : [];
  return Array.isArray(arr) && arr.includes(id);
};

// optional for debugging
export const clearLocks = () => {
  if (!hasLS()) return;
  localStorage.removeItem(genKey());
  localStorage.removeItem(oppKey());
};
