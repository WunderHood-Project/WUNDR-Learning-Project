import OpenModalButton from "@/app/context/openModalButton";
import Link from "next/link";
import { formatDate } from "../../../utils/formatDate";
import { Event } from "@/types/event";
import DeleteEventModal from "./DeleteEventModal";
import { NotificationModal } from "../notifications/NotificationModal";
import { determineEnv } from "../../../utils/api";

const WONDERHOOD_URL = determineEnv()


interface Props {
  event: Event;
  events: Event[];
  isAdmin: boolean;
  onDelete: (id: string) => void
}

export default function EventCard({ event, isAdmin, onDelete }: Props) {
  return (
    <div className="flex-shrink-0 w-80 bg-white border rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      {/* Date Badge */}
      <div className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
        {formatDate(event.date)}
      </div>

      {/* Event Content */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {event.name} in {event.city}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[3.5rem]">
        {event.description}
      </p>

      {/* Event Metadata */}
      <div className="flex flex-col justify-center mt-auto">
        <span className="text-xs text-gray-500 mb-2">
          {event.participants} participant(s) enrolled
        </span>

        <div className="flex justify-between gap-x-2 mt-2">
          <Link href={`/events/${event.id}`} className="flex-1 bg-wondergreen text-white px-4 py-2 rounded text-sm text-center font-medium hover:bg-wonderleaf transition-colors">
              <strong>VIEW DETAILS</strong>
          </Link>
        </div>

        {isAdmin && (
          <div className="flex flex-col justify-between mt-2 gap-x-2">
            <Link href={`/events/${event.id}/updateEvent`} className="mt-2 bg-wonderorange text-white px-4 py-2 rounded text-sm text-center font-medium hover:bg-gradient-to-l from-wonderorange to-wonderleaf transition-colors">
                <strong>EDIT</strong>
            </Link>
            <OpenModalButton
              className="mt-2 bg-wonderleaf text-white px-4 py-2 rounded text-sm text-center font-bold hover:bg-gradient-to-r from-wonderorange to-wonderleaf transition-colors"
              buttonText="Notify Users"
              modalComponent={<NotificationModal url={`${WONDERHOOD_URL}/event/${event.id}/notification/enrolled_users_child`} />}
            />
            <OpenModalButton
              className="mt-2 bg-red-700 text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-900 transition-colors"
              buttonText="DELETE"
              modalComponent={<DeleteEventModal event={event} onDelete={onDelete}/>}
            />
          </div>
        )}
      </div>
    </div>
  );
}
