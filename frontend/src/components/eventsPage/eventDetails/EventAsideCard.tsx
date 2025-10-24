'use client';

import { useMemo } from 'react';
import type { Event } from '@/types/event';
import { formatTimeRange12h } from '../../../../utils/formatDate';

type Props = {
    event: Event;
    hasCapacity: boolean;
    showForm: boolean;
    onToggleForm: () => void;
    successEnroll: boolean;
};

export default function EventAsideCard({
    event,
    hasCapacity,
    showForm,
    onToggleForm,
    successEnroll,
}: Props) {
    const enrolled = event.participants ?? 0;
    const limit = event.limit ?? 0;
    const spotsLeft = Math.max(0, limit - enrolled);
    const timeLabel = formatTimeRange12h(event.date, event.startTime, event.endTime);

    const progressPct = useMemo(() => {
        if (!limit) return 0;
        return Math.min(100, Math.max(0, (enrolled / limit) * 100));
    }, [enrolled, limit]);

    const d = useMemo(() => new Date(event.date), [event.date]);
    const calMonth = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const calDay = d.getDate();
    const calYear = d.getFullYear();

    return (
        <aside className="lg:col-span-1">
            <div className="sticky top-4 sm:lg:sticky sm:lg:top-6 bg-white/50 rounded-2xl backdrop-blur-sm border border-white/60 shadow-md p-4 sm:p-6">
                {/* Header with spots left */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm sm:text-base text-wondergreen uppercase tracking-widest">
                        Participants
                    </h3>
                    <span
                        className="h-7 sm:h-8 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 rounded-full
                        text-[11px] sm:text-[12px] font-semibold
                        bg-wonderleaf/10 text-wonderleaf border border-wonderleaf/30 flex-shrink-0"
                        aria-live="polite"
                    >
                        {spotsLeft} spots left
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
                        {enrolled} of {limit} enrolled
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

                {/* Availability + CTA */}
                {hasCapacity ? (
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
                            {showForm ? 'Complete Below' : 'Enroll in Event'}
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

                {successEnroll && (
                    <div
                        className="mt-3 sm:mt-4 text-center text-green-800 bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 font-semibold text-xs sm:text-sm"
                        role="status"
                        aria-live="polite"
                    >
                        Enrollment successful!
                    </div>
                )}
            </div>
        </aside>
    );
}