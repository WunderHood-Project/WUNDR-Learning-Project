"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import Header from "./Header";
import CardsView from "./CardsView";
import EventCalendar from "../calendar";
import type { Child } from "@/types/child";
import {useEvent} from "../../../../../hooks/useEvent";
import {useUser} from "../../../../../hooks/useUser";
import {combineLocal} from "../../../../../utils/formatDate";

type ViewMode = "cards" | "calendar";

export default function YourEvents() {
  const router = useRouter();
  const { events, loading, refetch } = useEvent(undefined);
  const { user } = useUser();

  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [currEventIdx, setCurrEventIdx] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // events only for the user's children
  const usersEvents = useMemo(() => {
    const childIdSet = new Set((user?.children ?? []).map(c => c.id));
    return (events ?? [])
      .filter(e => (e.childIds ?? []).some(id => childIdSet.has(id)))
      .map(e => ({
        id: e.id, name: e.name, description: e.description,
        city: e.city, date: e.date, startTime: e.startTime, endTime: e.endTime,
        childIds: (e.childIds ?? []).filter(id => childIdSet.has(id)),
        image: e.image, schoolAccess: e.schoolAccess ?? "all",
      }));
  }, [events, user?.children]);

  // only future ones
  const visiblePool = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    return usersEvents.filter(e => {
      const m = String(e.date).match(/^\d{4}-\d{2}-\d{2}/);
      const eventDay = m ? combineLocal(m[0], "00:00") : new Date(e.date);
      return !Number.isNaN(eventDay.getTime()) && eventDay >= today;
    });
  }, [usersEvents]);

  useEffect(() => { if (visiblePool.length && currEventIdx >= visiblePool.length) setCurrEventIdx(0); },
    [visiblePool.length, currEventIdx]);

  // Quick child name by ID
  const childById = useMemo(() => {
    const map = new Map<string, Child>();
    for (const child of (user?.children ?? [])) map.set(child.id, child);
    return map;
  }, [user?.children]);

  const handlePickFromCalendar = (eventId: string) => {
    const idx = visiblePool.findIndex(e => e.id === eventId);
    if (idx < 0) return;
    setCurrEventIdx(idx);
    setViewMode("cards");
    setTimeout(() => cardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const handleViewDetails = (eventId?: string) => {
    if (eventId) router.push(`/events/${eventId}`);
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
        hasEvents={visiblePool.length > 0}
        viewMode={viewMode}
        onChangeView={setViewMode}
      />

      {viewMode === "cards" ? (
        <CardsView
          refEl={cardsRef}
          pool={visiblePool}
          currIndex={currEventIdx}
          setCurrIndex={setCurrEventIdx}
          editingId={editingId}
          setEditingId={setEditingId}
          childById={childById}
          onViewDetails={handleViewDetails}
          onAfterUnenroll={refetch}
        />
      ) : (
        <div className="mt-2">
          <EventCalendar events={usersEvents} onPick={handlePickFromCalendar} />
        </div>
      )}
    </div>
  );
}

