"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./Header";
import CardsView from "./CardsView";
import ProgramCalendar from "../calendar";
import type { Child } from "@/types/child";
import { useProgram } from "../../../../../hooks/useProgram";
import { useUser } from "../../../../../hooks/useUser";

type ViewMode = "cards" | "calendar";

export default function YourPrograms() {
    const router = useRouter();
    const { programs, loading, refetch } = useProgram(undefined);
    const { user } = useUser();

    const [viewMode, setViewMode] = useState<ViewMode>("cards");
    const [currProgramIdx, setCurrProgramIdx] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);
    const cardsRef = useRef<HTMLDivElement>(null);

    // programs only for the user's children
    const usersPrograms = useMemo(() => {
        const childIdSet = new Set((user?.children ?? []).map(c => c.id));
        return (programs ?? [])
            .filter(p => (p.childIds ?? []).some(id => childIdSet.has(id)))
            .map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                city: p.city,
                state: p.state,
                startDate: p.startDate,
                endDate: p.endDate,
                sessionSchedule: p.sessionSchedule,
                childIds: (p.childIds ?? []).filter(id => childIdSet.has(id)),
                image: p.image,
                venue: p.venue,
                ageMin: p.ageMin,
                ageMax: p.ageMax,
                label: p.label,
            }));
    }, [programs, user?.children]);

    // only active/future ones (endDate >= today)
    const visiblePool = useMemo(() => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return usersPrograms.filter(p => {
            const endDay = new Date(p.endDate);
            return !Number.isNaN(endDay.getTime()) && endDay >= today;
        });
    }, [usersPrograms]);

    useEffect(() => {
        if (visiblePool.length && currProgramIdx >= visiblePool.length) setCurrProgramIdx(0);
    }, [visiblePool.length, currProgramIdx]);

    const childById = useMemo(() => {
        const map = new Map<string, Child>();
        for (const child of (user?.children ?? [])) map.set(child.id, child);
        return map;
    }, [user?.children]);

    // Calendar programs need a stable id — filter out any without one
    const calendarPrograms = useMemo(() =>
        usersPrograms
            .filter((p): p is typeof p & { id: string } => !!p.id)
            .map(p => ({ id: p.id, name: p.name, startDate: p.startDate, endDate: p.endDate, sessionSchedule: p.sessionSchedule })),
        [usersPrograms]
    );

    const handlePickFromCalendar = (programId: string) => {
        const idx = visiblePool.findIndex(p => p.id === programId);
        if (idx < 0) return;
        setCurrProgramIdx(idx);
        setViewMode("cards");
        setTimeout(() => cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    };

    const handleViewDetails = (programId?: string) => {
        if (programId) router.push(`/programs/${programId}`);
    };

    if (loading) {
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
            <Header
                hasPrograms={visiblePool.length > 0}
                viewMode={viewMode}
                onChangeView={setViewMode}
            />

            {viewMode === "cards" ? (
                <CardsView
                    refEl={cardsRef}
                    pool={visiblePool}
                    currIndex={currProgramIdx}
                    setCurrIndex={setCurrProgramIdx}
                    editingId={editingId}
                    setEditingId={setEditingId}
                    childById={childById}
                    onViewDetails={handleViewDetails}
                    onAfterUnenroll={refetch}
                />
            ) : (
                <div className="mt-2">
                    <ProgramCalendar programs={calendarPrograms} onPick={handlePickFromCalendar} />
                </div>
            )}
        </div>
    );
}
