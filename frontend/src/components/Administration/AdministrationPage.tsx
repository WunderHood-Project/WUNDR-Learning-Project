'use client';

import Link from 'next/link';

type Props = {
  title: string;
  children?: React.ReactNode;
};

const tile =
  'admin-tile block rounded-xl border border-gray-200 bg-white p-4 ' +
  'hover:bg-gray-50 hover:border-gray-300 transition shadow-sm';

export default function AdministrationPage({ title, children }: Props) {
  return (
    <div className="max-w-6xl mx-auto p-6 grid gap-5">
      {/* Top bar */}
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-gray-500">Admin dashboard</p>
      </div>
      <div className="flex items-center justify-between">
        <Link href="/" className="ml-auto text-green-800 underline">
          Back to site
        </Link>
      </div>

      {/* NAV */}
      <nav className="
      -mx-6 px-6
      flex gap-3 overflow-x-auto pb-3
      snap-x snap-mandatory
      scroll-smooth
      [scrollbar-width:none] [-ms-overflow-style:none]
      "
      >
        <Link className={`${tile} shrink-0 min-w-[180px]`} href="/admin/children">Children</Link>
        <Link className={`${tile} shrink-0 min-w-[180px]`} href="/admin/partners">Partners</Link>
        <Link className={`${tile} shrink-0 min-w-[180px]`} href="/admin/partner-events">Partner Events</Link>
      </nav>


      {/* Page content */}
      {children ? (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          {children}
        </section>
      ) : null}
    </div>
  );
}
