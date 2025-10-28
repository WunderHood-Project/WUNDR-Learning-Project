import { CreateChildForm } from "@/types/child";
import React from "react";

const WAIVER_PLACEHOLDER = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`


type Props = {
    child: CreateChildForm
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    submitting?: boolean
    prevStep: () => void
}

const Waiver: React.FC<Props> = ({ child, onChange, submitting, prevStep }) => {

    return (
        <>
            <h2 className="flex flex-col text-xl mt-4 mb-6 text-center">Waiver</h2>

            <label htmlFor="waiver-text" className="sr-only">Waiver Text</label>
            <textarea
                id="waiver-text"
                readOnly
                rows={8}
                className="w-full resize-y rounded-lg border border-gray-300 p-3 text-sm bg-gray-50"
                value={WAIVER_PLACEHOLDER}
            />

            <p className="mt-2 text-xs text-gray-500">
                Check the box below to acknowledge that you have read and agree to the waiver.
            </p>

            <label className="inline-flex items-center gap-2">
                <input
                    type="checkbox"
                    name="waiver"
                    checked={child.waiver ?? false}
                    onChange={onChange}
                    className="h-4 w-4"
                />
                <span>
                    I have read and agree to the waiver above. Checking this box constitutes my electronic signature.
                </span>
            </label>

            <div className="flex space-x-3 pt-4">
                <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 font-medium"
                >
                    Back
                </button>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-60"
                >
                    {submitting ? "Saving…" : "Save"}
                </button>
            </div>
        </>
    )
}

export default Waiver
