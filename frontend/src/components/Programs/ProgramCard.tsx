'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import OpenModalButton from '@/context/openModalButton';
import DeleteProgramModal from './DeleteProgramModal';
import AppIcon from '@/app/icon.png';
import { normalizeNextImageSrc } from '../../../utils/image/normalizeNextImageSrc';
import { formatDate } from '../../../utils/formatDate';
import type { EnrichmentProgram, ProgramLabel, ProgramVenue } from '@/types/program';

type Props = {
  program: EnrichmentProgram;
  isAdmin: boolean;
  onDelete: (id: string) => void;
};

export default function ProgramCard({ program, isAdmin, onDelete }: Props) {
  const enrolled = program.participants ?? 0;
  const unlimited = program.limit == null;
  const spotsLeft = unlimited ? null : Math.max(0, program.limit! - enrolled);
  const spotsLabel = unlimited
    ? 'Unlimited'
    : spotsLeft === 0
      ? 'No spots left'
      : `${spotsLeft} spots left`;

  const spotsClass = unlimited
    ? 'bg-wonderleaf/10 text-wonderleaf border border-wonderleaf/30'
    : spotsLeft === 0
      ? 'bg-gray-100 text-gray-700 border border-gray-200'
      : spotsLeft! <= 3
        ? 'bg-red-50 text-red-700 border border-red-200'
        : spotsLeft! <= 7
          ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
          : 'bg-wonderleaf/10 text-wonderleaf border border-wonderleaf/30';

  return (
    <article className="flex-shrink-0 w-full sm:w-80 max-w-[22rem] bg-white/20 rounded-2xl border-2 border-wonderorange/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full relative">
      <div className="flex-1 p-4 sm:p-6 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-center text-wondergreen font-bold text-lg sm:text-xl leading-snug line-clamp-2 min-h-[2rem]">
          {program.name}
        </h3>

        {/* Image */}
        <div className="w-full overflow-hidden rounded-xl">
          {(() => {
            const p = normalizeNextImageSrc(program.image ?? null);

            if (p) {
              return (
                <div className="relative w-full">
                  <Image
                    src={p.src}
                    alt={`${program.name} cover`}
                    width={1200}
                    height={800}
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="w-full h-auto rounded-xl block"
                    priority={false}
                    unoptimized={p.unoptimized}
                  />
                  <div className="absolute top-3 left-3">
                    <ProgramLabelBadge label={program.label} />
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
                <div className="absolute top-3 left-3">
                  <ProgramLabelBadge label={program.label} />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Date range + venue */}
        <div className="flex flex-wrap items-center gap-2 justify-center mt-2 mb-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200">
            <FaCalendarAlt className="w-3.5 h-3.5 text-wonderorange" />
            <span className="font-medium">
              {formatDate(program.startDate)} – {formatDate(program.endDate)}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200 font-medium">
            {displayVenue(program.venue)}
          </span>
        </div>

        {/* Age + capacity */}
        <div className="relative pl-4 pt-3 pb-3 bg-wonderbg/60 rounded-lg px-4">
          <div className="absolute left-0 top-2 bottom-2 w-1.5 rounded-full bg-wonderorange" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-wondergreen">
              Ages {program.ageMin}–{program.ageMax}
            </span>
          </div>

          <div className="mt-2 flex items-center">
            <div className="flex items-center gap-1.5">
              <FaUser className="w-3 h-3 text-wonderorange" />
              <p className="text-xs text-gray-600">
                {unlimited
                  ? `${enrolled} enrolled`
                  : `${enrolled} of ${program.limit} enrolled`}
              </p>
            </div>

            <span
              className={`ml-auto text-xs px-3 py-1.5 rounded-full font-semibold text-center w-[120px] ${spotsClass}`}
              aria-label={spotsLabel}
            >
              {spotsLabel}
            </span>
          </div>
        </div>

        <div className="mt-auto" />

        {/* CTA */}
        <Link
          href={`/programs/${program.id}`}
          className="w-full inline-flex items-center justify-center rounded-lg px-4 py-3 bg-wondergreen text-white font-bold text-sm uppercase tracking-wide hover:bg-wonderleaf transition-all duration-200 shadow-md hover:shadow-lg"
        >
          View Details
        </Link>

        {/* Admin actions */}
        {isAdmin && (
          <div className="space-y-2 pt-3 border-t border-gray-200">
            <Link
              href={`/programs/${program.id}/update`}
              className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 bg-wonderorange text-white font-semibold text-sm hover:bg-wonderorange/90 transition-colors"
            >
              Edit
            </Link>

            <OpenModalButton
              className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
              buttonText="Delete"
              modalComponent={<DeleteProgramModal program={program} onDelete={onDelete} />}
            />
          </div>
        )}
      </div>
    </article>
  );
}

function ProgramLabelBadge({ label }: { label: ProgramLabel }) {
  const isPartner = label === 'partner';
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${
        isPartner ? 'bg-wonderorange text-white' : 'bg-wondergreen text-white'
      }`}
    >
      {isPartner ? 'Partner' : 'WonderHood'}
    </span>
  );
}

export function displayVenue(venue: ProgramVenue): string {
  switch (venue) {
    case 'in_person': return 'In-Person';
    case 'online': return 'Online';
    case 'hybrid': return 'Hybrid';
  }
}
