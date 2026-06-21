import { useModal } from "../../../../context/modal";
import { ProgramMessage } from "@/types/program";
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';

type Props = {
    message: ProgramMessage;
    onDelete: () => void;
}

const ProgramDetailsMessageDeleteModal: React.FC<Props> = ({ message, onDelete }) => {
    const { closeModal } = useModal();

    return (
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center mb-4">
                <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
                <h2 className="text-xl font-bold text-gray-800">Delete Program</h2>
            </div>

            <div className="mb-6">
                <p className="text-gray-600 mb-2">
                    Are you sure you want to delete this message? This action cannot be undone.
                </p>
            </div>

            <div className="flex gap-3 justify-end">
                <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>

                <button
                    onClick={() => { onDelete(); closeModal(); }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <FaTrash className="w-4 h-4" />
                    Delete
                </button>
            </div>
        </div>
    )
}

export default ProgramDetailsMessageDeleteModal;