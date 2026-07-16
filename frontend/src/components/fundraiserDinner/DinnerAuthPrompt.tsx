'use client';
import ModalHeader from "../login/ModalHeader";

export default function DinnerAuthPrompt({
    onLogin,
    onGuest,
    onClose,
}: {
    onLogin: () => void;
    onGuest: () => void;
    onClose: () => void;
}) {
    return (
        <div className="bg-white rounded-3xl shadow-2xl w-[440px] max-w-[90vw] mx-auto p-6 sm:p-8">
            <ModalHeader title="Have an Account?" onClose={onClose} />
            <p className="text-sm text-gray-600 mb-6 text-center">
                Log in to link this ticket to your account, or continue as a guest.
            </p>
            <div className="space-y-3">
                <button
                    type="button"
                    onClick={onLogin}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full py-3 transition-colors"
                >
                    Log In
                </button>
                <button
                    type="button"
                    onClick={onGuest}
                    className="w-full border-2 border-green-600 text-green-700 hover:bg-green-50 font-semibold rounded-full py-3 transition-colors"
                >
                    Continue as Guest
                </button>
            </div>
        </div>
    );
}
