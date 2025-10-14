'use client';

import Link from 'next/link';
import { useAuth } from "@/app/context/auth";
import { useEffect } from 'react';


export default function UserDropdown({ onLogout, onClose, }: {
  onLogout: () => void;
  onClose: () => void;
}) {

  const { user } = useAuth();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="absolute right-0 mt-2 w-52 bg-white border border-wonderleaf/40 rounded-xl shadow-lg z-50">
      <div className="px-4 py-2 text-wondergreen font-bold border-b border-wonderleaf/20">
        {user?.firstName} {user?.lastName}
        <div className="text-xs text-wonderleaf font-normal">{user?.role}</div>
      </div>
      <Link
        href="/profile"
        onClick={onClose}
        className="block px-4 py-2 hover:bg-wonderleaf/10 text-wondergreen"
      >
        Profile
      </Link>

      {user?.role === 'admin' && (
        <Link
          href="/admin/volunteer-opp"
          onClick={onClose}
          className="block px-4 py-2 hover:bg-wonderleaf/10 text-wondergreen"
        >
          Volunteer Opportunities
        </Link>
      )}

      {user?.role === 'admin' && (
        <Link
          href="/admin/administration"
          onClick={onClose}
          className="block px-4 py-2 hover:bg-wonderleaf/10 text-wondergreen"
        >
          Administration
        </Link>
      )}
      
      <button
        type="button"
        className="block w-full text-left px-4 py-2 hover:bg-wonderorange/10 text-wonderorange font-semibold rounded-b-xl"
        onClick={() => { onClose(); onLogout(); }}
      >
        Logout
      </button>
    </div>
  );
}
