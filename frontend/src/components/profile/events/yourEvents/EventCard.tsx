import Image from "next/image";
import AppIcon from "@/app/icon.png";
import { normalizeNextImageSrc } from "../../../../../utils/image/normalizeNextImageSrc";
import { formatDate, formatTimeRange12h } from "../../../../../utils/formatDate";
import { FaMapPin, FaClock, FaPen } from "react-icons/fa";
import UnenrollEvent from "../unenrollEvent";
import type { Child } from "@/types/child";

type EventLite = {
    id?: string; name: string; description?: string;
    city?: string; date: string; startTime?: string; endTime?: string;
    childIds?: string[]; image?: string;
};

type Props = {
    event: EventLite;
    isEditing: boolean;
    onToggleEdit: () => void;
    childById: Map<string, Child>;
    onViewDetails: () => void;
    onAfterUnenroll: () => void | Promise<void>;
};

export default function EventCard({
    event, isEditing, onToggleEdit, childById, onViewDetails, onAfterUnenroll
}: Props) {

    const enrolled = (event.childIds ?? [])
    .map(id => childById.get(id))
    .filter((c): c is Child => !!c);

    const timeLabel = formatTimeRange12h(event.date, event.startTime, event.endTime);
    const imageSrc = event.image ? normalizeNextImageSrc(event.image)?.src : null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-wondergreen/10 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col border-t-4 border-t-yellow-400">
            {/* Image */}
            <div className="relative w-full h-40 sm:h-48 bg-gradient-to-br from-wondergreen to-wonderleaf overflow-hidden">
                {imageSrc ? (
                    <>
                        <Image src={imageSrc} alt={event.name} fill className="object-cover" sizes="(max-width:640px) 100vw, 50vw" />
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
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <span className="inline-block bg-wondersun text-wondergreen px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-md">
                            {formatDate(event.date)}
                        </span>
                    </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-wondergreen mb-1">{event.name}</h3>
                    </div>

                    {!isEditing && (
                        <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleEdit(); }}
                        className="bg-wondergreen/10 hover:bg-wondergreen/20 text-wondergreen p-2 rounded-lg transition-all flex-shrink-0"
                        title="Edit"
                        >
                        <FaPen className="w-4 h-4" />
                        </button>
                    )}
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4 pb-4 border-b border-wondergreen/10">
            {timeLabel && (
                <div className="flex items-center gap-2">
                    <FaClock className="w-4 h-4 text-wonderleaf flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-wondergreen">{timeLabel}</span>
                </div>
            )}
            
            {event.city && (
                <div className="flex items-center gap-2">
                    <FaMapPin className="w-4 h-4 text-wonderleaf flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-wondergreen">{event.city}</span>
                </div>
            )}
            </div>

            {/* Enroll / Edit */}
            {isEditing ? (
            <div className="mb-4">
                <UnenrollEvent
                enrolledChildren={enrolled}
                eventId={event.id}
                onAfterUnenroll={onAfterUnenroll}
                onCancel={onToggleEdit}
                />
            </div>
                ) : (
                    <>
                    <p className="text-xs sm:text-sm font-semibold text-wondergreen/70 mb-2">Your Children Enrolled:</p>
                    {enrolled.length ? (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {enrolled.map(ch => (
                            <span key={ch.id} className="inline-flex items-center rounded-full bg-wonderleaf/15 text-wondergreen px-2.5 py-1 text-xs font-semibold">
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
