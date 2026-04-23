import Image from "next/image";
import AppIcon from "@/app/icon.png";
import { normalizeNextImageSrc } from "../../../../../utils/image/normalizeNextImageSrc";
import { formatDate } from "../../../../../utils/formatDate";
import { FaMapPin, FaClock, FaPen } from "react-icons/fa";
import UnenrollProgram from "../unenrollProgram";
import type { Child } from "@/types/child";
import type { ProgramVenue } from "@/types/program";

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
    program: ProgramLite;
    isEditing: boolean;
    onToggleEdit: () => void;
    childById: Map<string, Child>;
    onViewDetails: () => void;
    onAfterUnenroll: () => void | Promise<void>;
};

const VENUE_LABELS: Record<ProgramVenue, string> = {
    in_person: "In Person",
    online: "Online",
    hybrid: "Hybrid",
};

export default function ProgramCard({
    program, isEditing, onToggleEdit, childById, onViewDetails, onAfterUnenroll
}: Props) {

    const enrolled = (program.childIds ?? [])
        .map(id => childById.get(id))
        .filter((c): c is Child => !!c);

    const imageSrc = program.image ? normalizeNextImageSrc(program.image)?.src : null;
    const locationLabel = program.city ? `${program.city}${program.state ? `, ${program.state}` : ""}` : null;
    const dateRangeLabel = `${formatDate(program.startDate)} – ${formatDate(program.endDate)}`;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-wondergreen/10 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col border-t-4 border-t-yellow-400">
            {/* Image */}
            <div className="relative w-full h-40 sm:h-48 bg-gradient-to-br from-wondergreen to-wonderleaf overflow-hidden">
                {imageSrc ? (
                    <>
                        <Image src={imageSrc} alt={program.name} fill className="object-cover" sizes="(max-width:640px) 100vw, 50vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-wondergreen via-wonderleaf to-wondergreen" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image src={AppIcon} alt="WonderHood" width={80} height={80} className="opacity-40 rounded-full" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </>
                )}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col items-end gap-1">
                    <span className="inline-block bg-wondersun text-wondergreen px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-md">
                        {dateRangeLabel}
                    </span>
                    <span className="inline-block bg-white/90 text-wondergreen px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                        {VENUE_LABELS[program.venue]}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-wondergreen mb-1">{program.name}</h3>
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4 pb-4 border-b border-wondergreen/10">
                    {locationLabel && (
                        <div className="flex items-center gap-2">
                            <FaMapPin className="w-4 h-4 text-wonderleaf flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold text-wondergreen">{locationLabel}</span>
                        </div>
                    )}

                    {program.sessionSchedule && (
                        <div className="flex items-center gap-2">
                            <FaClock className="w-4 h-4 text-wonderleaf flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold text-wondergreen">{program.sessionSchedule}</span>
                        </div>
                    )}
                </div>

                {/* Enroll / Edit */}
                {isEditing ? (
                    <div className="mb-4">
                        <UnenrollProgram
                            enrolledChildren={enrolled}
                            programId={program.id}
                            onAfterUnenroll={onAfterUnenroll}
                            onCancel={onToggleEdit}
                        />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs sm:text-sm font-semibold text-wondergreen/70">
                                Your Children Enrolled:
                            </p>

                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleEdit(); }}
                                className="bg-wondergreen/10 hover:bg-wondergreen/20 text-wondergreen p-2 rounded-lg transition-all"
                                title="Edit enrollment"
                            >
                                <FaPen className="w-4 h-4" />
                            </button>
                        </div>

                        {enrolled.length ? (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {enrolled.map(ch => (
                                    <span
                                        key={ch.id}
                                        className="inline-flex items-center rounded-full bg-wonderleaf/15 text-wondergreen px-2.5 py-1 text-xs font-semibold"
                                    >
                                        {(ch.preferredName ?? ch.firstName) + " " + ch.lastName}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-wondergreen/60 mb-4">No children enrolled.</p>
                        )}

                        <button
                            type="button"
                            onClick={onViewDetails}
                            className="w-full bg-wondergreen hover:bg-wonderleaf text-white py-2.5 sm:py-3 rounded-lg font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            View Details
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
