'use client';

import { useMemo, useState, type ReactNode } from 'react';
import type { Event } from '@/types/event';
import { formatTimeRange12h } from '../../../../utils/formatDate';
import type { Child } from '@/types/child';

type Props = {
    event: Event;
    hasCapacity: boolean;
    showForm: boolean;
    onToggleForm: () => void;
    successEnroll: boolean;
    userHasChildEnrolled: boolean;
    // ✅ admin attendees
    isAdmin: boolean;
    attendeesOpen: boolean;
    attendees: Child[] | null;
    attendeesLoading: boolean;
    attendeesError: string | null;
    onToggleAttendees: () => void;
    enrollmentContent?: ReactNode;
};

export default function EventAsideCard({
    event,
    hasCapacity,
    showForm,
    onToggleForm,
    successEnroll,
    userHasChildEnrolled,
    isAdmin,
    attendeesOpen,
    attendees,
    attendeesLoading,
    attendeesError,
    onToggleAttendees,
    enrollmentContent,
}: Props) {
    const enrolled = event.participants ?? 0;
    const limit = event.limit;
    const unlimited = limit == null;
    const spotsLeft = unlimited ? null : Math.max(0, limit - enrolled);
    const timeLabel = formatTimeRange12h(event.date, event.startTime, event.endTime);

    const progressPct = useMemo(() => {
        if (unlimited || !limit) return 0;
        return Math.min(100, Math.max(0, (enrolled / limit) * 100));
    }, [enrolled, limit, unlimited]);

    const d = useMemo(() => new Date(event.date), [event.date]);
    const calMonth = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const calDay = d.getDate();
    const calYear = d.getFullYear();

    // Tracks which attendee row is expanded (accordion behavior).
    // Only one child is expanded at a time for readability.
    const [expandedChildId, setExpandedChildId] = useState<string | null>(null);

    const toggleExpanded = (id: string) => {
        setExpandedChildId((prev) => (prev === id ? null : id));
    };

    return (
        <aside className="lg:col-span-1">
            <div className="sticky top-4 sm:lg:sticky sm:lg:top-6 bg-white/50 rounded-2xl backdrop-blur-sm border border-white/60 shadow-md p-4 sm:p-6">
                {/* Label badge */}
                <div className="flex items-center justify-between mb-3">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            event.label === "partner"
                                ? "bg-wonderorange text-white"
                                : "bg-wondergreen text-white"
                        }`}
                    >
                        {event.label === "partner" ? "Partner Event" : "WonderHood Event"}
                    </span>
                </div>

                {/* Header with spots left */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm sm:text-base text-wondergreen uppercase tracking-widest">
                        Participants
                    </h3>
                    <span
                        className="h-8 sm:h-9 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-full
                        text-xs sm:text-sm font-semibold
                        bg-wonderleaf/15 text-wondergreen border border-wonderleaf/40 shadow-sm flex-shrink-0"
                        aria-live="polite"
                    >
                        {unlimited ? "Unlimited spots" : `${spotsLeft} spots left`}
                    </span>
                </div>

                {/* Enrollment progress */}
                <div className="mb-5 sm:mb-6">
                    <p className="text-xs font-bold text-wondergreen mb-2 uppercase tracking-wide">
                        Enrollment Progress
                    </p>
                    <div className="w-full h-2.5 sm:h-3 bg-gray-300 rounded-full overflow-hidden" aria-label="Enrollment progress">
                        <div
                            className="h-full bg-gradient-to-r from-wonderleaf to-wondergreen transition-all duration-300"
                            style={{ width: `${progressPct.toFixed(2)}%` }}
                            role="progressbar"
                            aria-valuenow={Number(progressPct.toFixed(0))}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                    <p className="text-xs text-gray-700 font-medium mt-1.5 sm:mt-2">
                        {unlimited ? `${enrolled} enrolled (no limit)` : `${enrolled} of ${limit} enrolled`}
                    </p>
                </div>

                {/* Date & Time */}
                <div className="mb-3 sm:mb-4 pb-4 sm:pb-5 border-b border-white/50">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm sm:text-base font-bold text-wondergreen uppercase tracking-wide">
                            Event Date &amp; Time
                        </p>

                        {timeLabel && (
                            <span
                                className="hidden sm:inline-flex h-7 sm:h-8 items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 rounded-full
                                        text-[11px] sm:text-[12px] font-medium
                                        bg-wonderleaf/10 text-wondergreen border border-wonderleaf/40 shadow-sm flex-shrink-0"
                                title={timeLabel}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-wonderorange flex-shrink-0"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M12 8a1 1 0 0 1 1 1v3.06l2.28 1.32a1 1 0 1 1-1 1.74l-2.78-1.6A1.5 1.5 0 0 1 10.5 12V9a1 1 0 0 1 1-1Zm0-6a10 10 0 1 1 0 20A10 10 0 0 1 12 2Zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4Z" />
                                </svg>
                                <span>{timeLabel}</span>
                            </span>
                        )}
                    </div>

                    {/* Calendar + Time row (flex on mobile/sm, stack on sm+) */}
                    <div
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4"
                        role="group"
                        aria-label={`Event date ${calMonth} ${calDay}, ${calYear}${timeLabel ? `, ${timeLabel}` : ''}`}
                    >
                        {/* Mini calendar tile */}
                        <div className="w-24 sm:w-28 rounded-lg overflow-hidden shadow-sm bg-white/95 text-center border border-gray-200 flex-shrink-0">
                            <div className="bg-wondersun text-gray-900 px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-extrabold tracking-wide">
                                {calMonth}
                            </div>
                            <div className="px-2 leading-none py-0.5 sm:py-1 text-xl sm:text-2xl font-black text-gray-900">
                                {calDay}
                            </div>
                            <div className="px-2 pb-0.5 text-[9px] sm:text-[10px] font-semibold text-gray-600">
                                {calYear}
                            </div>
                        </div>

                        {/* Mobile-only time pill below calendar */}
                        {timeLabel && (
                            <span
                                className="sm:hidden inline-flex items-center gap-2 rounded-full
                                        px-3 py-1.5 text-[12px] leading-tight
                                        bg-wonderleaf/10 text-wondergreen border border-wonderleaf/40 shadow-sm"
                                title={timeLabel}
                            >
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-wonderorange flex-shrink-0" fill="currentColor" aria-hidden="true">
                                    <path d="M12 8a1 1 0 0 1 1 1v3.06l2.28 1.32a1 1 0 1 1-1 1.74l-2.78-1.6A1.5 1.5 0 0 1 10.5 12V9a1 1 0 0 1 1-1Zm0-6a10 10 0 1 1 0 20A10 10 0 0 1 12 2Zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4Z" />
                                </svg>
                                <span className="font-medium">{timeLabel}</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Address */}
                <div className="mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base font-bold text-wondergreen uppercase tracking-wide mb-2">
                        📍 Full Address
                    </p>
                    <div className="text-xs sm:text-sm text-gray-700 space-y-0.5">
                        {!!event.address && (
                            <p className="font-medium">{event.address}</p>
                        )}
                        <p className="text-gray-600">
                            {event.city}, {event.state} {event.zipCode}
                        </p>
                    </div>
                </div>

                {/* School access */}
                <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-sm sm:text-base font-bold text-wondergreen uppercase tracking-wide">
                        Who can enroll
                    </p>

                    <span className="inline-flex items-center rounded-full px-3 py-1.5 bg-wonderleaf/10 text-wondergreen border border-wonderleaf/30 font-medium text-xs sm:text-sm">
                        {displaySchoolAccess(event.schoolAccess)}
                    </span>
                </div>

                {/* Age range */}
                {(event.ageMin != null || event.ageMax != null) && (
                    <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3 flex-wrap">
                        <p className="text-sm sm:text-base font-bold text-wondergreen uppercase tracking-wide">
                            Age Range
                        </p>
                        <span className="inline-flex items-center rounded-full px-3 py-1.5 bg-wonderleaf/10 text-wondergreen border border-wonderleaf/30 font-medium text-xs sm:text-sm">
                            {event.ageMin != null && event.ageMax != null
                                ? `${event.ageMin}–${event.ageMax} yrs`
                                : event.ageMin != null
                                    ? `${event.ageMin}+ yrs`
                                    : `Up to ${event.ageMax} yrs`}
                        </span>
                    </div>
                )}

                {/* Partner disclaimer */}
                {event.label === "partner" && (
                    <div className="mb-4 sm:mb-5 rounded-xl border border-wonderorange/30 bg-wonderorange/5 px-4 py-3">
                        <p className="text-xs font-bold text-wonderorange uppercase tracking-wide mb-1">
                            Third-Party Event
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            This event is organized by an independent partner. WonderHood is not liable or responsible for the content, safety, or conduct of partner-hosted events. Please contact the organizer directly with any questions or concerns.
                        </p>
                    </div>
                )}

                {/* Availability + CTA */}
                {userHasChildEnrolled ? (
                    <>
                        <button
                            disabled
                            className="w-full rounded-full bg-wonderleaf text-white px-4 sm:px-5 py-2 sm:py-2.5 font-bold uppercase tracking-wide text-xs sm:text-sm mb-2.5 sm:mb-3 cursor-default"
                        >
                            ✓ Enrolled
                        </button>

                        <button
                            onClick={onToggleForm}
                            className="w-full rounded-full bg-wondergreen px-4 sm:px-5 py-2.5 sm:py-3 text-white font-bold uppercase tracking-wide text-xs sm:text-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Manage Enrollment
                        </button>

                        <div className="mt-2 text-center text-gray-700 bg-white/40 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-sm">
                            Your child is enrolled. Manage or update enrollment here.
                        </div>
                    </>
                ) : hasCapacity ? (
                    <>
                        <button
                            disabled
                            className="w-full rounded-full bg-wonderleaf text-white px-4 sm:px-5 py-2 sm:py-2.5 font-bold uppercase tracking-wide text-xs sm:text-sm mb-2.5 sm:mb-3 cursor-default"
                        >
                            ✓ Spots Available
                        </button>

                        <button
                            onClick={onToggleForm}
                            className="w-full rounded-full bg-wondergreen px-4 sm:px-5 py-2.5 sm:py-3 text-white font-bold uppercase tracking-wide text-xs sm:text-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {showForm ? "Choose Child" : "Enroll in Event"}
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            disabled
                            className="w-full rounded-full bg-gray-400 text-white px-4 sm:px-5 py-2 sm:py-2.5 font-bold uppercase tracking-wide text-xs sm:text-sm mb-2.5 sm:mb-3 cursor-default"
                        >
                            Full Capacity
                        </button>

                        <div className="text-center text-gray-700 bg-white/40 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-sm">
                            Sorry, all spots are taken
                        </div>
                    </>
                )}

                {showForm && enrollmentContent && (
                    <div className="mt-4">
                        {enrollmentContent}
                    </div>
                )}

                {successEnroll && (
                    <div
                        className="mt-3 sm:mt-4 text-center text-green-800 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-sm"
                        role="status"
                        aria-live="polite"
                    >
                        Enrollment successful!
                    </div>
                )}
                {/* Admin-only Attendees
                    This section is shown only to admins.
                    Attendee details are fetched from a protected backend endpoint and include:
                    - child list enrolled in the event
                    - photo consent + waiver status
                    - parent contact info
                    - emergency contacts
                    - medical/allergies + notes
                */}
                {isAdmin && (
                <div className="mt-5 pt-5 border-t border-white/50">
                    <div className="flex items-center justify-between">
                    <p className="text-sm sm:text-base font-bold text-wondergreen uppercase tracking-wide">
                        Attendees (Admin)
                    </p>

                    <button
                        type="button"
                        onClick={onToggleAttendees}
                        className="text-xs font-semibold text-wondergreen underline hover:opacity-80"
                    >
                        {attendeesOpen ? "Hide" : "View"}
                    </button>
                    </div>

                    {attendeesOpen && (
                    <div className="mt-3">
                        {attendeesLoading ? (
                            <div className="text-xs text-gray-600">Loading attendees…</div>
                        ) : attendeesError ? (
                            <div className="text-xs text-red-600">{attendeesError}</div>
                        ) : !attendees?.length ? (
                            <div className="text-xs text-gray-600">No enrolled children yet.</div>
                        ) : (
                            <ul className="space-y-2">
                                {attendees.map((c) => {
                                    const isOpen = expandedChildId === c.id;

                                    return (
                                        <li
                                        key={c.id}
                                        className="rounded-xl border border-white/60 bg-white/60 px-3 py-2"
                                        >
                                        {/* Header row (clickable) */}
                                        <button
                                            type="button"
                                            onClick={() => toggleExpanded(c.id)}
                                            className="w-full text-left"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {c.firstName} {c.lastName}
                                                    {c.preferredName ? (
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        ({c.preferredName})
                                                    </span>
                                                    ) : null}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span
                                                    className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                                                        c.photoConsent
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-rose-50 text-rose-700 border-rose-200"
                                                    }`}
                                                    title="Photo consent"
                                                    >
                                                    {c.photoConsent ? "PHOTO OK" : "NO PHOTO"}
                                                    </span>

                                                    <span className="text-xs text-wondergreen underline">
                                                        {isOpen ? "Hide details" : "View details"}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>

                                        {/* Details (expanded) */}
                                        {isOpen && (
                                            <div className="mt-3 rounded-lg bg-white/70 border border-white/70 p-3 space-y-3">

                                            {/* Parents */}
                                            <div>
                                                <div className="text-xs font-bold text-wondergreen uppercase tracking-wide mb-1">
                                                Parents
                                                </div>

                                                {c.parents?.length ? (
                                                <div className="space-y-2">
                                                    {c.parents.map((p) => (
                                                    <div key={p.id} className="text-xs text-gray-800">
                                                        <div className="font-semibold">
                                                        {p.firstName} {p.lastName}
                                                        </div>
                                                        <div className="text-gray-700">
                                                        {p.email} • {p.phoneNumber}
                                                        </div>
                                                    </div>
                                                    ))}
                                                </div>
                                                ) : (
                                                <div className="text-xs text-gray-600">No parent data.</div>
                                                )}
                                            </div>

                                            {/* Emergency contacts */}
                                            <div>
                                                <div className="text-xs font-bold text-wondergreen uppercase tracking-wide mb-1">
                                                Emergency Contacts
                                                </div>

                                                {c.emergencyContacts?.length ? (
                                                <div className="space-y-2">
                                                    {c.emergencyContacts?.map((ec) => (
                                                    <div key={ec.id} className="text-xs text-gray-800">
                                                        <div className="font-semibold">
                                                        {ec.firstName} {ec.lastName}{" "}
                                                        <span className="font-normal text-gray-600">
                                                            ({ec.relationship})
                                                        </span>
                                                        </div>
                                                        <div className="text-gray-700">{ec.phoneNumber}</div>
                                                    </div>
                                                    ))}
                                                </div>
                                                ) : (
                                                <div className="text-xs text-gray-600">No emergency contacts.</div>
                                                )}
                                            </div>

                                            {/* School / Medical / notes */}
                                            <div className="grid gap-2">
                                                <div>
                                                    <div className="text-xs font-bold text-wondergreen uppercase tracking-wide mb-1">
                                                        School
                                                    </div>
                                                    <div className="text-xs text-gray-800 whitespace-pre-wrap">
                                                        {displaySchoolType(c.schoolType)}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-xs font-bold text-wondergreen uppercase tracking-wide mb-1">
                                                        Allergies / Medical
                                                    </div>
                                                    <div className="text-xs text-gray-800 whitespace-pre-wrap">
                                                        {c.allergiesMedical || "—"}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-xs font-bold text-wondergreen uppercase tracking-wide mb-1">
                                                        Notes
                                                    </div>
                                                    <div className="text-xs text-gray-800 whitespace-pre-wrap">
                                                        {c.notes || "—"}
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                        )}
                    </div>
                    )}
                </div>
                )}
            </div>
        </aside>
    );
}

function displaySchoolAccess(access?: Event["schoolAccess"]) {
    switch (access) {
        case "homeschool_only":
            return "Homeschool only";
        case "public_custer_only":
            return "Public school only (Custer County)";
        case "private_custer_only":
            return "Private school only (Custer County)";
        case "all":
        default:
            return "All children";
    }
}

function displaySchoolType(schoolType?: Child["schoolType"]) {
    switch (schoolType) {
        case "homeschool":
            return "Homeschool";
        case "public_custer":
            return "Public school (Custer County School District C-1)";
        case "private_custer":
            return "Private school (Custer County)";
        default:
            return "N/A";
    }
}
