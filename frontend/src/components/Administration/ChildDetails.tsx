'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { determineEnv, makeApiRequest } from '../../../utils/api';
import type { Child } from '@/types/child';
import { formatDateTimeLocal, formatDate} from '../../../utils/formatDate';


const WONDERHOOD_URL = determineEnv();

type Props = { childId: string };

type ChildDetailResponse = { child: Child };
type WaiverSignatureLite = {
  type: string;              // "liability" will come as a string
  version: string;
  signedAt: string;
  signedByName: string | null;
};

type WaiverResponse = { waiver: WaiverSignatureLite | null };

export default function ChildDetails({ childId }: Props) {
  const [child, setChild] = useState<Child | null>(null);  //Holds child profile returned from API.
  const [waiver, setWaiver] = useState<WaiverSignatureLite | null>(null);         //Holds latest waiver signature returned from API (admin route).
  const [loading, setLoading] = useState(true);           // Simple loading state for UI.
  const [error, setError] = useState<string | null>(null); //Stores error message to show in UI.

  const token = useMemo(() => {
    if (typeof window === 'undefined') return null; //Protects from SSR access to localStorage.
    return localStorage.getItem('token');           //Reads token once on mount (memoized).

  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        //Fetch child details from admin endpoint (includes parents + emergencyContacts).
        const detail = await makeApiRequest<ChildDetailResponse>(`${WONDERHOOD_URL}/child/admin/${childId}`, {
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        setChild(detail.child);

        // Fetch waiver signature separately (optional endpoint).
        const w = await makeApiRequest<WaiverResponse>(`${WONDERHOOD_URL}/child/admin/${childId}/waiver`, {
          method: 'GET',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setWaiver(w.waiver ?? null); //Normalize undefined → null for easier rendering.

      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load child');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [childId, token]); //Re-run when switching childId or when token changes.

  if (loading) return <div className="text-sm text-gray-500">Loading…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!child) return <div className="text-sm text-gray-500">Child not found.</div>;

  return (
    <div className="grid gap-4">
        {/*Header + navigation back */}
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-lg font-semibold">{child.firstName} {child.lastName}</h2>
            <div className="text-xs text-gray-500">ID: {child.id}</div>
            </div>

            <Link className="text-sm text-green-700 hover:underline" href="/admin/children">
            ← Back to list
            </Link>
        </div>

        {/* Main info cards */}
        <div className="grid md:grid-cols-2 gap-4">
            {/*Child basics */}
            <div className="rounded-lg border p-4">
                <div className="font-medium mb-2">Basics</div>
                <div className="text-sm grid gap-1">
                    <div>
                        <span className="text-gray-500">Birthday:</span>{" "}
                        {child.birthday ? formatDate(child.birthday) : "—"}
                    </div>
                    <div><span className="text-gray-500">Grade:</span> {child.grade ?? '—'}</div>
                    <div><span className="text-gray-500">Homeschool:</span> {child.homeschool ? 'Yes' : 'No'}</div>
                    <div><span className="text-gray-500">Allergies:</span> {child.allergiesMedical ?? '—'}</div>
                    <div><span className="text-gray-500">Notes:</span> {child.notes ?? '—'}</div>
                    <div><span className="text-gray-500">Photo consent:</span> {child.photoConsent ? 'Yes' : 'No'}</div>
                    <div><span className="text-gray-500">Waiver:</span> {child.waiver ? 'Yes' : 'No'}</div>
                </div>
            </div>

            {/* Parents list */}
            <div className="rounded-lg border p-4">
                <div className="font-medium mb-2">Parents</div>

                {child.parents?.length ? (
                    <ul className="text-sm grid gap-3">
                    {child.parents.map((p) => (
                        <li key={p.id} className="rounded-md bg-gray-50 p-3">
                        <div className="font-medium">
                            {p.firstName} {p.lastName}
                        </div>

                        <div className="text-gray-700">
                            <div><span className="text-gray-500">Email:</span> {p.email}</div>
                            <div><span className="text-gray-500">Phone:</span> {p.phoneNumber ?? "—"}</div>
                            <div>
                            <span className="text-gray-500">Address:</span>{" "}
                            {p.address ? `${p.address}, ${p.city}, ${p.state} ${p.zipCode}` : "—"}
                            </div>
                        </div>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <div className="text-sm text-gray-500">No parents attached.</div>
                )}
            </div>

        </div>

        {/* Emergency contacts */}
        <div className="rounded-lg border p-4">
            <div className="font-medium mb-2">Emergency Contacts</div>
            {child.emergencyContacts?.length ? (
            <ul className="text-sm grid gap-2">
                {child.emergencyContacts.map(ec => (
                <li key={ec.id} className="rounded-md bg-gray-50 p-3">
                    <div className="font-medium">{ec.firstName} {ec.lastName}</div>
                    <div className="text-gray-600">{ec.relationship} • {ec.phoneNumber}</div>
                </li>
                ))}
            </ul>
            ) : (
            <div className="text-sm text-gray-500">No emergency contacts.</div>
            )}
        </div>

        {/* Waiver signature record (from /admin/:id/waiver) */}    
        <div className="rounded-lg border p-4">
            <div className="font-medium mb-2">Waiver Signature (latest)</div>
            {waiver ? (
            <div className="text-sm grid gap-1">
                <div><span className="text-gray-500">Type:</span> {waiver.type}</div>
                <div><span className="text-gray-500">Version:</span> {waiver.version}</div>
                <div>
                    <span className="text-gray-500">Signed At:</span>{" "}
                    {formatDateTimeLocal(waiver?.signedAt)}
                </div>

                <div><span className="text-gray-500">Signed By:</span> {waiver.signedByName}</div>
            </div>
            ) : (
            <div className="text-sm text-gray-500">No waiver signature record found.</div>
            )}
        </div>
    </div>
  );
}
