'use client';

import React from "react";

//Minimal alert component for success/error states.

export default function Alert({
    kind, children, className = "",
}: { kind: "error" | "success"; children: React.ReactNode; className?: string }) {

    const styles = kind === "success"
    ? "bg-green-50 border border-green-200 text-green-700"
    : "bg-red-50 border border-red-200 text-red-700";

    return (
        <div className={`p-3 rounded-lg text-sm ${styles} ${className}`}>
            {children}
        </div>
    )
    
}
