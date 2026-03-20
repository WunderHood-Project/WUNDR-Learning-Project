"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { determineEnv, makeApiRequest } from "../../../utils/api";

const API = determineEnv();

type EventStatus = "pending" | "approved" | "rejected";

interface SubmittedBy {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface Activity {
    id: string;
    name: string;
}

interface PartnerEvent {
    id: string;
    name: string;
    description: string;
    notes?: string;
    date: string;
    city: string;
    state: string;
    address: string;
    startTime: string;
    endTime: string;
    status: EventStatus;
    submittedBy?: SubmittedBy;
    activity?: Activity;
    createdAt: string;
}

export default function PartnerEvents() {
    const [items, setItems] = useState<PartnerEvent[]>([]);
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
            const res = await makeApiRequest<{ events: PartnerEvent[] }>(
                `${API}/event/pending`,
                { method: "GET", headers: authHeaders }
            );
            setItems(res.events ?? []);
        } catch (e) {
            console.error("Failed to fetch pending events:", e);
        } finally {
            setLoading(false);
        }
    }, [authHeaders]);

    useEffect(() => { load(); }, [load]);

    async function updateStatus(id: string, next: "approved" | "rejected") {
        try {
            const notes = adminNotes[id]?.trim() || undefined;
            await makeApiRequest(`${API}/event/${id}/status`, {
                method: "PATCH",
                headers: authHeaders,
                body: { status: next, ...(notes ? { adminNotes: notes } : {}) },
            });
            setItems((arr) => arr.filter((e) => e.id !== id));
        } catch (e) {
            console.error("Status update failed:", e);
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Partner Event Submissions</h2>

            <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5 bg-white">
                <table className="min-w-[900px] w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-left">
                            <Th></Th>
                            <Th>Event</Th>
                            <Th>Submitted By</Th>
                            <Th>Activity</Th>
                            <Th>Date</Th>
                            <Th>Location</Th>
                            <Th>Submitted</Th>
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
                            items.map((e) => {
                                const isOpen = open.has(e.id);
                                return (
                                    <React.Fragment key={e.id}>
                                        <tr className="border-t">
                                            <Td className="w-10">
                                                <button
                                                    aria-label={isOpen ? "Collapse" : "Expand"}
                                                    onClick={() => toggle(e.id)}
                                                    className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100"
                                                >
                                                    <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
                                                </button>
                                            </Td>
                                            <Td className="font-medium">{e.name}</Td>
                                            <Td>
                                                {e.submittedBy ? (
                                                    <div>
                                                        <div>{e.submittedBy.firstName} {e.submittedBy.lastName}</div>
                                                        <a className="text-wondergreen underline text-xs" href={`mailto:${e.submittedBy.email}`}>
                                                            {e.submittedBy.email}
                                                        </a>
                                                    </div>
                                                ) : "—"}
                                            </Td>
                                            <Td>{e.activity?.name ?? "—"}</Td>
                                            <Td>{new Date(e.date).toLocaleDateString()}</Td>
                                            <Td>{[e.city, e.state].filter(Boolean).join(", ")}</Td>
                                            <Td>{new Date(e.createdAt).toLocaleDateString()}</Td>
                                            <Td className="text-right">
                                                <div className="inline-flex gap-2">
                                                    <Btn onClick={() => updateStatus(e.id, "approved")}>Approve</Btn>
                                                    <Btn onClick={() => updateStatus(e.id, "rejected")} kind="danger">Reject</Btn>
                                                </div>
                                            </Td>
                                        </tr>

                                        {isOpen && (
                                            <tr key={`${e.id}-details`} className="border-t bg-gray-50/60">
                                                <Td colSpan={8} className="px-6 py-5">
                                                    <div className="grid gap-4">
                                                        <Block title="Description" text={e.description} />
                                                        {e.notes && <Block title="Notes" text={e.notes} />}
                                                        <div className="grid md:grid-cols-2 gap-4">
                                                            <div className="text-sm">
                                                                <span className="font-medium text-gray-600">Address: </span>
                                                                {e.address}, {e.city}, {e.state}
                                                            </div>
                                                            <div className="text-sm">
                                                                <span className="font-medium text-gray-600">Time: </span>
                                                                {e.startTime} – {e.endTime}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Admin notes (optional — sent to partner on decision)
                                                            </label>
                                                            <textarea
                                                                className="w-full border rounded p-2 text-sm"
                                                                rows={2}
                                                                value={adminNotes[e.id] ?? ""}
                                                                onChange={(ev) =>
                                                                    setAdminNotes((prev) => ({ ...prev, [e.id]: ev.target.value }))
                                                                }
                                                                placeholder="Optional notes for the partner…"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Btn onClick={() => updateStatus(e.id, "approved")}>Approve</Btn>
                                                            <Btn onClick={() => updateStatus(e.id, "rejected")} kind="danger">Reject</Btn>
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
