'use client';
import { useEffect, useState } from 'react';
import { FaBars, FaTimes, FaUser, FaChild, FaCalendarCheck, FaBell, FaTrash } from 'react-icons/fa';
import OpenModalButton from '@/context/openModalButton';
import DeleteUser from '../profile/userInfo/DeleteUser';
import { useUser } from '../../../hooks/useUser';

const icons = [FaUser, FaChild, FaCalendarCheck, FaBell];

export default function MobileMenuDrawer({
  tabs,
  activeIdx,
  onSelect,
  className = ''
}: {
  tabs: string[];
  activeIdx: number;
  onSelect: (i: number) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  // Block body scrolling when the driver is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className={`mt-1 mb-2 ${className}`}>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-wonderleaf text-white font-semibold shadow-sm"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <FaBars className="h-4 w-4" />
        Profile Menu
      </button>

      {open && (
        <>
          {/* overlay below the modal, above the page  */}
          <div
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* The driver itself is below the modal's z-index */}
          <aside
            className="
            fixed left-0 top-3 z-40
            w-[88vw] max-w-[360px]
            bg-white rounded-r-3xl shadow-2xl
            p-4
            max-h-[calc(100svh-24px)] overflow-y-auto  
          "

            role="dialog"
            aria-modal="true"
            aria-label="Profile menu"
          >
            {/* header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-wondergreen font-bold text-lg">Profile Menu</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full bg-wonderleaf text-white"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>

            {/* items */}
            <nav className="space-y-2">
              {tabs.map((label, i) => {
                const Icon = icons[i] ?? FaUser;
                const active = i === activeIdx;
                return (
                  <button
                    key={label}
                    onClick={() => {
                      onSelect(i);
                      setOpen(false);
                    }}
                    className={
                      `w-full flex items-center gap-3 rounded-xl px-4 py-3 text-[17px] ` +
                      (active
                        ? 'bg-wonderleaf/15 text-wondergreen font-semibold'
                        : 'text-wondergreen/80 hover:bg-wonderleaf/10 hover:text-wondergreen')
                    }
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-white border-wondergreen/15">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 text-left">{label}</span>
                    {active && <span className="h-2.5 w-2.5 rounded-full bg-wonderleaf" />}
                  </button>
                );
              })}
            </nav>

            <hr className="my-4 border-wondergreen/10" />

            {/* Delete  */}
            <OpenModalButton
            buttonText={
              <span className="flex items-center justify-center gap-2">
                <FaTrash className="h-4 w-4" />
                Delete Account
              </span>
            }
            className="w-full rounded-2xl px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold"
            modalComponent={<DeleteUser currUser={user} />}
            onButtonClick={() => setOpen(false)}
            />
          </aside>
        </>
      )}
    </div>
  );
}
