import { ChildErrorsForm, CreateChildForm } from "@/types/child";
import React from "react";
import { gradeOptions } from "../../../../../utils/displayGrade";

type Props = {
    form: CreateChildForm;
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    saving: boolean;
    errors: ChildErrorsForm;
};

export default function UpdateChildMetaFields({ errors, form, onChange, saving }: Props) {
    const bdayErr = errors.birthday;

    return (
        <>
        {/* BIRTHDAY */}
        <div className="mb-3 sm:mb-4">
            <label htmlFor="birthday" className="block text-sm sm:text-base font-semibold tracking-wide text-wondergreen mb-1.5 sm:mb-2">
                BIRTHDAY
            </label>
            <input
            id="birthday"
            name="birthday"
            type="date"
            value={form.birthday}
            max={new Date().toISOString().split("T")[0]}
            onChange={onChange}
            disabled={saving}
            className="w-full rounded-xl border border-gray-200 bg-white
                        px-2.5 py-1.5 text-[15px] sm:px-3 sm:py-2 sm:text-base
                        focus:outline-none focus:ring-2 focus:ring-wondergreen/40"
            />
            {bdayErr && (
                <p id="birthday-error" className="mt-1 text-sm text-red-600">
                    {bdayErr}
            </p>
            )}
        </div>

        <div className="mb-5 sm:mb-6">
            <span className="block text-sm sm:text-base font-semibold tracking-wide text-wondergreen mb-2">
                SCHOOL TYPE
            </span>

            <div className="space-y-2">
                <label className="flex items-start gap-2">
                    <input
                        type="radio"
                        name="schoolType"
                        value="homeschool"
                        checked={form.schoolType === "homeschool"}
                        onChange={onChange}
                        disabled={saving}
                        className="mt-1 h-4 w-4 accent-wondergreen"
                    />
                    <span className="text-sm md:text-base text-wonderforest">
                        Homeschool
                    </span>
                </label>

                <label className="flex items-start gap-2">
                    <input
                        type="radio"
                        name="schoolType"
                        value="public_custer"
                        checked={form.schoolType === "public_custer"}
                        onChange={onChange}
                        disabled={saving}
                        className="mt-1 h-4 w-4 accent-wondergreen"
                    />
                    <span className="text-sm md:text-base text-wonderforest">
                        Public school (Custer County School District C-1)
                    </span>
                </label>

                <label className="flex items-start gap-2">
                    <input
                        type="radio"
                        name="schoolType"
                        value="private_custer"
                        checked={form.schoolType === "private_custer"}
                        onChange={onChange}
                        disabled={saving}
                        className="mt-1 h-4 w-4 accent-wondergreen"
                    />
                    <span className="text-sm md:text-base text-wonderforest">
                        Private school (Custer County)
                    </span>
                </label>
            </div>
        </div>

        {/* GRADE + PHOTO CONSENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mb-5 sm:mb-6 items-start">
            {/* Grade */}
            <div>
                <label htmlFor="grade" className="block text-sm sm:text-base font-semibold tracking-wide text-wondergreen mb-1.5 sm:mb-2">
                    GRADE (OPTIONAL)
                </label>
                <select
                    id="grade"
                    name="grade"
                    value={form.grade ?? ""}
                    onChange={onChange}
                    disabled={saving}
                    className="w-full rounded-xl border border-gray-200 bg-white
                            px-2.5 py-1.5 text-[15px] sm:px-3 sm:py-2 sm:text-base
                            focus:outline-none focus:ring-2 focus:ring-wondergreen/40"
                >
                    <option value="">N/A</option>
                    {gradeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                    </option>
                    ))}
                </select>
            </div>

            {/* Photo consent */}
            <div>
                <span className="block text-sm sm:text-base font-semibold tracking-wide text-wondergreen mb-2">
                    PHOTO CONSENT
                </span>

                <label htmlFor="photoConsent" className="inline-flex items-center gap-3">
                    <input
                    id="photoConsent"
                    name="photoConsent"
                    type="checkbox"
                    checked={!!form.photoConsent}
                    onChange={onChange}
                    disabled={saving}
                    className="h-5 w-5 rounded accent-wondergreen focus:ring-wondergreen"
                    />
                    <span className="text-wonderforest text-[15px] sm:text-base">
                        Allowed to appear in photos
                    </span>
                </label>
            </div>
        </div>
        </>
    );
}
