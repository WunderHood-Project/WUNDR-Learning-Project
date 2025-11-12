import Link from "next/link";

export default function AdministrationPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-bold mb-2">Administration</h1>

      <nav className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Link className="admin-tile" href="/admin/children">Children</Link>
        <Link className="admin-tile" href="/admin/parents">Parents</Link>
        <Link className="admin-tile" href="/admin/events">Events</Link>
        <Link className="admin-tile" href="/admin/volunteers">Volunteers</Link>
        <Link className="admin-tile" href="/admin/partners">Partners</Link>
      </nav>
    </div>
  );
}

/* где-то в globals.css (или tailwind classes inline) */
