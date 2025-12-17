'use client';

import type { Event } from '@/types/event';

export default function EventAboutSection({ event }: { event: Event }) {
    const notesText = (event.notes ?? '').trim();
    const hasNotes = notesText.length > 0;

    return (
        <section className="lg:col-span-2">
            {/* About This Event */}
            <div className="bg-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm border border-white/60 mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-wondergreen mb-3 sm:mb-4">
                    About This Event
                </h2>
                <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                    {event.description}
                </p>
            </div>

            {/* Notes */}
            <div className="bg-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm border border-white/60">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-wondergreen mb-3 sm:mb-3.5">
                    Notes & What to Bring
                </h3>

                {hasNotes ? (
                    <div>
                        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-wonderorange/10 rounded-lg border border-wonderorange/30">
                            <span className="text-lg font-bold text-wonderorange">!</span>
                            <h4 className="text-sm sm:text-base font-bold text-wonderorange uppercase tracking-wide">
                                Important
                            </h4>
                        </div>

                        <ul className="list-disc pl-5 sm:pl-6 space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                            {notesText
                                .split('\n')
                                .filter(Boolean)
                                .map((line, i) => (
                                    <li key={`note-${i}`} className="leading-relaxed">
                                        {line}
                                    </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="bg-white/60 rounded-lg border border-gray-200 p-4 sm:p-6">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Organizers can add extra details here (e.g., clothing, supplies to bring, parking, check-in instructions).
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
