'use client';

import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaUserMinus } from 'react-icons/fa';
import { useModal } from '@/context/modal';
import type { Child } from '@/types/child';
import type { EnrichmentProgram } from '@/types/program';
import { makeApiRequest } from '../../../utils/api';

type AttendeesResponse = { participants: number; children: Child[] };

type Props = {
  program: EnrichmentProgram;
  onParticipantCountChange: (programId: string, participants: number) => void;
};

export default function ManageProgramAttendeesModal({ program, onParticipantCountChange }: Props) {
  const { closeModal } = useModal();
  const [attendees, setAttendees] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [removingChildId, setRemovingChildId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const loadAttendees = async () => {
    if (!program.id) return;
    try {
      setLoading(true);
      setLoadError(null);
      const response = await makeApiRequest<AttendeesResponse>(`/program/${program.id}/attendees`);
      setAttendees(response.children ?? []);
      onParticipantCountChange(program.id, response.participants);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load attendees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAttendees();
    // The modal represents one program for its lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program.id]);

  const removeAttendee = async () => {
    if (!program.id || !selectedChild) return;
    try {
      setRemovingChildId(selectedChild.id);
      setRemoveError(null);
      await makeApiRequest(`/program/${program.id}/attendees/${selectedChild.id}`, { method: 'DELETE' });
      const removedChildId = selectedChild.id;
      setSelectedChild(null);
      setAttendees((current) => current.filter((child) => child.id !== removedChildId));
      await loadAttendees();
    } catch (error) {
      setRemoveError(error instanceof Error ? error.message : `Failed to remove ${selectedChild.firstName} ${selectedChild.lastName}`);
    } finally {
      setRemovingChildId(null);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="manage-program-attendees-title" className="mx-auto w-[min(92vw,36rem)] rounded-2xl bg-white p-5 shadow-lg sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id="manage-program-attendees-title" className="text-xl font-bold text-wondergreen">Manage attendees</h2>
          <p className="mt-1 text-sm text-gray-600">{program.name}</p>
        </div>
        <button type="button" onClick={closeModal} disabled={removingChildId !== null} className="rounded-md px-2 py-1 text-2xl leading-none text-gray-500 hover:bg-gray-100 disabled:opacity-50" aria-label="Close attendee manager">×</button>
      </div>

      {loadError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          <p>{loadError}</p>
          <button type="button" onClick={() => void loadAttendees()} className="mt-2 font-semibold underline">Try again</button>
        </div>
      )}

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-600" aria-live="polite">Loading attendees…</p>
      ) : !loadError && attendees.length === 0 ? (
        <p className="rounded-xl bg-wonderbg p-5 text-center text-sm text-gray-700">No children are enrolled in this program.</p>
      ) : (
        <ul className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
          {attendees.map((child) => {
            const isRemoving = removingChildId === child.id;
            return (
              <li key={child.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
                  <p className="min-w-0 font-semibold text-gray-900">
                    {child.firstName} {child.lastName}
                    {child.preferredName ? <span className="font-normal text-gray-500"> ({child.preferredName})</span> : null}
                  </p>
                  <button type="button" onClick={() => { setSelectedChild(child); setRemoveError(null); }} disabled={removingChildId !== null} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50">
                    <FaUserMinus aria-hidden="true" />
                    {isRemoving ? 'Removing…' : 'Remove'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {selectedChild && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
            <div>
              <p className="text-sm text-gray-800">Remove <strong>{selectedChild.firstName} {selectedChild.lastName}</strong> from <strong>{program.name}</strong>?</p>
              <p className="mt-1 text-xs text-gray-600">Their parent or guardian will be notified.</p>
            </div>
          </div>
          {removeError && <p className="mt-3 text-sm text-red-700" role="alert">{removeError}</p>}
          <div className="mt-4 flex flex-col-reverse gap-2 xs:flex-row xs:justify-end">
            <button type="button" onClick={() => { setSelectedChild(null); setRemoveError(null); }} disabled={removingChildId !== null} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">Cancel</button>
            <button type="button" onClick={() => void removeAttendee()} disabled={removingChildId !== null} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">{removingChildId ? 'Removing…' : 'Confirm removal'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
