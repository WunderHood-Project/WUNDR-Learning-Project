import { ChildErrorsForm, CreateChildForm } from "@/types/child"
import React from "react"
import { FaX, FaCheck } from "react-icons/fa6"

type Props = {
    form: CreateChildForm
    errors: ChildErrorsForm
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    saving: boolean
    onSubmitClick: () => void
    onCancel: () => void
    isValid: boolean
}

export default function UpdateChildHeaderFields({ form, onChange, saving, onSubmitClick, onCancel, isValid, errors }: Props) {
    const firstNameErr = errors.firstName
    const lastNameErr = errors.lastName

    return (
        <div className="mb-6">
            <div className="flex items-start justify-between">
                <div className="w-[300px]">
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            name="firstName"
                            type="text"
                            value={form.firstName}
                            onChange={onChange}
                            placeholder="Legal First Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                            disabled={saving}
                        />
                        {firstNameErr && (<p id="firstName-error" className="mt-1 text-sm text-red-600">{firstNameErr}</p>)}

                        <input
                            name="lastName"
                            type="text"
                            value={form.lastName}
                            onChange={onChange}
                            placeholder="Legal Last Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                            disabled={saving}
                        />
                        {lastNameErr && (<p id="firstName-error" className="mt-1 text-sm text-red-600">{lastNameErr}</p>)}


                        <input
                            name="preferredName"
                            type="text"
                            value={form.preferredName ?? ""}
                            onChange={onChange}
                            placeholder="OPTIONAL: Preferred Name"
                            className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wondergreen focus:border-transparent"
                            disabled={saving}
                        />
                    </div>
                </div>

                <div className="flex gap-2 ml-4">
                    <button
                        type="button"
                        onClick={onSubmitClick}
                        disabled={!isValid || saving}
                        className="p-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        aria-label="Save"
                    >
                        <FaCheck className="w-4 h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="p-2 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        aria-label="Cancel"
                    >
                        <FaX className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
