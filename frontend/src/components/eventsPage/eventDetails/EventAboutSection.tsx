'use client';

import type { Event } from '@/types/event';

export default function EventAboutSection({ event }: { event: Event }) {
  // Optional fields you may add to your DB later:
  // event.notes?: string
  // event.requirements?: string

  // Fallback text so the section is visible even with no data yet
  const hasNotes =
    Boolean((event as any).notes) || Boolean((event as any).requirements);
  const notesText = String((event as any).notes || '').trim();
  const reqText = String((event as any).requirements || '').trim();

  return (
    <section className="lg:col-span-2">
      <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm border border-white/60">
        {/* About */}
        <h2 className="text-lg font-bold text-wondergreen mb-4">About {event.name} Event</h2>
        <p className="text-gray-800 leading-relaxed text-base">
          {event.description}
        </p>

        {/* Notes / What to bring — ALWAYS render the section */}
        <div className="mt-6 pt-6 border-t border-white/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-wonderleaf/10 text-wonderleaf border border-wonderleaf/30 text-xs font-bold">
              !
            </span>
            <h3 className="text-sm font-bold text-wondergreen uppercase tracking-wide">
              Notes &amp; What to Bring
            </h3>
          </div>

          {/* If you have notes/requirements, show them nicely. Otherwise show a soft placeholder. */}
          {hasNotes ? (
            <div className="space-y-4">
              {notesText && (
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {notesText
                    .split('\n')
                    .filter(Boolean)
                    .map((line, i) => (
                      <li key={`note-${i}`}>{line}</li>
                    ))}
                </ul>
              )}

              {reqText && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">
                    Suggested items / requirements
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                    {reqText
                      .split('\n')
                      .filter(Boolean)
                      .map((line, i) => (
                        <li key={`req-${i}`}>{line}</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-200 bg-white/60 p-4">
              <p className="text-sm text-gray-600">
                Organizers can add extra details here (e.g., clothing, supplies to
                bring, parking, check-in instructions). This is just a placeholder
                until notes are added.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
