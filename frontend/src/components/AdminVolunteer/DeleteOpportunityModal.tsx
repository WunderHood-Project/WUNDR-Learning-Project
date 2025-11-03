'use client';

import React, { useState } from 'react';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import { useModal } from '@/context/modal';
import { makeApiRequest } from '../../../utils/api';
import { determineEnv } from '../../../utils/api';

const WONDERHOOD_URL = determineEnv()

type ErrLike = {
  detail?: string;
  message?: string;
  response?: { data?: { detail?: string; message?: string } };
};


type DeleteOpportunityModalProps = {
  id: string;
  title?: string;
  onDeleted?: () => void;
};

const DeleteOpportunityModal: React.FC<DeleteOpportunityModalProps> = ({ id, title, onDeleted, }) => {
  const { closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErr(null);
    try {
      await makeApiRequest(`${WONDERHOOD_URL}/opportunities/${id}`, { method: 'DELETE' });
      onDeleted?.();
      closeModal();
    } catch (e: unknown) {
      const ee = e as ErrLike | undefined;
      const detail =
        ee?.detail ||
        ee?.message ||
        ee?.response?.data?.detail ||
        ee?.response?.data?.message ||
        'Failed to delete opportunity.';
      setErr(detail);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="bg-white rounded-2xl p-6 max-w-md mx-auto shadow-lg"
    >
      <div className="flex items-center mb-4">
        <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
        <h2 className="text-xl font-bold text-gray-900">Delete opportunity</h2>
      </div>

      <p className="text-gray-700 mb-4">
        Are you sure you want to delete <span className="font-semibold">{title ?? 'this opportunity'}</span>?
        This action cannot be undone.
      </p>

      {err && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800 text-sm">
          {err}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={closeModal}
          disabled={isDeleting}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isDeleting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Deleting…
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

export default DeleteOpportunityModal;
