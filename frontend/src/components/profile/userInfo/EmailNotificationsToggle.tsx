"use client";

import { determineEnv, makeApiRequest } from "../../../../utils/api";
import { useEffect, useState } from "react";

const API = determineEnv();

export default function EmailNotificationsToggle() {
    const [enabled, setEnabled] = useState<boolean>(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    
    }, []);

    const handleToggle = async () => {
        if (saving) return;

        const next = !enabled;
        setSaving(true);
        setError(null);

        try {
        await makeApiRequest(`${API}/user`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: { emailNotificationsEnabled: next },
        });

        setEnabled(next);
        } catch (e) {
            console.error("toggle email notifications failed", e);
            setError(
                e instanceof Error
                ? e.message
                : "Failed to update email notifications"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between w-full px-2 py-2 rounded-xl hover:bg-gray-50">
                <span className="text-sm font-medium text-gray-800">
                    Email notifications
                </span>

                <button
                type="button"
                onClick={handleToggle}
                disabled={saving}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition ${
                    enabled ? "bg-wondergreen" : "bg-gray-300"
                } ${saving ? "opacity-60 cursor-wait" : ""}`}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                        enabled ? "translate-x-5" : "translate-x-1"
                        }`}
                    />
                </button>
            </div>

            {error && (
                <span className="block mt-1 text-xs text-red-600">{error}</span>
            )}
        </div>
    );
}
