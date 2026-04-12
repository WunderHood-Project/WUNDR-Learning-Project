import { useModal } from '@/context/modal';
import { useState } from 'react';
import React from 'react';
import { makeApiRequest, determineEnv } from '../../../utils/api';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import type { EnrichmentProgram } from '@/types/program';

const WONDERHOOD_URL = determineEnv();

type Props = {
  program: EnrichmentProgram;
  onDelete: (id: string) => void;
};

const DeleteProgramModal: React.FC<Props> = ({ program, onDelete }) => {
  const { closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!program.id) return;
    setIsDeleting(true);
    setError(null);

    try {
      await makeApiRequest(`${WONDERHOOD_URL}/program/${program.id}`, { method: 'DELETE' });
      onDelete(program.id);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting program');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
        <h2 className="text-xl font-bold text-gray-800">Delete Program</h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          Are you sure you want to delete <span className="font-semibold">{program.name}</span>? This action cannot be undone.
        </p>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={closeModal}
          disabled={isDeleting}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <FaTrash className="w-4 h-4" />
              Delete
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DeleteProgramModal;
