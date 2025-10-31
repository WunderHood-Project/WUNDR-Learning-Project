'use client';
import Link from 'next/link';

export default function ChildrenList({
    items, showCTA = true,ctaHref = '/profile?tab=child&open=add',
}: {
    items: { id: string; name: string; subtitle?: string }[];
    showCTA?: boolean;
    ctaHref?: string;
}) {

    const isEmpty = items.length === 0;

    return (
        <section className="bg-white rounded-2xl shadow-lg border border-wondergreen/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-wondersun via-wonderleaf to-wondergreen" />
            <div className="p-4 sm:p-8">
                <h3 className="text-wondergreen font-bold flex items-center gap-2 mb-3 sm:mb-4 font-semibold sm:text-xl">
                    <span className="text-base sm:text-xl">👨‍👩‍👧</span>
                    Your Children
                </h3>

                {isEmpty ? (
                    <div className="rounded-xl border border-wonderleaf/30 bg-wonderleaf/10 p-4">
                        <p className="text-wondergreen mb-3 text-sm sm:text-base">
                            You haven’t registered any children yet.
                        </p>
                        {showCTA && (
                            <Link
                                href={ctaHref}
                                className="inline-flex items-center gap-2 rounded-lg bg-wondergreen text-white px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-base hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-wonderleaf mt-2"
                            >
                                Add a child
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((c) => (
                            <div
                                key={c.id}
                                className="rounded-xl border border-wonderleaf/30 bg-gradient-to-r from-wonderleaf/10 to-white px-4 py-3"
                            >
                                <div className="font-semibold text-wondergreen text-base sm:text-lg">{c.name}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
