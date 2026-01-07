import React, { useMemo } from "react";
import type { ChildErrorsForm, CreateChildForm } from "@/types/child";

type Props = {
    child: CreateChildForm;
    errors?: ChildErrorsForm;
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    submitting?: boolean;
    prevStep: () => void;
    // Per-section acknowledgements (key -> checked). User must acknowledge all sections.
    ack: Record<string, boolean>;
    setAck: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    // Typed guardian name used for the waiver signature record.
    fullName: string;
    setFullName: React.Dispatch<React.SetStateAction<string>>;
    // Display-only signed time (backend timestamp formatted for MT), if available.
    signedAtLocal?: string | null;
    // Waiver content snapshot (from backend).
    waiverSections: { key: string; title: string; body: string }[];
    waiverVersion: string;
     // Optional short conduct policy text that may be appended to the conduct section.
    conductPolicyShort?: string;
    };

    const Waiver: React.FC<Props> = ({
        child, errors, onChange, submitting, prevStep,
        ack, setAck, fullName, setFullName, signedAtLocal,
        waiverSections, waiverVersion, conductPolicyShort,
    }) => {


    // True when every waiver section has been acknowledged.
    const allSectionsAcked = useMemo(
        () => waiverSections.every(sec => Boolean(ack[sec.key])),
        [ack, waiverSections]
    );


    // Minimal validation for the typed full name (used as an e-signature name field).
    const fullNameOk = fullName.trim().length >= 2;
    // "Can enable the final waiver checkbox" gate: requires all section acknowledgements + a typed name.
    const canAgreeAll = allSectionsAcked && fullNameOk;
     // "Can submit the whole form" gate: requires the final waiver checkbox + the above conditions.
    const canSubmit = (child.waiver ?? false) && canAgreeAll;

    // Toggles a single section acknowledgement flag in local state.
    const toggleAck = (key: string) => {
        setAck(prev => ({ ...prev, [key]: !prev[key] }));
    };

   
    return (
        <>
        <h2 className="flex flex-col text-xl mt-4 text-center">
            Liability Waiver
            <div className="text-xs text-gray-500 space-y-1 mt-1">
                <p>
                    Version {waiverVersion} • Your agreement time is recorded automatically. Questions? wonderhood.project@gmail.com
                </p>
                <p className="font-bold">
                    Instructions: Please review each section and check the acknowledgement box to continue.
                </p>
            </div>
        </h2>



        {/* Accordion-style sections; each must be acknowledged */}
        <div className="mt-4 space-y-3">
            {waiverSections.map((sec, i) => (
                <details key={sec.key} className="rounded-lg border bg-gray-50 open:bg-white">
                    <summary className="cursor-pointer select-none px-3 py-2 font-medium">
                        {i + 1}. {sec.title}
                    </summary>

                    <div className="px-3 pb-3 pt-1 text-sm leading-relaxed text-gray-800">
                        {/* Long text rendered with preserved line breaks */}
                        <div className="max-h-40 overflow-auto whitespace-pre-line">
                            {sec.body}

                            {sec.key === "code_of_conduct" && conductPolicyShort && (
                                <>
                                {"\n\n"}
                                {conductPolicyShort}
                                </>
                            )}
                        </div>


                        {/* Section acknowledgment */}
                        <label className="mt-3 inline-flex items-center gap-2 text-sm">
                            <input
                            type="checkbox"
                            checked={Boolean(ack[sec.key])}
                            onChange={() => toggleAck(sec.key)}
                            className="h-4 w-4"
                            />
                            <span>I have read and understand this section.</span>
                        </label>
                    </div>
                </details>
            ))}
        </div>

        <div className="mt-5">
            <label htmlFor="waiver-fullname" className="block text-sm font-medium mb-1">
                Parent/Guardian Full Legal Name
            </label>

            <input
                id="waiver-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="First Middle Last"
                className="w-full p-2 border rounded-md"
            />

            {fullName.trim().length > 0 && !fullNameOk && (
                <p className="mt-2 text-xs text-red-600">
                    Please enter your full legal name to continue.
                </p>
            )}

            <p className="mt-2 text-xs text-gray-500">
                Type your full legal name as your electronic signature.
                <span className="block">
                By typing your name, you agree this constitutes your legal signature and you consent to electronic records.
                </span>
            </p>
        </div>

        <div className="mt-4 rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-600">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span>Signed at: {signedAtLocal ? signedAtLocal : "recorded upon submission (MT)"}</span>
                <span>Waiver version: {waiverVersion}</span>
            </div>
        </div>


        {/* Final legal agreement checkbox (serves as e-signature) */}
        <div className="mt-4">
            <label className="inline-flex items-start gap-2">
                <input
                type="checkbox"
                name="waiver"
                checked={child.waiver ?? false}
                onChange={onChange}
                className="mt-1 h-4 w-4"
                disabled={!canAgreeAll}  // <-- locked until all sections + full name
                aria-disabled={!canAgreeAll}
                aria-describedby={errors?.waiver ? "waiver-error" : undefined}
                required
                />
                <span className="text-sm">
                        I have read and agree to the WonderHood Liability Waiver Version:({waiverVersion}). 
                        I am the child’s parent/legal guardian (18+) and I am signing electronically.
                        {!canAgreeAll && (
                            <span className="block text-xs text-gray-500 mt-1">
                                Please acknowledge all sections and enter your full name to enable this checkbox.
                            </span>
                        )}
                </span>
            </label>
            {errors?.waiver && (
                <p id="waiver-error" className="mt-2 text-sm text-red-600">{errors.waiver}</p>
            )}
        </div>

        {/* Reminder about photo consent being a separate control */}
        <div className="mt-6 text-xs text-gray-500">
            <strong>Reminder:</strong> Photo & Media consent is handled separately on Step 1. You can revoke photo consent later via email.
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-5">
            <button
            type="button"
            onClick={prevStep}
            className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 font-medium"
            >
                Back
            </button>

            <button
            type="submit"
            // True lock: Submit requires the final checkbox + all conditions
            disabled={submitting || !canSubmit}
            aria-disabled={submitting || !canSubmit}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-60"
            >
            {submitting ? "Submitting…" : "Submit"}
            </button>
        </div>
        </>
    );
};

export default Waiver;
