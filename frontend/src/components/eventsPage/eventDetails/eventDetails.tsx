'use client';

import AppIcon from '@/app/icon.png';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { useEvent } from '../../../../hooks/useEvent';
import { useUser } from '../../../../hooks/useUser';
import { makeApiRequest, determineEnv } from '../../../../utils/api';
import EventAsideCard from './EventAsideCard';
import EventAboutSection from './EventAboutSection';

const WONDERHOOD_URL = determineEnv();

export default function EventDetails() {
    const { eventId } = useParams();
    const { event, loading, error, refetch } = useEvent(eventId);
    const { user } = useUser();

    const [serverError, setServerError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [successEnroll, setSuccessEnroll] = useState(false);

    const toggleChild = (id: string) => {
        setSelected(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
        });
    };

    const eventParticipantSet = useMemo(
        () => new Set(event?.childIds ?? []),
        [event?.childIds]
    );

    const handleEnroll = async (e: React.FormEvent) => {
        e.preventDefault();
        const childIds = Array.from(selected);
        if (childIds.length === 0) return;

        try {
        await makeApiRequest(`${WONDERHOOD_URL}/event/${eventId}/enroll`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: { childIds },
        });
        setShowForm(false);
        setSuccessEnroll(true);
        setSelected(new Set());
        refetch();
        } catch (err) {
        setServerError(err instanceof Error ? err.message : 'A network error occurred. Please try again later.');
        }
    };

    const hasCapacity =
        typeof event?.participants === 'number' &&
        (event?.participants ?? 0) < (event?.limit ?? 0);

    if (loading) {
        return <div className="min-h-[60vh] grid place-items-center text-gray-600">Loading event details…</div>;
    }
    if (error) {
        return (
        <div className="min-h-[60vh] grid place-items-center">
            <div className="text-red-600">
            Error: {error}{' '}
            <button onClick={refetch} className="ml-3 underline text-wondergreen">Try again</button>
            </div>
        </div>
        );
    }
    if (!event) {
        return <div className="min-h-[60vh] grid place-items-center">Event not found</div>;
    }

    // hero calendar badge
    // const d = new Date(event.date);
    // const calMonth = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    // const calDay = d.getDate();
    // const calYear = d.getFullYear();

    return (
        <div className="pb-12 bg-wonderbg min-h-screen">
        {/* HERO */}
        <header className="relative">
            <div className="relative h-56 sm:h-72 md:h-96 w-full overflow-hidden rounded-b-3xl shadow-md">
            {event.image ? (
                <img src={event.image} alt={event.name} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-wondergreen via-wonderleaf to-wondergreen" />
            )}

            {!event.image && (
                <div className="absolute inset-0 grid place-items-center">
                    <Image src={AppIcon} alt="WonderHood" width={112} height={112} className="opacity-40" priority={false} />
                </div>
            )}

            {/* mini calendar badge */}
            {/* <div className="absolute top-4 right-4 rounded-lg overflow-hidden shadow-md bg-white/95 text-center">
                <div className="bg-wondersun text-gray-900 px-2 py-1 text-[10px] font-extrabold tracking-wide">{calMonth}</div>
                <div className="px-2 leading-none py-1 text-xl font-black text-gray-900">{calDay}</div>
                <div className="px-2 pb-1 text-[10px] font-semibold text-gray-600">{calYear}</div>
            </div> */}
            </div>
        </header>

        {/* TITLE */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center mt-8 mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-wondergreen leading-tight mb-6">
                {event.name} <span className="text-wondergreen">in {event.city}</span>
            </h1>
        </div>

        {/* MAIN */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* LEFT: About */}
            <EventAboutSection event={event} />

            {/* RIGHT: Aside card */}
            <EventAsideCard
                event={event}
                hasCapacity={hasCapacity}
                showForm={showForm}
                onToggleForm={() => setShowForm(v => !v)}
                successEnroll={successEnroll}
            />
            </div>

            {/* ENROLL FORM */}
            {showForm && (
            <>
                {user ? (
                user.children?.length ? (
                    <form onSubmit={handleEnroll} className="mt-8 bg-white rounded-2xl border-2 border-wonderorange/20 p-6 sm:p-8 shadow-md">
                    <h3 className="text-lg font-bold text-wondergreen mb-5">Select your child(ren) to enroll</h3>

                    <fieldset className="space-y-3 mb-6">
                        {user.children.map(child => {
                        const childId = `child-${child.id}`;
                        const isChecked = selected.has(child.id);
                        const alreadyEnrolled = eventParticipantSet.has(child.id);

                        return (
                            <label
                            key={child.id}
                            htmlFor={childId}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                isChecked ? 'border-wondergreen bg-wondergreen/5' : 'border-gray-200 bg-gray-50'
                            } ${alreadyEnrolled ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                            <input
                                id={childId}
                                type="checkbox"
                                name="children"
                                value={child.id}
                                checked={isChecked}
                                onChange={() => toggleChild(child.id)}
                                className="h-5 w-5 rounded border-gray-300 accent-wondergreen cursor-pointer"
                                disabled={alreadyEnrolled}
                                aria-describedby={alreadyEnrolled ? `${childId}-hint` : undefined}
                            />
                            <span className="flex-1">
                                <span className="font-semibold text-gray-900">
                                {child.firstName} {child.lastName}
                                </span>
                                {alreadyEnrolled && (
                                <span id={`${childId}-hint`} className="text-xs text-gray-500 ml-2">
                                    (already enrolled)
                                </span>
                                )}
                            </span>
                            </label>
                        );
                        })}
                    </fieldset>

                    {serverError && (
                        <div className="mb-4 rounded-lg bg-red-50 text-red-700 border border-red-200 p-4 text-sm">{serverError}</div>
                    )}

                    <div className="flex items-center gap-4">
                        <button
                        type="submit"
                        className="rounded-lg bg-wondergreen px-6 py-3 text-white font-bold uppercase tracking-wide text-sm hover:bg-wonderleaf transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selected.size === 0}
                        aria-disabled={selected.size === 0}
                        >
                        Enroll
                        </button>
                        <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setServerError(null);
                        }}
                        className="text-gray-600 font-medium hover:text-gray-900 underline"
                        >
                        Cancel
                        </button>
                    </div>
                    </form>
                ) : (
                    <div className="mt-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 text-amber-900 font-semibold">
                    You don't have any children in your account. Please add a child to enroll in events.
                    </div>
                )
                ) : (
                <div className="mt-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 text-amber-900 font-semibold">
                    Please create an account or log in to enroll in events.
                </div>
                )}
            </>
            )}
        </main>
        </div>
    );
}
