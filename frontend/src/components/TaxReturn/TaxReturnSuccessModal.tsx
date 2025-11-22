import { useModal } from "@/context/modal"

export default function TaxReturnSuccessModal() {
    const { closeModal } = useModal()

    return (
        <div className="flex justify-center mt-10">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-100">
                <p className="text-gray-700 text-center text-lg font-medium">
                    🎉 Thank you for your contribution!
                    <br />
                    Payment was successful, and if a tax return was requested, our team will send one out as soon as possible!
                </p>

                <div className="flex justify-center">
                    <button
                        onClick={closeModal}
                        className="mt-6 bg-wonderleaf text-white font-semibold px-6 py-2 rounded-xl hover:bg-wonderleaf/80 transition-all shadow-md"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    )
}