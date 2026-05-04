'use client';

import { useRouter } from 'next/navigation';

type Props = {
    hasEvents: boolean;
};

export default function Header({ hasEvents }: Props) {
    const router = useRouter();

    const title = hasEvents ? "Enrolled Events" : "No Enrollments Yet";

    return (
        <div className="mb-4">
            <div className="flex items-center gap-3 flex-wrap ml-2 md:ml-14">
                <h1
                    className="
                        text-2xl sm:text-2xl md:text-4xl
                        font-bold md:font-extrabold
                        leading-tight
                        tracking-normal md:tracking-tight
                        text-wondergreen/95
                    "
                >
                    {title}
                </h1>
            </div>

            <div className="h-1 mt-3 rounded-full bg-gradient-to-r from-wondersun to-wonderorange w-24 sm:w-28 md:w-36 ml-2 md:ml-14" />

            {!hasEvents && (
                <div className="mt-4 ml-2 md:ml-14">
                    <p className="text-sm text-wondergreen/80 mb-2">
                        You don&apos;t have any event enrollments yet.
                    </p>
                    <button
                        type="button"
                        onClick={() => router.push("/events")}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-wondergreen text-white text-sm font-medium shadow-sm hover:bg-wondergreen/90"
                    >
                        Browse Events
                    </button>
                </div>
            )}
        </div>
    );
}
