import React, { useMemo, useState } from "react";
import type { ChildErrorsForm, CreateChildForm } from "@/types/child";
import { WAIVER_VERSION, WAIVER_SECTIONS } from "@/constants/policies";

type Props = {
    child: CreateChildForm;
    errors?: ChildErrorsForm;
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    submitting?: boolean;
    prevStep: () => void;
};

const Waiver: React.FC<Props> = ({ child, errors, onChange, submitting, prevStep }) => {
    /**
     * Local UX-only state. We do NOT send these to the server.
     * - ack: per-section "I read this section" confirmations
     * - fullName: typed parent/guardian name for on-screen confirmation
     */
    const [ack, setAck] = useState<boolean[]>(() => Array(WAIVER_SECTIONS.length).fill(false));
    const [fullName, setFullName] = useState("");

    // All sections acknowledged?
    const allSectionsAcked = useMemo(() => ack.every(Boolean), [ack]);

    // Simple full name check – adjust as needed (e.g., require a space)
    const fullNameOk = fullName.trim().length >= 2;

    /**
     * We allow checking the FINAL legal checkbox (child.waiver) only when:
     * - user acknowledged ALL sections, AND
     * - typed a full name
     */
    const canAgreeAll = allSectionsAcked && fullNameOk;

    /**
     * The form can be submitted only when:
     * - the final checkbox (child.waiver) is checked (this is the e-signature), AND
     * - canAgreeAll is true
     */
    const canSubmit = (child.waiver ?? false) && canAgreeAll;

    // Toggle per-section acknowledgment flag
    const toggleAck = (i: number) => {
        setAck(prev => {
            const next = [...prev];
            next[i] = !next[i];
            return next;
        });
    };

    return (
        <>
        <h2 className="flex flex-col text-xl mt-4 text-center">
            Liability Waiver
            <div className="text-xs text-gray-500 space-y-1">
                <p>Version {WAIVER_VERSION} • Your agreement time is recorded automatically.</p>
                <p className="font-bold">Instructions: Please check all boxes in each dropdown menu to proceed.</p>
            </div>

        </h2>

        {/* Accordion-style sections; each must be acknowledged */}
        <div className="mt-4 space-y-3">
            {WAIVER_SECTIONS.map((sec, i) => (
                <details key={sec.title} className="rounded-lg border bg-gray-50 open:bg-white">
                    <summary className="cursor-pointer select-none px-3 py-2 font-medium">
                        {i + 1}. {sec.title}
                    </summary>

                    <div className="px-3 pb-3 pt-1 text-sm leading-relaxed text-gray-800">
                        {/* Long text rendered with preserved line breaks */}
                        <div className="max-h-40 overflow-auto whitespace-pre-line">{sec.body}</div>

                        {/* Section acknowledgment */}
                        <label className="mt-3 inline-flex items-center gap-2 text-sm">
                            <input
                            type="checkbox"
                            checked={ack[i]}
                            onChange={() => toggleAck(i)}
                            className="h-4 w-4"
                            />
                            <span>I have read and understand this section.</span>
                        </label>
                    </div>
                </details>
            ))}
        </div>

        {/* Parent/guardian full name (UX-only, not sent to server) */}
        <div className="mt-4">
            <label htmlFor="waiver-fullname" className="block text-sm font-medium mb-1">
                Parent/Guardian Full Name
            </label>
            <input
            id="waiver-fullname"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="First Last"
            className="w-full p-2 border rounded-md"
            />
            <p className="mt-1 text-xs text-gray-500">
                For on-screen confirmation only. Not submitted to the server.
            </p>
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
                        I have read all sections above and agree to WonderHood’s Liability Waiver (v{WAIVER_VERSION}). I am the child’s parent/guardian.
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
