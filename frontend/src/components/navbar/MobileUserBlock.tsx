'use client';
import Link from 'next/link';
// import { useUnreadNotifications } from '../../../hooks/useUnreadNotifications';

type Props = {
  fullName: string;                           // `${user.firstName} ${user.lastName}`
  role: 'admin' | 'parent' | 'instructor' | 'volunteer';
  onLogout: () => void;
  onNavigate?: () => void;                    // close after transfer
};

export default function MobileUserBlock({ fullName, role, onLogout, onNavigate }: Props) {
  const first = (fullName.split(' ')[0] || '').trim() || 'Profile';
  const isAdmin = role === 'admin';
  // const { unread } = useUnreadNotifications();

  return (
    <div className="mt-3 space-y-2">
      {/* Profile */}
      <Link
        href="/profile"
        onClick={onNavigate}
        className="flex items-center rounded-xl px-3 py-3 bg-gradient-to-r from-wonderleaf/10 to-wondergreen/10 border border-wonderleaf/30 font-semibold text-wondergreen hover:shadow-lg transition-all"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
          {first.charAt(0).toUpperCase()}
        </div>
        Profile — {first}
      </Link>

      {/* Notifications row with badge */}
      {/* <Link
        href="/profile?tab=notifications"
        onClick={onNavigate}
        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 hover:bg-emerald-50"
      >
        <span>Notifications</span>
        {unread > 0 && (
          <span className="ml-3 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </Link> */}


      {/* Only for Admin! */}
      {isAdmin && (
        <>
          <Link
            href="/admin/volunteer-opp"
            onClick={onNavigate}
            className="block rounded-xl border border-slate-200 bg-white px-4 py-3 hover:bg-emerald-50"
          >
            Volunteer Opportunities
          </Link>
          <Link
            href="/admin/administration"
            onClick={onNavigate}
            className="block rounded-xl border border-slate-200 bg-white px-4 py-3 hover:bg-emerald-50"
          >
            Administration
          </Link>
        </>
      )}

      <button
        type="button"
        onClick={() => { onLogout(); onNavigate?.(); }}
        className="w-full rounded-xl px-3 py-2.5 text-base font-semibold border text-wondergreen bg-wondersun/60 border-wonderleaf hover:bg-wondersun transition-colors"
        aria-label="Log out"
      >
        Logout
      </button>
    </div>
  );
}
