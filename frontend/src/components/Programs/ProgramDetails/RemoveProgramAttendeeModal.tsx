import { useState } from 'react';
import { FaExclamationTriangle, FaUserMinus } from 'react-icons/fa';
import { useModal } from '@/context/modal';
import type { Child } from '@/types/child';
import { makeApiRequest } from '../../../../utils/api';

type Props = {
  programId: string;
  programName: string;
  child: Child;
  onRemoved: () => void | Promise<void>;
};

export default function RemoveProgramAttendeeModal({
  programId,
  programName,
  child,
  onRemoved,
}: Props) {
  const { closeModal } = useModal();
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const childName = `${child.firstName} ${child.lastName}`;

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      setError(null);
      await makeApiRequest(`/program/${programId}/attendees/${child.id}`, {
        method: 'DELETE',
      });
      await onRemoved();
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to remove ${childName}`);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="remove-program-attendee-title"
      className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg"
    >
      <div className="mb-4 flex items-center">
        <FaExclamationTriangle className="mr-3 text-2xl text-red-500" aria-hidden="true" />
        <h2 id="remove-program-attendee-title" className="text-xl font-bold text-gray-800">
          Remove attendee
        </h2>
      </div>

      <p className="mb-2 text-gray-700">
        Remove <strong>{childName}</strong> from <strong>{programName}</strong>?
      </p>
      <p className="mb-6 text-sm text-gray-600">
        This will cancel the child&apos;s enrollment and notify their parent or guardian.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={closeModal} disabled={isRemoving} className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
          Cancel
        </button>
        <button type="button" onClick={handleRemove} disabled={isRemoving} className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
          {isRemoving ? (
            <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Removing…</>
          ) : (
            <><FaUserMinus className="h-4 w-4" aria-hidden="true" />Remove</>
          )}
        </button>
      </div>
    </div>
  );
}
