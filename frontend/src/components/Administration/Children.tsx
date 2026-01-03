'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { determineEnv, makeApiRequest } from '../../../utils/api';
import type { Child } from '@/types/child';

const WONDERHOOD_URL = determineEnv();

type AdminChildrenResponse = {
  children: Child[];
};

export default function Children() {
  const [items, setItems] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => {
    // Read token only on the client (localStorage doesn't exist on the server)
    // useMemo keeps the value stable so useEffect won't re-run unnecessarily.
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }, []);

  useEffect(() => {
    // Fetch admin children list when the component mounts (or token changes)
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Attach Authorization header only if token exists
        const res = await makeApiRequest<AdminChildrenResponse>(`${WONDERHOOD_URL}/child/admin`, {
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        setItems(res.children ?? []); // Defensive fallback: ensure items is always an array
      } catch (e) {
        // Convert unknown error into a user-friendly message
        setError(e instanceof Error ? e.message : 'Failed to load children');
      } finally {
        setLoading(false); // Always stop loading, even if request failed
      }
    };

    run();
  }, [token]); // Re-fetch if token changes (e.g., user logs in/out)

  if (loading) return <div className="text-sm text-gray-500">Loading…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  if (!items.length) {
    return <div className="text-sm text-gray-500">No children found.</div>;
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Children</h2>
        <div className="text-xs text-gray-500">Total: {items.length}</div>
      </div>

      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">DOB</th>
              <th className="text-left p-3">Grade</th>
              <th className="text-left p-3">Parents</th>
              <th className="text-left p-3">Waiver</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <Link className="text-green-700 hover:underline" href={`/admin/children/${c.id}`}>
                    {c.firstName} {c.lastName}
                  </Link>
                  {/* Optional preferred name */}
                  {c.preferredName ? (
                    <div className="text-xs text-gray-500">Preferred: {c.preferredName}</div>
                  ) : null}
                </td>
                {/* DOB shown as YYYY-MM-DD (simple display; can be replaced with formatter later) */}
                <td className="p-3">{c.birthday ? String(c.birthday).slice(0, 10) : '—'}</td>
                <td className="p-3">{c.grade ?? '—'}</td>
                {/* Parents array is included by admin API; show count */}
                <td className="p-3">{c.parents?.length ?? 0}</td>
                {/* Waiver flag: quick visual indicator */}
                <td className="p-3">{c.waiver ? '✅' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
