import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import ProgramCard from "./ProgramCard";
import type { Child } from "@/types/child";
import type { ProgramVenue } from "@/types/program";
import { useMemo } from "react";

type ProgramLite = {
    id?: string;
    name: string;
    description?: string;
    city?: string | null;
    state?: string | null;
    startDate: string;
    endDate: string;
    sessionSchedule?: string | null;
    childIds?: string[];
    image?: string | null;
    venue: ProgramVenue;
};

type Props = {
    refEl: React.Ref<HTMLDivElement>;
    pool: ProgramLite[];
    currIndex: number;
    setCurrIndex: (i: number) => void;
    editingId: string | null;
    setEditingId: (v: string | null) => void;
    childById: Map<string, Child>;
    onViewDetails: (id?: string) => void;
    onAfterUnenroll: () => void | Promise<void>;
};

export default function CardsView({
    refEl, pool, currIndex, setCurrIndex,
    editingId, setEditingId, childById,
    onViewDetails, onAfterUnenroll
}: Props) {

    // DESKTOP (≥ lg): show 2 at a time
    const visible2 = useMemo(() => {
        if (!pool.length) return [];
        const n = Math.min(2, pool.length);
        return Array.from({ length: n }, (_, i) => {
            const idx = (((currIndex + i) % pool.length) + pool.length) % pool.length;
            return pool[idx];
        });
    }, [pool, currIndex]);

    // TABLET (md–lg): show 1 at a time
    const visible1 = useMemo(() => {
        if (!pool.length) return [];
        const idx = ((currIndex % pool.length) + pool.length) % pool.length;
        return [pool[idx]];
    }, [pool, currIndex]);

    const prev2 = () =>
        pool.length && setCurrIndex(((currIndex - 2) % pool.length + pool.length) % pool.length);
    const next2 = () =>
        pool.length && setCurrIndex(((currIndex + 2) % pool.length + pool.length) % pool.length);

    const prev1 = () =>
        pool.length && setCurrIndex(((currIndex - 1) % pool.length + pool.length) % pool.length);
    const next1 = () =>
        pool.length && setCurrIndex(((currIndex + 1) % pool.length + pool.length) % pool.length);

    return (
        <>
        <div ref={refEl} className="scroll-mt-24" />

        {/* MOBILE: all programs stacked, no arrows */}
        <div className="md:hidden">
            <div className="grid grid-cols-1 gap-4 sm:gap-5">
                {pool.map(program => (
                    <ProgramCard
                        key={program.id ?? program.name + program.startDate}
                        program={program}
                        isEditing={editingId === program.id}
                        onToggleEdit={() =>
                            setEditingId(editingId === program.id ? null : (program.id ?? null))
                        }
                        childById={childById}
                        onViewDetails={() => onViewDetails(program.id)}
                        onAfterUnenroll={async () => { await onAfterUnenroll(); setEditingId(null); }}
                    />
                ))}
            </div>
        </div>

        {/* TABLET: one card with centered arrows if more than 1 */}
        <div className="hidden md:block lg:hidden relative">
            {pool.length > 1 && (
                <>
                <button
                    type="button"
                    aria-label="Previous"
                    onClick={prev1}
                    className="absolute left-0 top-1/2 -translate-y-1/2
                                w-12 h-12 rounded-full bg-wonderleaf hover:bg-wondergreen
                                text-white shadow-lg transition-all"
                >
                    <FaCircleChevronLeft className="w-6 h-6 mx-auto" />
                </button>
                <button
                    type="button"
                    aria-label="Next"
                    onClick={next1}
                    className="absolute right-0 top-1/2 -translate-y-1/2
                                w-12 h-12 rounded-full bg-wonderleaf hover:bg-wondergreen
                                text-white shadow-lg transition-all"
                >
                    <FaCircleChevronRight className="w-6 h-6 mx-auto" />
                </button>
                </>
            )}

            <div className="mx-16">
                {visible1.map(program => (
                    <ProgramCard
                        key={program.id ?? program.name + program.startDate}
                        program={program}
                        isEditing={editingId === program.id}
                        onToggleEdit={() =>
                            setEditingId(editingId === program.id ? null : (program.id ?? null))
                        }
                        childById={childById}
                        onViewDetails={() => onViewDetails(program.id)}
                        onAfterUnenroll={async () => { await onAfterUnenroll(); setEditingId(null); }}
                    />
                ))}
            </div>
        </div>

        {/* DESKTOP: two cards with centered arrows if more than 2 */}
        <div className="hidden lg:flex items-center gap-3 sm:gap-4">
            {pool.length > 2 && (
                <button
                    type="button"
                    aria-label="Previous"
                    onClick={prev2}
                    className="flex items-center justify-center
                            w-12 h-12 rounded-full bg-wonderleaf hover:bg-wondergreen
                            text-white shadow-lg transition-all flex-shrink-0"
                >
                    <FaCircleChevronLeft className="w-6 h-6" />
                </button>
            )}

            <div className="grid grid-cols-2 gap-4 sm:gap-5 flex-1">
                {visible2.map(program => (
                    <ProgramCard
                        key={program.id ?? program.name + program.startDate}
                        program={program}
                        isEditing={editingId === program.id}
                        onToggleEdit={() =>
                            setEditingId(editingId === program.id ? null : (program.id ?? null))
                        }
                        childById={childById}
                        onViewDetails={() => onViewDetails(program.id)}
                        onAfterUnenroll={async () => { await onAfterUnenroll(); setEditingId(null); }}
                    />
                ))}
            </div>

            {pool.length > 2 && (
                <button
                    type="button"
                    aria-label="Next"
                    onClick={next2}
                    className="flex items-center justify-center
                            w-12 h-12 rounded-full bg-wonderleaf hover:bg-wondergreen
                            text-white shadow-lg transition-all flex-shrink-0"
                >
                    <FaCircleChevronRight className="w-6 h-6" />
                </button>
            )}
        </div>
        </>
    );
}
