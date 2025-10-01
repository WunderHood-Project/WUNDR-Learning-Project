'use client';

import { useEffect, useMemo, useState } from 'react';
import { API, makeApiRequest } from '../../../utils/api';
import type { VolunteerApp } from '@/types/volunteer';
import { useModal } from '@/app/context/modal';
import LoginModal from '@/components/login/LoginModal';
import DeleteAppModal from './DeleteAppModal';

// helpers
type ErrLike = { status?: number; response?: { status?: number; data?: { detail?: string; message?: string } } };
const statusOf  = (e: unknown) => String((e as ErrLike)?.status ?? (e as ErrLike)?.response?.status ?? '');
const messageOf = (e: unknown) => ((e as ErrLike)?.response?.data?.detail || (e as ErrLike)?.response?.data?.message || '');

type Props =
  | { mode: 'all'; title?: string; onBack?: () => void }
  | { mode: 'opp'; opportunityId: string; title?: string; onBack?: () => void };

type OppLite = { id: string; title: string };

export default function ApplicantsPanel(props: Props) {
    const { setModalContent } = useModal();
    // auth gate
    const [authChecked, setAuthChecked] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    // ui/data
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [items, setItems] = useState<VolunteerApp[]>([]);
    const [q, setQ] = useState('');
    const [kind, setKind] = useState<'all' | 'general'>('all');

    const [oppMap, setOppMap] = useState<Record<string, string>>({});

    const mode = props.mode;
    const oppId = mode === 'opp' ? props.opportunityId : undefined;

    // 1) fetch if admin
    useEffect(() => {
        (async () => {
        try {
            const me = await makeApiRequest<{ role: 'admin'|'parent'|'instructor'|'volunteer' }>(
            `${API}/auth/users/me`,
            { method: 'GET' }
            );
            if (me.role === 'admin') setIsAdmin(true);
            else setErr('Admins only.');
        } catch (e) {
            const code = statusOf(e);
            if (code === '401') setModalContent(<LoginModal />);
            else setErr(messageOf(e) || 'Failed to verify user.');
            setIsAdmin(false);
        } finally {
            setAuthChecked(true);
        }
        })();
    }, [setModalContent]);

    // 2) if admin - download
    useEffect(() => {
        if (!authChecked || !isAdmin) return;

        (async () => {
        setLoading(true);
        setErr(null);
        try {
            const appsUrl =
            mode === 'opp'
                ? `${API}/opportunities/${oppId}/applications`
                : `${API}/volunteer/applications?kind=${kind}`;

            const apps = await makeApiRequest<{ volunteers: VolunteerApp[] }>(appsUrl, { method: 'GET' });
            setItems(apps.volunteers ?? []);

            if (mode === 'all') {
            try {
                const res = await makeApiRequest<{ opportunities: OppLite[] }>(
                `${API}/opportunities`,
                { method: 'GET' }
                );
                const map: Record<string, string> = {};
                for (const o of res.opportunities ?? []) map[o.id] = o.title;
                setOppMap(map);
            } catch {
            }
            }
        } catch (e) {
            const code = statusOf(e);
            if (code === '401') setModalContent(<LoginModal />);
            else if (code === '403') setErr('Admins only.');
            else setErr(messageOf(e) || 'Failed to load applications.');
        } finally {
            setLoading(false);
        }
        })();
    }, [authChecked, isAdmin, mode, kind, oppId, setModalContent]);

    // Search
    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return items;
        return items.filter(v =>
        [
            v.firstName, v.lastName, v.email, v.phoneNumber, v.bio,
            ...(v.cities ?? []), ...(v.skills ?? []), ...(v.timesAvail ?? []),
            v.status ?? '',
            ...(v.volunteerOpportunityIDs ?? []).map(id => oppMap[id] || ''),
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(s)
        );
    }, [items, q, oppMap]);

    const header =
        mode === 'opp'
        ? `Applications — ${props.title ?? 'Opportunity'}`
        : kind === 'general'
        ? 'General applications (no specific opportunity)'
        : 'All applications';

    const formatDate = (iso?: string | null) =>
        iso ? new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

    const appTitleFor = (v: VolunteerApp) => {
        if (mode === 'opp') return props.title ?? 'Opportunity';
        const ids = v.volunteerOpportunityIDs ?? [];
        if (ids.length === 0 && v.generalAppliedAt) return 'General application';
        if (ids.length === 1) return oppMap[ids[0]] ?? 'Opportunity';
        if (ids.length > 1) {
        const titles = ids.map(id => oppMap[id] || '…').filter(Boolean);
        return titles.length ? titles.join(', ') : 'Multiple opportunities';
        }
        return 'Application';
    };

    return (
        <div className="max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{header}</h2>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-3">
            <input
            placeholder="Search…"
            className="rounded-lg border px-3 py-2 w-64"
            value={q}
            onChange={e => setQ(e.target.value)}
            />
            {mode === 'all' && (
            <select
                className="rounded-lg border px-3 py-2"
                value={kind}
                onChange={e => setKind(e.target.value as 'all' | 'general')}
            >
                <option value="all">All</option>
                <option value="general">General only</option>
            </select>
            )}
            <span className="text-sm text-gray-500">{filtered.length} total</span>
        </div>

        {/* Body */}
        <div className="rounded-2xl border bg-white p-4">
            {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
            ) : err ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">{err}</div>
            ) : filtered.length === 0 ? (
            <div className="text-sm text-gray-500">No applications.</div>
            ) : (
            <ul className="divide-y">
                {filtered.map(v => {
                const title = appTitleFor(v);
                const submittedAt = v.generalAppliedAt ?? v.createdAt ?? null;

            return (
                <li key={v.id} className="py-4 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    {/* Name + status + submitted date on the right */}
                    <div className="flex items-start justify-between gap-3">
                    <div className="font-medium">
                        {v.firstName} {v.lastName}{' '}
                        {v.status ? (
                        <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 uppercase tracking-wide">
                            {v.status}
                        </span>
                        ) : null}
                    </div>
                    <div className="shrink-0 text-xs text-gray-500">
                        Submitted: {formatDate(submittedAt)}
                    </div>
                    </div>

                    {/* Application title (opportunity title or "General") */}
                    <div className="mt-0.5 text-sm text-gray-700">
                    <span className="font-medium">Title:</span> {title}
                    </div>

                    {/* Contacts */}
                    <div className="text-sm text-gray-700 mt-1">
                    {v.email ? <span>{v.email}</span> : null}
                    {v.phoneNumber ? <span className="ml-2">· {v.phoneNumber}</span> : null}
                    </div>

                    {/* Chips by sections */}
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {v.cities?.length ? (
                        <div>
                        <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Cities</div>
                        <div className="flex flex-wrap gap-2">
                            {v.cities.map(c => (
                            <span key={c} className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                                {c}
                            </span>
                            ))}
                        </div>
                        </div>
                    ) : null}

                    {v.skills?.length ? (
                        <div>
                        <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Skills</div>
                        <div className="flex flex-wrap gap-2">
                            {v.skills.map(s => (
                            <span key={s} className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                                {s}
                            </span>
                            ))}
                        </div>
                        </div>
                    ) : null}

                    {v.timesAvail?.length ? (
                        <div>
                        <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">Times</div>
                        <div className="flex flex-wrap gap-2">
                            {v.timesAvail.map(t => (
                            <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                                {t}
                            </span>
                            ))}
                        </div>
                        </div>
                    ) : null}
                    </div>

                    {/* Bio — left as is, per request */}
                    {v.bio ? (
                    <div className="mt-3 text-sm text-gray-800">
                        <details className="group">
                        <summary className="cursor-pointer text-wondergreen hover:text-wonderleaf underline decoration-dotted">
                            Short bio
                        </summary>
                        <div className="mt-1 whitespace-pre-wrap">{v.bio}</div>
                        </details>
                    </div>
                    ) : null}

                    {/* Policies / consents */}
                    <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`text-[11px] px-2 py-1 rounded-full ${v.photoConsent ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        Photo consent: {v.photoConsent ? 'Yes' : 'No'}
                    </span>
                    {typeof v.backgroundCheckConsent === 'boolean' && (
                        <span className={`text-[11px] px-2 py-1 rounded-full ${v.backgroundCheckConsent ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        BG check consent: {v.backgroundCheckConsent ? 'Yes' : 'No'}
                        </span>
                    )}
                    </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                    
                    <button
                        onClick={() =>
                        setModalContent(
                            <DeleteAppModal
                            applicationId={v.id}
                            appTitle={appTitleFor(v)}
                            onDeleted={() => {
                                setItems(prev => prev.filter(x => x.id !== v.id));
                            }}
                            />
                        )
                        }
                        className="text-sm rounded-md border px-3 py-1.5 text-rose-600 hover:bg-rose-50 border-rose-200 mt-40"
                    >
                        Delete
                    </button>
                </div>
                </li>
            );
            })}
        </ul>
        )}
    </div>
    </div>
);
}
