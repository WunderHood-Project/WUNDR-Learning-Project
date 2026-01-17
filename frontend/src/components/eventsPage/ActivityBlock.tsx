'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Event } from '@/types/event';
import EventCard from './EventCard';
import { Mountain, Landmark, FlaskConical } from 'lucide-react';

interface Props {
  activityName: string;
  events: Event[];
  isAdmin: boolean;
  onDelete: (id: string) => void;
}

/** Theme per activity (bar, title, chip colors) */
type Theme = {
  bar: string;
  title: string;
  chipBg: string;
  chipRing: string;
};

const getTheme = (name: string): Theme => {
  switch (name.toLowerCase()) {
    case 'outdoor':
      return {
        bar: 'bg-gradient-to-r from-wondergreen to-wonderleaf',
        title: 'text-wondergreen',
        chipBg: 'bg-wondergreen/10',
        chipRing: 'ring-wonderleaf/30',
      };
    case 'indoor':
      return {
        bar: 'bg-gradient-to-r from-wonderorange to-wondersun',
        title: 'text-wondergreen',
        chipBg: 'bg-wondersun/25',
        chipRing: 'ring-wonderorange/35',
      };
    case 'stem':
      // green-ish instead of blue
      return {
        bar: 'bg-gradient-to-r from-wonderleaf to-wondergreen',
        title: 'text-wondergreen',
        chipBg: 'bg-wonderleaf/20',
        chipRing: 'ring-wondergreen/30',
      };
    default:
      return {
        bar: 'bg-gradient-to-r from-wonderleaf to-wonderorange',
        title: 'text-wondergreen',
        chipBg: 'bg-gray-100',
        chipRing: 'ring-gray-300/40',
      };
  }
};

/** Lucide icon per activity (fallback = emoji) */
const HeaderIcon = ({ name }: { name: string }) => {
  const n = name.toLowerCase();
  const common = 'h-6 w-6 text-wondergreen';
  if (n === 'outdoor') return <Mountain className={common} strokeWidth={2} />;
  if (n === 'indoor') return <Landmark className={common} strokeWidth={2} />;
  if (n === 'stem') return <FlaskConical className={common} strokeWidth={2} />;
  return <span className="text-[18px] leading-none">📅</span>;
};

export default function ActivityBlock({
  activityName,
  events,
  isAdmin,
  onDelete,
}: Props) {
  const theme = getTheme(activityName);

  // horizontal scroller + arrows state
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  /** recompute arrow availability */
  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  /** listeners for scroll/resize/content-change */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // ensure layout is ready before first compute
    requestAnimationFrame(updateArrows);

    const onScroll = () => updateArrows();
    el.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => updateArrows();
    window.addEventListener('resize', onResize);

    // observe size/content changes safely
    let ro: ResizeObserver | undefined;
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => updateArrows());
      ro.observe(el);
    }

    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro?.disconnect();
    };
  }, [updateArrows, events.length]);

  /** smooth scroll by step (90% of viewport or ≥320px) */
  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.max(320, Math.round(el.clientWidth * 0.9));
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="mb-16">
      {/* --- Minimal header: icon chip + title + thin accent bar --- */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`inline-grid h-12 w-12 place-items-center rounded-xl ring-1 ${theme.chipBg} ${theme.chipRing}`}
            aria-hidden="true"
          >
            <HeaderIcon name={activityName} />
          </span>

          <h2 className={`text-2xl md:text-3xl font-bold ${theme.title}`}>
            {activityName}
          </h2>
        </div>

        {/* thin bar */}
        <div className={`mt-3 h-[4px] w-full rounded-full ${theme.bar}`} />
      </div>

      {/* --- Ribbon with external arrows and snap cards --- */}
      <div className="relative flex items-center gap-4">
        {/* left arrow (desktop) */}
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          disabled={!canLeft}
          aria-label="Scroll left"
          className={`hidden lg:flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-wonderleaf bg-white shadow-2xl transition-all duration-300 ${
            canLeft
              ? 'cursor-pointer opacity-100 hover:scale-110 hover:bg-wonderleaf hover:border-wondergreen'
              : 'cursor-not-allowed opacity-30'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-7 w-7 ${canLeft ? 'text-wondergreen' : 'text-gray-400'}`}
          >
            <path fill="currentColor" d="M15.5 19.5L8 12l7.5-7.5l1.5 1.5L11 12l6 6z" />
          </svg>
        </button>

        {/* scroller */}
        <div
        ref={scrollerRef}
        className="
        flex flex-1 gap-4 overflow-x-auto pb-3
        snap-x snap-mandatory scroll-smooth touch-auto
        scrollbar-thin no-scrollbar
        scrollbar-track-transparent
        scrollbar-thumb-wonderleaf/40 hover:scrollbar-thumb-wonderleaf/60
        "
        style={{ scrollbarGutter: 'stable', WebkitOverflowScrolling: 'touch' }}
      >
        {events.length > 0 ? (
          events.map((event, i) => (
            <div
              key={event.id ?? `${event.name}-${event.date}-${event.startTime}-${i}`}
              className="snap-start w-[300px] sm:w-[320px] lg:w-[340px] flex-shrink-0"
            >
              <EventCard
                event={event}
                isAdmin={isAdmin}
                onDelete={onDelete}
              />
            </div>
          ))
        ) : (
          // <div className="snap-start w-[300px] sm:w-[320px] lg:w-[340px] flex-shrink-0 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          //   <p className="text-lg font-medium text-gray-600">No events scheduled yet</p>
          //   <p className="mt-2 text-sm text-gray-500">
          //     Check back soon for upcoming {activityName.toLowerCase()} events!
          //   </p>
          // </div>
          <div className="snap-start w-[300px] sm:w-[320px] lg:w-[340px] flex-shrink-0 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
            <p className="text-base md:text-lg font-semibold leading-snug text-gray-700">
              Our Spring 2026 program schedule is being finalized.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Create an account to receive updates and early access to registration.
            </p>

            <p className="mt-5 text-sm font-medium text-gray-700">
              Questions? Email us:{" "}
              <a
                href="mailto:info@whproject.org"
                className="text-green-700 underline underline-offset-4 hover:text-green-800"
              >
                info@whproject.org
              </a>
            </p>
          </div>

        )}
        </div>

        {/* right arrow (desktop) */}
        <button
          type="button"
          onClick={() => scrollBy(1)}
          disabled={!canRight}
          aria-label="Scroll right"
          className={`hidden lg:flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-wonderleaf bg-white shadow-2xl transition-all duration-300 ${
            canRight
              ? 'cursor-pointer opacity-100 hover:scale-110 hover:bg-wonderleaf hover:border-wondergreen'
              : 'cursor-not-allowed opacity-30'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-7 w-7 ${canRight ? 'text-wondergreen' : 'text-gray-400'}`}
          >
            <path fill="currentColor" d="M8.5 4.5L16 12l-7.5 7.5l-1.5-1.5L13 12L7 6z" />
          </svg>
        </button>

        {/* mobile hint */}
        {events.length > 1 && (
          <p className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500 animate-pulse lg:hidden">
            👉 Swipe to see more
          </p>
        )}
      </div>
    </section>
  );
}
