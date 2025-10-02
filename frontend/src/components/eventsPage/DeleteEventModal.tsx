import { useModal } from "@/app/context/modal";
import { useState } from "react";
import { Event } from "@/types/event";
import React from "react";
import { makeApiRequest } from "../../../utils/api";
import { FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { determineEnv } from "../../../utils/api";

const WONDERHOOD_URL = determineEnv()

type props = {
  event: Event;
};

const DeleteEventModal: React.FC<props> = ({ event }) => {
  const { closeModal } = useModal();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await makeApiRequest(`${WONDERHOOD_URL}/event/${event.id}`, {
        method: "DELETE",
      });
      closeModal();
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
          <h2 className="text-xl font-bold text-gray-800">Delete Child</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete ${event.name}?
          </p>
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
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
    </>
  );
};

export default DeleteEventModal;
