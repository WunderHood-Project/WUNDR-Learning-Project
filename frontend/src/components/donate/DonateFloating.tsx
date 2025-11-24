"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DonateFloating() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Don't show the button on the donation page itself or in the admin panel.
    if (pathname === "/donate" || pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-40">
            {/* Open panel */}
            {open && (
                <div className="mb-3 w-64 rounded-2xl bg-white/95 backdrop-blur shadow-xl border border-wonderleaf/30 p-4 text-sm text-gray-800">
                    <p className="font-semibold text-wondergreen mb-1">
                        Support WonderHood
                    </p>
                    <p className="text-xs text-gray-600 mb-3">
                        Your donation helps us run clubs, outdoor adventures, and programs
                        for kids and teens.
                    </p>

                    <Link
                        href="/donate"
                        className="block w-full text-center rounded-full bg-wondergreen text-white py-2 text-sm font-semibold hover:bg-wonderleaf transition-colors"
                    >
                        Donate
                    </Link>
                </div>
            )}

            {/*Open/Close Icon Button  */}
            <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Hide donation panel" : "Show donation panel"}
            className="
            flex items-center gap-2
            rounded-full shadow-lg
            px-3 py-2
            bg-wondergreen text-white
            hover:bg-wonderleaf
            transition-colors
            "
            >
                {/* Heart icon */}
                <span
                className="
                inline-flex items-center justify-center
                w-7 h-7 md:w-10 md:h-10 rounded-full
                bg-white/15
                "
                >
                    {/* SVG-icon */}
                    <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    >
                        <path
                        d="M12 21s-4.5-2.7-7.2-5.4C3 13.8 2 12.3 2 10.5 2 8 3.8 6 6.2 6 7.8 6 9.3 6.9 10 8.2 10.7 6.9 12.2 6 13.8 6 16.2 6 18 8 18 10.5c0 1.8-1 3.3-2.8 5.1C16.5 18.3 12 21 12 21z"
                        fill="currentColor"
                        />
                    </svg>
                </span>

                <span className="text-sm font-semibold hidden sm:inline">
                    {open ? "Close" : "Donate"}
                </span>
            </button>
        </div>
  );
}
