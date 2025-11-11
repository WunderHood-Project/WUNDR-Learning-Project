import { ChildErrorsForm, CreateChildForm } from "@/types/child";
import React from "react";
import { FaX, FaCheck } from "react-icons/fa6";

type Props = {
    form: CreateChildForm;
    errors: ChildErrorsForm;
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    saving: boolean;
    onSubmitClick: () => void;
    onCancel: () => void;
    isValid: boolean;
};

export default function UpdateChildHeaderFields({ form, onChange, saving, onSubmitClick, onCancel, isValid, errors }: Props) {
    const firstNameErr = errors.firstName;
    const lastNameErr = errors.lastName;

    return (
        <div className="mb-6">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {/* FIRST NAME */}
                        <div>
                        <label
                            htmlFor="firstName"
                            className="block text-sm sm:text-base font-semibold text-wondergreen mb-1.5 sm:mb-2"
                        >
                            FIRST NAME
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={form.firstName}
                            onChange={onChange}
                            placeholder="Legal First Name"
                            className="w-full rounded-xl border border-gray-200 bg-white
                                    px-2.5 py-1.5 text-[15px] sm:px-3 sm:py-2 sm:text-base
                                    focus:outline-none focus:ring-2 focus:ring-wondergreen/40"
                            disabled={saving}
                            aria-invalid={!!firstNameErr}
                            aria-describedby={firstNameErr ? "firstName-error" : undefined}
                        />
                        {firstNameErr && (
                            <p id="firstName-error" className="mt-1 text-sm text-red-600">
                            {firstNameErr}
                            </p>
                        )}
                        </div>

                        {/* LAST NAME */}
                        <div>
                        <label
                            htmlFor="lastName"
                            className="block text-sm sm:text-base font-semibold text-wondergreen mb-1.5 sm:mb-2"
                        >
                            LAST NAME
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={form.lastName}
                            onChange={onChange}
                            placeholder="Legal Last Name"
                            className="w-full rounded-xl border border-gray-200 bg-white
                                    px-2.5 py-1.5 text-[15px] sm:px-3 sm:py-2 sm:text-base
                                    focus:outline-none focus:ring-2 focus:ring-wondergreen/40"
                            disabled={saving}
                            aria-invalid={!!lastNameErr}
                            aria-describedby={lastNameErr ? "lastName-error" : undefined}
                        />
                        {lastNameErr && (
                            <p id="lastName-error" className="mt-1 text-sm text-red-600">
                            {lastNameErr}
                            </p>
                        )}
                        </div>

                        {/* PREFERRED NAME — всегда на всю ширину */}
                        <div className="md:col-span-2">
                        <label
                            htmlFor="preferredName"
                            className="block text-sm sm:text-base font-semibold text-wondergreen mb-1.5 sm:mb-2"
                        >
                            PREFERRED NAME (OPTIONAL)
                        </label>
                        <input
                            id="preferredName"
                            name="preferredName"
                            type="text"
                            value={form.preferredName ?? ""}
                            onChange={onChange}
                            placeholder="Optional: Preferred Name"
                            className="w-full rounded-xl border border-gray-200 bg-white
                                    px-2.5 py-1.5 text-[15px] sm:px-3 sm:py-2 sm:text-base
                                    focus:outline-none focus:ring-2 focus:ring-wondergreen/40"
                            disabled={saving}
                        />
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex gap-2 ml-2">
                    <button
                        type="button"
                        onClick={onSubmitClick}
                        disabled={!isValid || saving}
                        className="p-2 text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        aria-label="Save"
                        title="Save"
                    >
                        <FaCheck className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="p-2 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        aria-label="Cancel"
                        title="Cancel"
                    >
                        <FaX className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
