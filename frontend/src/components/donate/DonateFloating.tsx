"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

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
            px-3 py-2 md:px-5 md:py-3
            bg-wondergreen text-white
            hover:bg-wonderleaf
            transition-colors mr-0 md:mr-4
            "
            >
                {/* Heart icon */}
                <span
                className="
                inline-flex items-center justify-center
                w-7 h-7 md:w-10 md:h-10 rounded-full
                bg-white/15
                animate-heart-beat
                "
                >
                    <FaHeart className="text-red-500 w-4 h-4" />
                </span>

                <span className="text-sm font-semibold hidden sm:inline">
                    {open ? "Close" : "Donate"}
                </span>
            </button>
        </div>
  );
}
