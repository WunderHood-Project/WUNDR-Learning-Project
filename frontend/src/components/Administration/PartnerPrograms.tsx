"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { determineEnv, makeApiRequest } from "../../../utils/api";

const API = determineEnv();

type ProgramStatus = "pending" | "approved" | "rejected";
type ProgramVenue = "in_person" | "online" | "hybrid";

interface SubmittedBy {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface PendingProgram {
    id: string;
    name: string;
    description: string;
    ageMin: number;
    ageMax: number;
    startDate: string;
    endDate: string;
    sessionSchedule?: string | null;
    outcomes: string[];
    venue: ProgramVenue;
    city?: string | null;
    state?: string | null;
    address?: string | null;
    zipCode?: string | null;
    directorName?: string | null;
    directorTitle?: string | null;
    limit?: number | null;
    status: ProgramStatus;
    submittedBy?: SubmittedBy;
    createdAt: string;
}

const VENUE_LABEL: Record<ProgramVenue, string> = {
    in_person: "In-Person",
    online: "Online",
    hybrid: "Hybrid",
};

export default function PartnerPrograms() {
    const [items, setItems] = useState<PendingProgram[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState<Set<string>>(new Set());
    const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
    const [token, setToken] = useState("");

    useEffect(() => {
        const t = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
        setToken(t);
    }, []);

    const authHeaders = useMemo(
        () => (token ? { Authorization: `Bearer ${token}` } : undefined),
        [token]
    );

    const toggle = (id: string) =>
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    const load = useCallback(async () => {
        if (!authHeaders) return;
        setLoading(true);
        try {
            const res = await makeApiRequest<{ programs: PendingProgram[] }>(
                `${API}/program/pending`,
                { method: "GET", headers: authHeaders }
            );
            setItems(res.programs ?? []);
        } catch (e) {
            console.error("Failed to fetch pending programs:", e);
        } finally {
            setLoading(false);
        }
    }, [authHeaders]);

    useEffect(() => { load(); }, [load]);

    async function updateStatus(id: string, next: "approved" | "rejected") {
        try {
            const notes = adminNotes[id]?.trim() || undefined;
            await makeApiRequest(`${API}/program/${id}/status`, {
                method: "PATCH",
                headers: authHeaders,
                body: { status: next, ...(notes ? { adminNotes: notes } : {}) },
            });
            setItems((arr) => arr.filter((p) => p.id !== id));
        } catch (e) {
            console.error("Status update failed:", e);
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Partner Program Submissions</h2>

            <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5 bg-white">
                <table className="min-w-[960px] w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-left">
                            <Th></Th>
                            <Th>Program</Th>
                            <Th>Submitted By</Th>
                            <Th>Ages</Th>
                            <Th>Venue</Th>
                            <Th>Dates</Th>
                            <Th>Location</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="py-8 text-center">Loading…</td>
                            </tr>
                        ) : items.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-8 text-center text-gray-500">
                                    No pending submissions
                                </td>
                            </tr>
                        ) : (
                            items.map((p) => {
                                const isOpen = open.has(p.id);
                                return (
                                    <React.Fragment key={p.id}>
                                        <tr className="border-t">
                                            <Td className="w-10">
                                                <button
                                                    aria-label={isOpen ? "Collapse" : "Expand"}
                                                    onClick={() => toggle(p.id)}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100"
                                                >
                                                    <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
                                                </button>
                                            </Td>
                                            <Td className="font-medium">{p.name}</Td>
                                            <Td>
                                                {p.submittedBy ? (
                                                    <div>
                                                        <div>{p.submittedBy.firstName} {p.submittedBy.lastName}</div>
                                                        <a className="text-wondergreen underline text-xs" href={`mailto:${p.submittedBy.email}`}>
                                                            {p.submittedBy.email}
                                                        </a>
                                                    </div>
                                                ) : "—"}
                                            </Td>
                                            <Td>{p.ageMin}–{p.ageMax} yrs</Td>
                                            <Td>{VENUE_LABEL[p.venue] ?? p.venue}</Td>
                                            <Td>
                                                <div>{new Date(p.startDate).toLocaleDateString()}</div>
                                                <div className="text-gray-400 text-xs">to {new Date(p.endDate).toLocaleDateString()}</div>
                                            </Td>
                                            <Td>
                                                {p.venue === "online"
                                                    ? "Online"
                                                    : [p.city, p.state].filter(Boolean).join(", ") || "—"}
                                            </Td>
                                            <Td className="text-right">
                                                <div className="inline-flex gap-2">
                                                    <Btn onClick={() => updateStatus(p.id, "approved")}>Approve</Btn>
                                                    <Btn onClick={() => updateStatus(p.id, "rejected")} kind="danger">Reject</Btn>
                                                </div>
                                            </Td>
                                        </tr>

                                        {isOpen && (
                                            <tr key={`${p.id}-details`} className="border-t bg-gray-50/60">
                                                <Td colSpan={8} className="px-6 py-5">
                                                    <div className="grid gap-4">
                                                        <Block title="Description" text={p.description} />

                                                        {p.outcomes?.length > 0 && (
                                                            <div className="rounded-xl border p-4 bg-white">
                                                                <div className="font-semibold mb-2 text-gray-800">Learning Outcomes</div>
                                                                <ul className="list-disc list-inside text-sm space-y-1">
                                                                    {p.outcomes.map((o, i) => <li key={i}>{o}</li>)}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            {p.venue !== "online" && p.address && (
                                                                <div className="text-sm">
                                                                    <span className="font-medium text-gray-600">Address: </span>
                                                                    {[p.address, p.city, p.state, p.zipCode].filter(Boolean).join(", ")}
                                                                </div>
                                                            )}
                                                            {p.sessionSchedule && (
                                                                <div className="text-sm">
                                                                    <span className="font-medium text-gray-600">Schedule: </span>
                                                                    {p.sessionSchedule}
                                                                </div>
                                                            )}
                                                            {p.directorName && (
                                                                <div className="text-sm">
                                                                    <span className="font-medium text-gray-600">Director: </span>
                                                                    {p.directorName}{p.directorTitle ? ` — ${p.directorTitle}` : ""}
                                                                </div>
                                                            )}
                                                            {p.limit != null && (
                                                                <div className="text-sm">
                                                                    <span className="font-medium text-gray-600">Capacity: </span>
                                                                    {p.limit} participants
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Admin notes (optional — sent to partner on decision)
                                                            </label>
                                                            <textarea
                                                                className="w-full border rounded p-2 text-sm"
                                                                rows={2}
                                                                value={adminNotes[p.id] ?? ""}
                                                                onChange={(ev) =>
                                                                    setAdminNotes((prev) => ({ ...prev, [p.id]: ev.target.value }))
                                                                }
                                                                placeholder="Optional notes for the partner…"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Btn onClick={() => updateStatus(p.id, "approved")}>Approve</Btn>
                                                            <Btn onClick={() => updateStatus(p.id, "rejected")} kind="danger">Reject</Btn>
                                                        </div>
                                                    </div>
                                                </Td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ---------- Small UI helpers ---------- */

type ThProps = React.PropsWithChildren<{ className?: string }>;
type TdProps = React.PropsWithChildren<{ className?: string; colSpan?: number }>;
type ButtonKind = "primary" | "danger" | "ghost";
type BtnProps = React.PropsWithChildren<{ onClick: () => void; kind?: ButtonKind }>;

function Th({ children, className = "" }: ThProps) {
    return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

function Td({ children, className = "", colSpan }: TdProps) {
    return <td colSpan={colSpan} className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}

function Btn({ children, onClick, kind = "primary" }: BtnProps) {
    const base = "px-3 py-1.5 rounded text-sm font-medium border";
    const map: Record<ButtonKind, string> = {
        primary: "bg-wondergreen text-white border-transparent hover:brightness-105",
        danger: "bg-red-600 text-white border-transparent hover:brightness-105",
        ghost: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
    };
    return <button onClick={onClick} className={`${base} ${map[kind]}`}>{children}</button>;
}

function Block({ title, text }: { title: string; text?: string | null }) {
    return (
        <div className="rounded-xl border p-4 bg-white">
            <div className="font-semibold mb-2 text-gray-800">{title}</div>
            <div className="whitespace-pre-wrap text-sm">{text?.trim() ? text : "—"}</div>
        </div>
    );
}
