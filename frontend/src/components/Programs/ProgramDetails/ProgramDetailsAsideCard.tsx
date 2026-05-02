'use client';

import { useMemo, useState, type ReactNode } from 'react';
import type { EnrichmentProgram } from '@/types/program';
import type { Child } from '@/types/child';
import { formatDate } from '../../../../utils/formatDate';
import { displayVenue } from '../ProgramCard';

type WaitListParent = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
};

type WaitListChild = {
  id: string;
  firstName: string;
  lastName: string;
  parents?: WaitListParent[];
};

type ProgramWaitListEntry = {
  id: string;
  position: number;
  status: string;
  child?: WaitListChild;
};

type Props = {
  program: EnrichmentProgram;
  hasCapacity: boolean;
  showForm: boolean;
  onToggleForm: () => void;
  successEnroll: boolean;
  userHasChildEnrolled: boolean;
  userHasChildInWaitList: boolean;
  isAdmin: boolean;
  attendeesOpen: boolean;
  attendees: Child[] | null;
  attendeesLoading: boolean;
  attendeesError: string | null;
  onToggleAttendees: () => void;
  enrollmentContent?: ReactNode;
  waitListOpen: boolean;
  waitList: ProgramWaitListEntry[] | null;
  waitListLoading: boolean;
  waitListError: string | null;
  onToggleWaitList: () => void;
};

