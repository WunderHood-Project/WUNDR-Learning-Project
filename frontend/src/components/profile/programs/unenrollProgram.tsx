import { Child } from "@/types/child";
import React, { useState } from "react";
import { makeApiRequest, determineEnv } from "../../../../utils/api";

const WONDERHOOD_URL = determineEnv();

type Props = {
  enrolledChildren: Child[];
  programId: string | undefined;
  onAfterUnenroll?: () => void;
  onCancel?: () => void;
};

const UnenrollProgram: React.FC<Props> = ({ enrolledChildren, programId, onAfterUnenroll, onCancel }) => {
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const hasSelection = selected.size > 0;

    const toggleChild = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleUnenroll = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!programId) {
            setServerError("Program id is missing.");
            return;
        }
        const childIds = Array.from(selected);
        if (childIds.length === 0) {
            setServerError("Please select at least one child.");
            return;
        }

        try {
            setSubmitting(true);
            await makeApiRequest(`${WONDERHOOD_URL}/program/${programId}/unenroll`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: { childIds },
            });
            setSelected(new Set());
            onAfterUnenroll?.();
        } catch (err) {
            setServerError(err instanceof Error ? err.message : "Failed to unenroll child(ren)");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleUnenroll} className="space-y-4">
            <fieldset className="space-y-2">
                {enrolledChildren?.map(child => {
                    const isChecked = selected.has(child.id);
                    return (
                        <label key={child.id} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleChild(child.id)}
                                className="h-4 w-4"
                            />
                            <span className="text-wondergreen font-medium">
                                {(child.preferredName ?? child.firstName) + " " + child.lastName}
                            </span>
                        </label>
                    );
                })}
            </fieldset>

            {serverError && <div className="rounded bg-red-50 text-red-700 p-3 text-sm">{serverError}</div>}

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-wondergreen/30 text-wondergreen hover:bg-wonderleaf/10 font-semibold"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={!hasSelection || submitting}
                    aria-disabled={!hasSelection || submitting}
                    title={!hasSelection ? "Select at least one child" : "Unenroll"}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-lg font-bold text-white transition
                        ${(!hasSelection || submitting)
                        ? "bg-red-300 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 shadow-md"}`}
                >
                    {submitting ? "Unenrolling..." : "Unenroll"}
                </button>
            </div>
        </form>
    );
};

export default UnenrollProgram;
