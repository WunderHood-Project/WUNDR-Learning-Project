"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { determineEnv, makeApiRequest } from "../../../utils/api";
import type { PartnerApplication } from "@/types/partnership";
import { formatUs } from "../../../utils/formatPhoneNumber";

const API = determineEnv();

/** All valid workflow statuses for a partner application. */
type PartnerStatus = "new" | "reviewing" | "approved" | "rejected";

/** Row shape used by this UI: extends server type with a few local fields. */
type PartnerRow = PartnerApplication & {
    id: string;
    status: PartnerStatus;
    createdAt?: string;
};

export default function Partners() {
     /** Table data & UI state */
    const [items, setItems] = useState<PartnerRow[]>([]);
    const [loading, setLoading] = useState(true);
    /** Filters */
    const [status, setStatus] = useState<PartnerStatus | "">("");
    const [q, setQ] = useState("");
    /** Which rows are expanded to show details */
    const [open, setOpen] = useState<Set<string>>(new Set());

    /** Auth token & headers */
    const [token, setToken] = useState("");

    /**
   * Read token from localStorage on mount.
   * Safe-guarded for SSR/Next.js by checking window existence.
   */
    useEffect(() => {
        const t = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
        setToken(t);
    }, []);

    /**
   * Memoize Authorization header to avoid re-creating objects each render.
   * If token is empty, skip the header entirely.
   */
    const authHeaders = useMemo(
        () => (token ? { Authorization: `Bearer ${token}` } : undefined),
        [token]
    );

     /**
   * Toggle expand/collapse state for a given row id.
   * Uses Set to keep O(1) membership checks and immutable updates.
   */
    const toggle = (id: string) =>
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
            next.delete(id);
            } else {
            next.add(id);
            }
            return next;
    });


    /**
   * Fetch applications from the API with current filters.
   * - Builds a query string for `status` and free-text search `q`
   * - Requires auth headers; no-op if missing (not authenticated yet)
   */
    const load = useCallback(async () => {
        if (!authHeaders) return; // Wait until token is available
        setLoading(true);
        try {
            const qs = new URLSearchParams();
            if (status) qs.set("status", status);
            if (q.trim()) qs.set("q", q.trim());
            const url = `${API}/partners${qs.toString() ? `?${qs.toString()}` : ""}`;

        const res = await makeApiRequest<{ applications: PartnerRow[] }>(url, {
            method: "GET",
            headers: authHeaders,
        });

        setItems(res.applications ?? []);
        } catch (e) {
            console.error("Failed to fetch partners:", e);
        } finally {
            setLoading(false);
        }
    }, [status, q, authHeaders]);

    /**
   * Initial & reactive load:
   * Re-run whenever `load` identity changes (i.e., when filters or auth change).
   */
    useEffect(() => {
        load();
    }, [load]); 

    /**
   * Local filtered view (kept as a hook for future client-side filters/pagination).
   * Currently just returns the items.
   */
    const filtered = useMemo(() => items, [items]);

    /**
   * Optimistically update application status.
   * - PATCHes the row
   * - Updates the local list if server call succeeds
   */
    async function updateStatus(id: string, next: PartnerStatus) {
        try {
            await makeApiRequest(`${API}/partners/${id}`, {
                method: "PATCH",
                headers: authHeaders,
                body: { status: next },
            });
            setItems((arr) => arr.map((a) => (a.id === id ? { ...a, status: next } : a)));
        } catch (e) {
            console.error("Update failed:", e);
        }
    }

     /**
   * Delete an application after a user confirmation.
   * - DELETEs on the server
   * - Removes the row locally
   */
    async function remove(id: string) {
        if (!confirm("Delete this application?")) return;
        try {
            await makeApiRequest(`${API}/partners/${id}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            setItems((arr) => arr.filter((a) => a.id !== id));
        } catch (e) {
            console.error("Delete failed:", e);
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Partner Applications</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                {/* Status filter */}
                <select className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as PartnerStatus | "")}>
                <option value="">All statuses</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                </select>

                {/* Free-text search */}
                <input
                className="border rounded px-3 py-2"
                placeholder="Search org/contact/email…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && load()}
                />
                {/* Explicit apply button (debouncing could be added later) */}
                <button onClick={load} className="rounded bg-wondergreen text-white px-4 py-2">Apply</button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5 bg-white">
                <table className="min-w-[900px] w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr className="text-left">
                        <Th></Th>
                        <Th>Org</Th>
                        <Th>Contact</Th>
                        <Th>Email</Th>
                        {/* <Th>Phone</Th>  */}
                        <Th>Type</Th>
                        <Th>Status</Th>
                        <Th>City/State</Th>
                        <Th>Created</Th>
                        <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="py-8 text-center">Loading…</td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="py-8 text-center">No applications</td>
                            </tr>
                        ) : (
                            filtered.map((a) => {
                                const isOpen = open.has(a.id);
                                return (
                                    <React.Fragment key={a.id}>
                                    <tr className="border-t">
                                        <Td className="w-10">
                                        <button
                                            aria-label={isOpen ? "Collapse" : "Expand"}
                                            onClick={() => toggle(a.id)}
                                            className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100"
                                        >
                                            <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
                                        </button>
                                        </Td>

                                        {/* Basic columns */}
                                        <Td>{a.orgName}</Td>
                                        <Td>{a.contactName}</Td>
                                        <Td>
                                        <a className="text-wondergreen underline" href={`mailto:${a.email}`}>
                                            {a.email}
                                        </a>
                                        </Td>

                                        {/* Phone column
                                        <Td>
                                        {a.phone ? (
                                            <a href={`tel:${a.phone}`} className="text-wondergreen underline">
                                            {(() => {
                                                const d = (a.phone ?? "").replace(/\D/g, "");
                                                const ten = d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
                                                return ten.length === 10 ? formatUs(ten) : a.phone;
                                            })()}
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                        </Td> */}

                                        <Td className="capitalize">{a.partnerType}</Td>
                                        <Td><StatusBadge value={a.status} /></Td>
                                        <Td>{[a.city, a.state].filter(Boolean).join(", ")}</Td>
                                        <Td>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—"}</Td>

                                        {/* Row actions */}
                                        <Td className="text-right">
                                        <div className="inline-flex gap-2">
                                            {a.status !== "reviewing" && (
                                            <Btn onClick={() => updateStatus(a.id, "reviewing")}>Review</Btn>
                                            )}
                                            {a.status !== "approved" && (
                                            <Btn onClick={() => updateStatus(a.id, "approved")}>Approve</Btn>
                                            )}
                                            {a.status !== "rejected" && (
                                            <Btn onClick={() => updateStatus(a.id, "rejected")} kind="danger">
                                                Reject
                                            </Btn>
                                            )}
                                            <Btn onClick={() => remove(a.id)} kind="ghost">Delete</Btn>
                                        </div>
                                        </Td>
                                    </tr>

                                    {/* Expanded details row */}
                                    {isOpen && (
                                        <tr key={`${a.id}-details`} className="border-t bg-gray-50/60">
                                        <Td colSpan={10} className="px-6 py-5">
                                            <div className="grid gap-4">
                                            <TwoCol
                                            label="Contact"
                                            value={
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 break-words">
                                                <span className="text-gray-600 font-medium">Website:</span>
                                                {a.website ? (
                                                    <a
                                                    href={a.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-wondergreen underline"
                                                    >
                                                    {a.website}
                                                    </a>
                                                ) : (
                                                    <span>—</span>
                                                )}

                                                {a.website && a.phone && <span className="text-gray-300">•</span>}

                                                <span className="text-gray-600 font-medium">Phone:</span>
                                                {a.phone ? (
                                                    <a href={`tel:${a.phone}`} className="text-wondergreen underline">
                                                    {(() => {
                                                        const d = (a.phone ?? "").replace(/\D/g, "");
                                                        const ten = d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
                                                        return ten.length === 10 ? formatUs(ten) : a.phone;
                                                    })()}
                                                    </a>
                                                ) : (
                                                    <span>—</span>
                                                )}
                                                </div>
                                            }
                                            />

                                            <Block title="How can you help?" text={a.howCanYouHelp} />

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <Block title="Preferred dates / season" text={a.preferredDates} />
                                                <Block title="Budget or in-kind" text={a.budgetOrInKind} />
                                            </div>

                                            <Block title="Notes" text={a.notes} />
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

/* ---------- Small UI helpers (kept local for cohesion) ---------- */

type ThProps = React.PropsWithChildren<{ className?: string }>;
type TdProps = React.PropsWithChildren<{ className?: string; colSpan?: number }>;

type ButtonKind = "primary" | "danger" | "ghost";
type BtnProps = React.PropsWithChildren<{
  onClick: () => void;
  kind?: ButtonKind;
}>;

//Table header cell with consistent padding and weight.
function Th({ children, className = "" }: ThProps) {
    return <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>;
}

//Table data cell with consistent padding and vertical alignment.
function Td({ children, className = "", colSpan }: TdProps) {
    return <td colSpan={colSpan} className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}

//Small button variants used in the actions column.
function Btn({ children, onClick, kind = "primary" }: BtnProps) {
    const base = "px-3 py-1.5 rounded text-sm font-medium border";
    const map: Record<ButtonKind, string> = {
        primary: "bg-wondergreen text-white border-transparent hover:brightness-105",
        danger: "bg-red-600 text-white border-transparent hover:brightness-105",
        ghost: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50",
    };
    return (
        <button onClick={onClick} className={`${base} ${map[kind]}`}>
        {children}
        </button>
    );
}

//Badge for visualizing the application status in the table.
function StatusBadge({ value }: { value: PartnerStatus }) {
    const styles: Record<PartnerStatus, string> = {
        new: "bg-amber-100 text-amber-800",
        reviewing: "bg-blue-100 text-blue-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
    };
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[value]}`}>{value}</span>;
}

//Two-column label/value layout used inside the expanded details row.
function TwoCol({ label, value }: { label: string; value?: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[max-content,1fr] items-center gap-x-3 gap-y-1">
        <div className="text-sm font-medium text-gray-600">{label}</div>
        <div className="text-sm text-gray-900 break-words">{value || "—"}</div>
        </div>
    );
}


//Bordered block for long text fields in the expanded row.
function Block({ title, text }: { title: string; text?: string | null }) {
    return (
        <div className="rounded-xl border p-4 bg-white">
        <div className="font-semibold mb-2 text-gray-800">{title}</div>
        <div className="whitespace-pre-wrap text-sm">{text?.trim() ? text : "—"}</div>
        </div>
    );
}