export default function ProgramDetailsAsideCard({
  program,
  hasCapacity,
  showForm,
  onToggleForm,
  successEnroll,
  userHasChildEnrolled,
  isAdmin,
  attendeesOpen,
  attendees,
  attendeesLoading,
  attendeesError,
  onToggleAttendees,
  enrollmentContent,
  waitListOpen,
  waitList,
  waitListLoading,
  waitListError,
  onToggleWaitList,
  userHasChildInWaitList,
}: Props) {
  const enrolled = program.participants ?? 0;
  const limit = program.limit;
  const unlimited = limit == null;
  const spotsLeft = unlimited ? null : Math.max(0, limit - enrolled);

  const progressPct = useMemo(() => {
    if (unlimited || !limit) return 0;
    return Math.min(100, Math.max(0, (enrolled / limit) * 100));
  }, [enrolled, limit, unlimited]);

  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  const toggleExpanded = (id: string) =>
    setExpandedChildId((prev) => (prev === id ? null : id));

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-4 sm:top-6 bg-white/50 rounded-2xl backdrop-blur-sm border border-white/60 shadow-md p-4 sm:p-6 space-y-5">
        {/* Label badge */}
        <div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
              program.label === 'partner'
                ? 'bg-wonderorange text-white'
                : 'bg-wondergreen text-white'
            }`}
          >
            {program.label === 'partner' ? 'Partner Program' : 'WonderHood Program'}
          </span>
        </div>

        {/* Spots */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-wondergreen uppercase tracking-widest">
            Participants
          </h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-wonderleaf/15 text-wondergreen border border-wonderleaf/40">
            {unlimited ? 'Unlimited spots' : `${spotsLeft} spots left`}
          </span>
        </div>

        {/* Progress bar */}
        <div>
          <p className="text-xs font-bold text-wondergreen mb-2 uppercase tracking-wide">
            Enrollment Progress
          </p>
          <div className="w-full h-2.5 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-wonderleaf to-wondergreen transition-all duration-300"
              style={{ width: `${progressPct.toFixed(2)}%` }}
              role="progressbar"
              aria-valuenow={Number(progressPct.toFixed(0))}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-xs text-gray-700 font-medium mt-1.5">
            {unlimited ? `${enrolled} enrolled (no limit)` : `${enrolled} of ${limit} enrolled`}
          </p>
        </div>

        {/* Date range */}
        <div className="pb-4 border-b border-white/50">
          <p className="text-sm font-bold text-wondergreen uppercase tracking-wide mb-2">
            Program Dates
          </p>
          <p className="text-sm text-gray-800 font-medium">
            {formatDate(program.startDate)} – {formatDate(program.endDate)}
          </p>
          {program.sessionSchedule && (
            <p className="text-xs text-gray-600 mt-1">{program.sessionSchedule}</p>
          )}
        </div>

        {/* Venue / Location */}
        <div className="pb-4 border-b border-white/50">
          <p className="text-sm font-bold text-wondergreen uppercase tracking-wide mb-2">
            Location
          </p>
          <p className="text-sm font-medium text-gray-800">{displayVenue(program.venue)}</p>
          {program.venue !== 'online' && (program.city || program.address) && (
            <div className="text-xs text-gray-600 mt-1 space-y-0.5">
              {program.address && <p>{program.address}</p>}
              {(program.city || program.state) && (
                <p>
                  {program.city}
                  {program.city && program.state ? ', ' : ''}
                  {program.state}
                  {program.zipCode ? ` ${program.zipCode}` : ''}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Age range */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-wondergreen uppercase tracking-wide">Ages</p>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-wonderleaf/10 text-wondergreen border border-wonderleaf/30">
            {program.ageMin}–{program.ageMax} years
          </span>
        </div>

        {/* Partner disclaimer */}
        {program.label === 'partner' && (
          <div className="rounded-xl border border-wonderorange/30 bg-wonderorange/5 px-4 py-3">
            <p className="text-xs font-bold text-wonderorange uppercase tracking-wide mb-1">
              Third-Party Program
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              This program is organized by an independent partner. WonderHood is not liable or
              responsible for the content, safety, or conduct of partner-hosted programs. Please
              contact the organizer directly with any questions or concerns.
            </p>
          </div>
        )}

        {/* CTA */}
        {hasCapacity ? (
          <>
            <button
              disabled
              className="w-full rounded-full bg-wonderleaf text-white px-4 py-2 font-bold uppercase tracking-wide text-xs cursor-default"
            >
              ✓ Spots Available
            </button>

            <button
              onClick={onToggleForm}
              className="w-full rounded-full bg-wondergreen px-4 py-2.5 text-white font-bold uppercase tracking-wide text-xs hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              {showForm ? 'Choose Child' : 'Enroll in Program'}
            </button>

            {showForm && enrollmentContent && (
              <div className="mt-4">{enrollmentContent}</div>
            )}
          </>
        ) : userHasChildEnrolled ? (
          <>
            <button
              disabled
              className="w-full rounded-full bg-wonderorange text-white px-4 py-2 font-bold uppercase tracking-wide text-xs cursor-default"
            >
              Full Capacity
            </button>

            <button
              onClick={onToggleForm}
              className="w-full rounded-full bg-wondergreen px-4 py-2.5 text-white font-bold uppercase tracking-wide text-xs hover:shadow-lg transition-all"
            >
              Manage Enrollment
            </button>

            <div className="text-center text-gray-700 bg-white/40 rounded-full px-4 py-2 font-semibold text-xs">
              Your child is enrolled. You can update enrollment or unenroll.
            </div>

            <button
              onClick={onToggleForm}
              className="w-full rounded-full bg-wondergreen px-4 py-2.5 text-white font-bold uppercase tracking-wide text-xs hover:shadow-lg transition-all"
            >
              {userHasChildInWaitList ? 'Manage Waitlist' : 'Join Waitlist for Another Child'}
            </button>

            <div className="text-center text-gray-700 bg-white/40 rounded-full px-4 py-2 font-semibold text-xs">
              {userHasChildInWaitList
                ? 'Another child is on the waitlist. You can remove them or add another child.'
                : 'Program is full. You can add another child to the waitlist.'}
            </div>

            {showForm && enrollmentContent && (
              <div className="mt-4">{enrollmentContent}</div>
            )}
          </>
        ) : userHasChildInWaitList ? (
          <>
            <button
              disabled
              className="w-full rounded-full bg-wonderorange text-white px-4 py-2 font-bold uppercase tracking-wide text-xs cursor-default"
            >
              Full Capacity
            </button>

            <button
              onClick={onToggleForm}
              className="w-full rounded-full bg-wondergreen px-4 py-2.5 text-white font-bold uppercase tracking-wide text-xs hover:shadow-lg transition-all"
            >
              Manage Waitlist
            </button>

            <div className="text-center text-gray-700 bg-white/40 rounded-full px-4 py-2 font-semibold text-xs">
              Your child is on the waitlist. You can remove them or add another child.
            </div>

            {showForm && enrollmentContent && (
              <div className="mt-4">{enrollmentContent}</div>
            )}
          </>
        ) : (
          <>
            <button
              disabled
              className="w-full rounded-full bg-wonderorange text-white px-4 py-2 font-bold uppercase tracking-wide text-xs cursor-default"
            >
              Full Capacity
            </button>

            <button
              onClick={onToggleForm}
              className="w-full rounded-full bg-wondergreen px-4 py-2.5 text-white font-bold uppercase tracking-wide text-xs hover:shadow-lg transition-all"
            >
              {showForm ? 'Choose Child' : 'Join Waitlist'}
            </button>

            <div className="text-center text-gray-700 bg-white/40 rounded-full px-4 py-2 font-semibold text-xs">
              This program is full. Join the waitlist to be contacted if a spot opens.
            </div>

            {showForm && enrollmentContent && (
              <div className="mt-4">{enrollmentContent}</div>
            )}
          </>
        )}
        
        {successEnroll && (
          <div
            className="text-center text-green-800 bg-green-50/80 border border-green-200 rounded-lg px-4 py-3 font-semibold text-xs"
            role="status"
            aria-live="polite"
          >
            Enrollment successful!
          </div>
        )}

        {/* Admin attendees */}
        {isAdmin && (
          <div className="pt-5 border-t border-white/50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-wondergreen uppercase tracking-wide">
                Attendees (Admin)
              </p>
              <button
                type="button"
                onClick={onToggleAttendees}
                className="text-xs font-semibold text-wondergreen underline hover:opacity-80"
              >
                {attendeesOpen ? 'Hide' : 'View'}
              </button>
            </div>

            {attendeesOpen && (
              <div className="mt-3">
                {attendeesLoading ? (
                  <p className="text-xs text-gray-600">Loading attendees…</p>
                ) : attendeesError ? (
                  <p className="text-xs text-red-600">{attendeesError}</p>
                ) : !attendees?.length ? (
                  <p className="text-xs text-gray-600">No enrolled children yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {attendees.map((c) => {
                      const isOpen = expandedChildId === c.id;
                      return (
                        <li key={c.id} className="rounded-xl border border-white/60 bg-white/60 px-3 py-2">
                          <button
                            type="button"
                            onClick={() => toggleExpanded(c.id)}
                            className="w-full text-left"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-gray-900">
                                {c.firstName} {c.lastName}
                              </span>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                                    c.photoConsent
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-rose-50 text-rose-700 border-rose-200'
                                  }`}
                                >
                                  {c.photoConsent ? 'PHOTO OK' : 'NO PHOTO'}
                                </span>
                                <span className="text-xs text-wondergreen underline">
                                  {isOpen ? 'Hide' : 'Details'}
                                </span>
                              </div>
                            </div>
                          </button>

                          {isOpen && (
                            <div className="mt-3 rounded-lg bg-white/70 border border-white/70 p-3 space-y-3">
                              <div>
                                <p className="text-xs font-bold text-wondergreen uppercase tracking-wide mb-1">
                                  Parents
                                </p>
                                {c.parents?.length ? (
                                  c.parents.map((p) => (
                                    <div key={p.id} className="text-xs text-gray-800">
                                      <p className="font-semibold">{p.firstName} {p.lastName}</p>
                                      <p className="text-gray-600">{p.email} • {p.phoneNumber}</p>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-xs text-gray-600">No parent data.</p>
                                )}
                              </div>

                              <div>
                                <p className="text-xs font-bold text-wondergreen uppercase tracking-wide mb-1">
                                  Allergies / Medical
                                </p>
                                <p className="text-xs text-gray-800">{c.allergiesMedical || '—'}</p>
                              </div>

                              <div>
                                <p className="text-xs font-bold text-wondergreen uppercase tracking-wide mb-1">
                                  Notes
                                </p>
                                <p className="text-xs text-gray-800">{c.notes || '—'}</p>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Admin waiting list */}
        {isAdmin && (
          <div className="pt-5 border-t border-white/50">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-wondergreen uppercase tracking-wide">
                Waitlist (Admin)
              </p>

              <button
                type="button"
                onClick={onToggleWaitList}
                className="text-xs font-semibold text-wondergreen underline hover:opacity-80"
              >
                {waitListOpen ? 'Hide' : 'View'}
              </button>
            </div>

            {waitListOpen && (
              <div className="mt-3">
                {waitListLoading ? (
                  <p className="text-xs text-gray-600">Loading waitlist…</p>
                ) : waitListError ? (
                  <p className="text-xs text-red-600">{waitListError}</p>
                ) : !waitList?.length ? (
                  <p className="text-xs text-gray-600">No children on the waitlist yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {waitList.map((entry) => (
                      <li
                        key={entry.id}
                        className="rounded-xl border border-white/60 bg-white/60 px-3 py-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              #{entry.position} {entry.child?.firstName} {entry.child?.lastName}
                            </p>

                            {entry.child?.parents?.length ? (
                              <div className="mt-1 text-xs text-gray-700 space-y-1">
                                {entry.child.parents.map((parent) => (
                                  <div key={parent.id}>
                                    <p className="font-semibold">
                                      {parent.firstName} {parent.lastName}
                                    </p>
                                    <p>
                                      {parent.email} • {parent.phoneNumber}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-600 mt-1">
                                No parent info available.
                              </p>
                            )}
                          </div>

                          <span className="text-[10px] font-bold px-2 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200 uppercase">
                            {entry.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
