import { useState } from 'react';
import { useModal } from '@/app/context/modal';
import { makeApiRequest } from '../../../utils/api';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type ErrLike = {
  detail?: string;
  message?: string;
  response?: { data?: { detail?: string; message?: string } };
};

type DeleteAppProps = {
    applicationId: string;
    appTitle?: string;
    onDeleted?: () => void;
}

export default function DeleteAppModal({ applicationId, appTitle, onDeleted }: DeleteAppProps) {
    const [busy, setBusy] = useState(false);
    const [err, setError] = useState<string | null>(null);
    const {closeModal, setModalContent} = useModal();

    const handleDelete = async () => {
    setBusy(true);
    setError(null);
    try {
      await makeApiRequest(`${API}/volunteer/${applicationId}`, { method: 'DELETE' });
      onDeleted?.();
      closeModal();
    } catch (e: unknown) {
      const ee = e as ErrLike | undefined;
      const msg =
        ee?.response?.data?.detail ||
        ee?.detail ||
        ee?.message ||
        'Failed to delete application.';
      setError(String(msg));
    } finally {
      setBusy(false);
    }
  };

return(
    <div role="dialog" aria-modal="true" className="bg-white rounded-2xl p-6 max-w-md mx-auto shadow-lg">
        <h2 className="text-lg font-semibold mb-2">Delete application</h2>
        <p className="text-sm text-gray-700 mb-4">
            Delete <span className="font-medium">{appTitle ?? 'this application'}</span>? This cannot be undone.
        </p>

        {err && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800 text-sm">
            {err}
            </div>
        )}

        <div className="flex justify-end gap-2">
            <button
            onClick={closeModal}
            disabled={busy}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
            Cancel
            </button>
            <button
            onClick={handleDelete}
            disabled={busy}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
            {busy ? (
                <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting…
                </>
            ) : (
                'Delete'
            )}
            </button>
    </div>
</div>
)

}




