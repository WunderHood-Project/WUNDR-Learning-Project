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
import { normalizeNextImageSrc } from "../../../../utils/image/normalizeNextImageSrc";

const WONDERHOOD_URL = determineEnv();

export default function EventDetails() {
    const { eventId } = useParams();
    const { event, loading, error, refetch } = useEvent(eventId);
    const { user } = useUser();

    const [serverError, setServerError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [successEnroll, setSuccessEnroll] = useState(false);
    const [unenrollId, setUnenrollId] = useState<string | null>(null);
    const [unenrollError, setUnenrollError] = useState<string | null>(null);    

    const toggleChild = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };


    const eventParticipantSet = useMemo(
        () => new Set(event?.childIds ?? []),
        [event?.childIds]
    );

    //Is there at least one child of the current user who is registered for this event?
    const userHasChildEnrolled = useMemo(() => {
        if (!user?.children?.length) return false;
        return user.children.some((child) => eventParticipantSet.has(child.id));
    }, [user, eventParticipantSet]);



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

    const handleUnenrollOne = async (childId: string) => {
        if(!eventId) return;

        setUnenrollId(childId);
        setUnenrollError(null);

        try {
            await makeApiRequest(`${WONDERHOOD_URL}/event/${eventId}/unenroll`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: { childIds: [childId] },
        });
            refetch();
        } catch (err) {
            setServerError(
                err instanceof Error ? err.message : "Failed to unenroll child"
            )
        } finally {
            setUnenrollId(null);
        }
    }

    const hasCapacity = typeof event?.participants === 'number' && (event?.participants ?? 0) < (event?.limit ?? 0);

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

    return (
        <div className="pb-12 bg-wonderbg min-h-screen">
            {/* HERO */}
            <header className="relative">
                <div className="relative h-56 sm:h-72 md:h-96 w-full overflow-hidden rounded-none shadow-md">
                    {(() => {
                        const p = normalizeNextImageSrc(event.image);
                        if (!p) return null;
                        return (
                            <Image
                                src={p.src}
                                alt={event.name}
                                fill
                                priority
                                sizes="100vw"
                                className="absolute inset-0 object-cover"
                                unoptimized={p.unoptimized}
                            />
                        );
                    })()}

                    {!event.image && (
                        <div className="absolute inset-0 bg-gradient-to-br from-wondergreen via-wonderleaf to-wondergreen" />
                    )}

                    {!event.image && (
                        <div className="absolute inset-0 grid place-items-center">
                            <Image
                                src={AppIcon}
                                alt="WonderHood"
                                width={112}
                                height={112}
                                className="opacity-40"
                                priority={false}
                            />
                        </div>
                    )}
                </div>
            </header>

            {/* TITLE */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center md:text-left mt-6 sm:mt-8 mb-10 sm:mb-12">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-wondergreen leading-tight">
                    {event.name} <span className="text-gray-700">in {event.city}</span>
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
                        onToggleForm={() => setShowForm((v) => !v)}
                        successEnroll={successEnroll}
                        userHasChildEnrolled={userHasChildEnrolled}
                    />
                </div>

                {/* ENROLL / UNENROLL FORM */}
                {showForm && (
                    <>
                        {user ? (
                            user.children?.length ? (
                                <form
                                    onSubmit={handleEnroll}
                                    className="mt-8 bg-white/50 rounded-2xl backdrop-blur-sm border border-white/60 p-6 sm:p-8 shadow-md"
                                >
                                    <h3 className="text-lg font-bold text-wondergreen mb-1">
                                        Select your child(ren) to enroll
                                    </h3>
                                    <p className="mb-5 text-sm text-gray-600">
                                        Children marked <span className="font-semibold">ENROLLED</span> are already signed up.
                                        Click <span className="font-semibold text-red-600">Unenroll</span> to remove them from
                                        this event.
                                    </p>

                                    <fieldset className="space-y-3 mb-6">
                                        {user.children.map((child) => {
                                            const childId = `child-${child.id}`;
                                            const isChecked = selected.has(child.id);
                                            const alreadyEnrolled = eventParticipantSet.has(child.id);

                                            // The child is ALREADY registered → name + ENROLLED + Unenroll button
                                            if (alreadyEnrolled) {
                                                return (
                                                    <div
                                                        key={child.id}
                                                        className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 bg-gray-50"
                                                    >
                                                        <span className="font-semibold text-gray-900">
                                                            {child.firstName} {child.lastName}
                                                        </span>

                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                id={`${childId}-hint`}
                                                                className="ml-2 text-xs font-medium text-gray-500 uppercase tracking-wide"
                                                            >
                                                                Enrolled
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUnenrollOne(child.id)}
                                                                disabled={unenrollId === child.id}
                                                                className="px-3 py-1 text-xs font-semibold text-red-700 border border-red-200 rounded-full hover:bg-red-50 disabled:opacity-50"
                                                            >
                                                                {unenrollId === child.id
                                                                    ? "Unenrolling..."
                                                                    : "Unenroll"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            // The child is NOT registered yet → checkbox + name
                                            return (
                                                <label
                                                    key={child.id}
                                                    htmlFor={childId}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                                        isChecked
                                                            ? "border-wondergreen bg-wondergreen/5"
                                                            : "border-gray-200 bg-gray-50"
                                                    }`}
                                                >
                                                    <input
                                                        id={childId}
                                                        type="checkbox"
                                                        name="children"
                                                        value={child.id}
                                                        checked={isChecked}
                                                        onChange={() => toggleChild(child.id)}
                                                        className="h-5 w-5 rounded border-gray-300 accent-wondergreen cursor-pointer"
                                                    />
                                                    <span className="font-semibold text-gray-900">
                                                        {child.firstName} {child.lastName}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </fieldset>

                                    {/* Errors */}
                                    {(serverError || unenrollError) && (
                                        <div className="mb-4 rounded-lg bg-red-50 text-red-700 border border-red-200 p-4 text-sm">
                                            {serverError || unenrollError}
                                        </div>
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
                                                setUnenrollError(null);
                                            }}
                                            className="text-gray-600 font-medium hover:text-gray-900 underline"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6 text-amber-900 font-semibold">
                                    You don&apos;t have any children in your account. Please add a child to enroll in events.
                                </div>
                            )
                        ) : (
                            <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6 text-amber-900 font-semibold">
                                Please create an account or log in to enroll in events.
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );

}