"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import UnifiedCalendar from "./UnifiedCalendar";
import { useEvent } from "../../../../hooks/useEvent";
import { useProgram } from "../../../../hooks/useProgram";
import { useUser } from "../../../../hooks/useUser";

export default function YourCalendar() {
    const router = useRouter();
    const { events, loading: eventsLoading } = useEvent(undefined);
    const { programs, loading: programsLoading } = useProgram(undefined);
    const { user } = useUser();

    const childIdSet = useMemo(
        () => new Set((user?.children ?? []).map(c => c.id)),
        [user?.children]
    );

    const calendarEvents = useMemo(() =>
        (events ?? [])
            .filter(e => e.id && (e.childIds ?? []).some(id => childIdSet.has(id)))
            .map(e => ({
                id: String(e.id),
                name: e.name,
                date: e.date,
                startTime: e.startTime,
            })),
        [events, childIdSet]
    );

    const calendarPrograms = useMemo(() =>
        (programs ?? [])
            .filter(p => p.id && (p.childIds ?? []).some(id => childIdSet.has(id)))
            .map(p => ({
                id: String(p.id),
                name: p.name,
                startDate: p.startDate,
                endDate: p.endDate,
                sessionSchedule: p.sessionSchedule,
            })),
        [programs, childIdSet]
    );

    if (eventsLoading || programsLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wondergreen mx-auto mb-4" />
                    <p className="text-wondergreen font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="ml-2 md:ml-14">
                <h1 className="text-2xl sm:text-2xl md:text-4xl font-bold md:font-extrabold leading-tight tracking-normal md:tracking-tight text-wondergreen/95">
                    Your Calendar
                </h1>
                <div className="h-1 mt-3 rounded-full bg-gradient-to-r from-wondersun to-wonderorange w-24 sm:w-28 md:w-36" />
            </div>

            <UnifiedCalendar
                events={calendarEvents}
                programs={calendarPrograms}
                onPickEvent={(id) => router.push(`/events/${id}`)}
                onPickProgram={(id) => router.push(`/programs/${id}`)}
            />
        </div>
    );
}
