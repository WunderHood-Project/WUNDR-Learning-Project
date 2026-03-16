'use client';

import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { FaClock } from 'react-icons/fa';
import OpenModalButton from '@/context/openModalButton';
import DeleteEventModal from './DeleteEventModal';
import { NotificationModal } from '../notifications/NotificationModal';
import { determineEnv } from '../../../utils/api';
import { formatDate, formatTimeRange12h } from '../../../utils/formatDate';
import type { Event } from '@/types/event';
import Image from "next/image";
import AppIcon from "@/app/icon.png"; 
import { normalizeNextImageSrc } from "../../../utils/image/normalizeNextImageSrc";

const WONDERHOOD_URL = determineEnv();

type Props = {
  event: Event;
  isAdmin: boolean;
  onDelete: (id: string) => void;
};

export default function EventCard({ event, isAdmin, onDelete }: Props) {
  // Derived numbers/labels for capacity
  const enrolled = event.participants ?? 0;
  const spotsLeft = Math.max(0, (event.limit ?? 0) - enrolled);
  const spotsLabel = spotsLeft === 0 ? 'No spots left' : `${spotsLeft} spots left`;

  const spotsClass =
    spotsLeft === 0
      ? 'bg-gray-100 text-gray-700 border border-gray-200'
      : spotsLeft <= 3
        ? 'bg-red-50 text-red-700 border border-red-200'
        : spotsLeft <= 7
          ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
          : 'bg-wonderleaf/10 text-wonderleaf border border-wonderleaf/30';

  const timeLabel = formatTimeRange12h(event.date, event.startTime, event.endTime);

  return (
    <article className="flex-shrink-0 w-full sm:w-80 max-w-[22rem] bg-white/20 rounded-2xl border-2 border-wonderorange/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      {/* Body */}
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-3">
        {/* Title (fixed height to keep cards aligned) */}
        <h3 className="text-center text-wondergreen font-bold text-lg sm:text-xl leading-snug line-clamp-2 min-h-[2rem]">
            {event.name}
        </h3>

        <div className="w-full overflow-hidden rounded-xl">
          {(() => {
            const p = normalizeNextImageSrc(event.image);

            if (p) {
              return (
                <div className="relative w-full">
                  <Image
                    src={p.src}
                    alt={`${event.name} cover`}
                    width={1200}
                    height={800}
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="w-full h-auto rounded-xl block"
                    priority={false}
                    unoptimized={p.unoptimized}
                  />

                  <div className="absolute top-3 right-3 inline-flex px-3 py-1.5 rounded-full bg-wondersun text-gray-900 text-xs font-bold shadow-md">
                    {formatDate(event.date)}
                  </div>
                </div>
              );
            }

            return (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-wondergreen via-wonderleaf to-wondergreen">
                <div className="absolute inset-0 grid place-content-center">
                  <Image
                    src={AppIcon}
                    alt="WonderHood"
                    width={96}
                    height={96}
                    className="opacity-40 rounded-full"
                    priority={false}
                  />
                </div>

                <div className="absolute bottom-3 right-3 inline-flex px-3 py-1.5 rounded-full bg-wondersun text-gray-900 text-xs font-bold shadow-md">
                  {formatDate(event.date)}
                </div>
              </div>
            );
          })()}
        </div>


        {/* Location + Time (centered, single line each) */}
        <div className="flex justify-center">
          <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden mt-2 mb-1">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200"
              title={`${event.city}, ${event.state}`}
            >
              <FaLocationDot className="w-3.5 h-3.5 text-wonderorange" />
              <span className="font-medium">{event.city}, {event.state}</span>
            </span>

            {timeLabel && <span className="h-4 w-px bg-gray-200" />}

            {timeLabel && (
              <span
                className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200"
                title={timeLabel}
              >
                <FaClock className="w-3.5 h-3.5 text-wonderleaf" />
                <span className="font-medium">{timeLabel}</span>
              </span>
            )}
          </div>
        </div>

        {/* Stats (two-row layout with taller left accent) */}
        <div className="relative pl-4 pt-3 pb-3 bg-wonderbg/60 rounded-lg px-4">
          {/* Left accent bar slightly taller than content */}
          <div className="absolute left-0 top-2 bottom-2 w-1.5 rounded-full bg-wonderorange" />

          {/* Row 1: Max participants on one line */}
          <div className="flex items-center gap-2">
            <FaUser className="w-4 h-4 text-wonderorange shrink-0" />
            <span className="text-sm font-semibold text-wondergreen">
              Max Participants:&nbsp;{event.limit}
            </span>
          </div>

          {/* Row 2: enrolled left + spots badge right (fixed width) */}
          <div className="mt-2 flex items-center">
            <p className="text-xs text-gray-600">
              {enrolled} of {event.limit} enrolled
            </p>

            <span
              className={`ml-auto text-xs px-3 py-1.5 rounded-full font-semibold text-center w-[120px] ${spotsClass}`}
              aria-label={spotsLabel}
              title={spotsLabel}
            >
              {spotsLabel}
            </span>
          </div>
        </div>

        {/* Push CTA to bottom */}
        <div className="mt-auto" />

        {/* CTA */}
        <Link
          href={`/events/${event.id}`}
          className="w-full inline-flex items-center justify-center rounded-lg px-4 py-3 bg-wondergreen text-white font-bold text-sm uppercase tracking-wide hover:bg-wonderleaf transition-all duration-200 shadow-md hover:shadow-lg"
        >
          View Details
        </Link>

        {/* Admin actions */}
        {isAdmin && (
          <div className="space-y-2 pt-3 border-t border-gray-200">
            <Link
              href={`/events/${event.id}/updateEvent`}
              className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 bg-wonderorange text-white font-semibold text-sm hover:bg-wonderorange/90 transition-colors"
            >
              Edit
            </Link>

            <OpenModalButton
              className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 bg-wonderleaf text-white font-semibold text-sm hover:bg-wonderleaf/90 transition-colors"
              buttonText="Notify Users"
              modalComponent={
                <NotificationModal
                  url={`${WONDERHOOD_URL}/event/${event.id}/notification/enrolled_users_child`}
                />
              }
            />

            <OpenModalButton
              className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
              buttonText="Delete"
              modalComponent={<DeleteEventModal event={event} onDelete={onDelete} />}
            />
          </div>
        )}
      </div>
    </article>
  );
}