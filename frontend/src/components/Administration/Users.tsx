'use client';

import { useEffect, useMemo, useState } from 'react';
import { determineEnv, makeApiRequest } from '../../../utils/api';

const WONDERHOOD_URL = determineEnv();

type AdminUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  city?: string;
  state?: string;
  zipCode?: string;
  children?: unknown[];
  createdAt?: string;
};

type AdminUsersResponse = {
  users: AdminUser[];
};

export default function Users() {
    const [items, setItems] = useState<AdminUser[]>([]);
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const token = useMemo(() => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token');
    }, []);

    useEffect(() => {
        const run = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await makeApiRequest<AdminUsersResponse>(`${WONDERHOOD_URL}/user/admin`, {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });

            setItems(res.users ?? []);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load users');
        } finally {
            setLoading(false);
        }
        };

        run();
    }, [token]);

    if (loading) return <div className="text-sm text-gray-500">Loading…</div>;
    if (error) return <div className="text-sm text-red-600">{error}</div>;

    const filteredItems =
    roleFilter === 'all'
        ? items
        : items.filter((u) => u.role?.toLowerCase() === roleFilter);

        const roleCounts = {
        all: items.length,
        parent: items.filter((u) => u.role?.toLowerCase() === 'parent').length,
        partner: items.filter((u) => u.role?.toLowerCase() === 'partner').length,
        volunteer: items.filter((u) => u.role?.toLowerCase() === 'volunteer').length,
        admin: items.filter((u) => u.role?.toLowerCase() === 'admin').length,
        };

        return (
            <div className="grid gap-3">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Registered Users</h2>
                <div className="flex flex-wrap gap-2">
                    {[
                        ['all', `All (${roleCounts.all})`],
                        ['parent', `Parents (${roleCounts.parent})`],
                        ['partner', `Partners (${roleCounts.partner})`],
                        ['volunteer', `Volunteers (${roleCounts.volunteer})`],
                        ['admin', `Admins (${roleCounts.admin})`],
                    ].map(([value, label]) => (
                        <button
                        key={value}
                        type="button"
                        onClick={() => setRoleFilter(value)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
                            roleFilter === value
                            ? 'bg-wondergreen text-white border-wondergreen'
                            : 'bg-white text-wondergreen border-gray-200 hover:border-wondergreen'
                        }`}
                        >
                        {label}
                        </button>
                    ))}
                </div>
                <div className="text-xs text-gray-500">Showing: {filteredItems.length}</div>
            </div>

            <div className="overflow-auto border rounded-lg">
                <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                    <tr>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Phone</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Location</th>
                    <th className="text-left p-3">Children</th>
                    <th className="text-left p-3">Joined</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredItems.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">
                        {u.firstName} {u.lastName}
                        </td>
                        <td className="p-3">
                        <a className="text-green-700 hover:underline" href={`mailto:${u.email}`}>
                            {u.email}
                        </a>
                        </td>
                        <td className="p-3">{u.phoneNumber || '—'}</td>
                        <td className="p-3 capitalize">{u.role}</td>
                        <td className="p-3">
                        {[u.city, u.state].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="p-3">{u.children?.length ?? 0}</td>
                        <td className="p-3">
                        {u.createdAt ? String(u.createdAt).slice(0, 10) : '—'}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
        );
}