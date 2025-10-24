'use client';

import type { Event } from '@/types/event';

export default function EventAboutSection({ event }: { event: Event }) {
  const hasNotes = Boolean((event as any).notes) || Boolean((event as any).requirements);
  const notesText = String((event as any).notes || '').trim();
  const reqText = String((event as any).requirements || '').trim();

  return (
    <section className="lg:col-span-2">
      {/* About This Event Card */}
      <div className="bg-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm border border-white/60 mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-wondergreen mb-3 sm:mb-4">
          About This Event
        </h2>
        <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Notes & What to Bring Card */}
      <div className="bg-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm border border-white/60">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-wondergreen mb-3 sm:mb-3.5">
          Notes & What to Bring
        </h3>

        {hasNotes ? (
          <div className="space-y-8">
            {/* Notes section */}
            {notesText && (
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
            )}

            {/* Requirements section */}
            {reqText && (
              <div className={notesText ? 'border-t border-white/50 pt-8' : ''}>
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">
                  What to Bring
                </h4>
                <ul className="list-disc pl-5 sm:pl-6 space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                  {reqText
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={`req-${i}`} className="leading-relaxed">
                        {line}
                      </li>
                    ))}
                </ul>
              </div>
            )}
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