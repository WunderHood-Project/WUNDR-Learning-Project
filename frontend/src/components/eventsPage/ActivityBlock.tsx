import { Event } from "@/types/event";
import EventCard from "./EventCard";

interface Props {
    activityName: string;
    events: Event[]
    isAdmin: boolean;
    onDelete: (id: string) => void;
}

const getActivityIcon = (activityName: string) => {
    switch (activityName.toLowerCase()) {
        case "outdoor":
            return "🏔️";
        case "indoor":
            return "🏛️";
        case "stem":
            return "🔬";
        default:
            return "📅";
    }
}

const getActivityIconBg = (activityName: string) => {
    switch (activityName.toLowerCase()) {
        case 'outdoor':
            return 'bg-green-700';
        case 'indoor':
            return 'bg-amber-700';
        case 'stem':
            return 'bg-blue-700';
        default:
            return 'bg-gray-700';
    }
}

const getActivityColor = (activityName: string) => {
    switch (activityName.toLowerCase()) {
        case 'outdoor':
            return 'border-green-600';
        case 'indoor':
            return 'border-amber-600';
        case 'stem':
            return 'border-blue-600';
        default:
            return 'border-gray-600';
    }
}

export default function ActivityBlock({ activityName, events, isAdmin, onDelete }: Props) {
    return (
        <section className="mb-12">

            {/* Activity Header */}
            <div className={`flex items-center gap-4 mb-6 pb-2 border-b-4 ${getActivityColor(activityName)}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl text-white ${getActivityIconBg(activityName)}`}>
                    {getActivityIcon(activityName)}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">{activityName}</h2>
            </div>

            {/* Events Scroll Container */}
            <div className="relative">
                <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-gray-300">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <EventCard key={event.id} event={event} isAdmin={isAdmin} events={events} onDelete={onDelete}/>
                        ))
                    ) : (
                        <div className="flex-shrink-0 w-80 p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <p className="text-lg">No events scheduled yet</p>
                            <p className="text-sm mt-2">Check back soon for upcoming {activityName.toLowerCase()} events!</p>
                        </div>
                    )}
                </div>
            </div>

        </section>
    )
}
