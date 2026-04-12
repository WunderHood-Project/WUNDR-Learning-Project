"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ActivityBlock from "@/components/eventsPage/ActivityBlock";
import { determineEnv, makeApiRequest } from "../../../utils/api";
import { Activity } from "@/types/activity";
import { Event } from "@/types/event";
import type { EnrichmentProgram } from "@/types/program";
import Link from "next/link";
import { useUser } from "../../../hooks/useUser";
import GradientBanner from '@/components/ui/GradientBanner';
import { BeatLoader } from "react-spinners"

const WONDERHOOD_URL = determineEnv()

interface GroupedActivity {
  activityId: string;
  activityName: string;
  events: Event[];
  programs: EnrichmentProgram[];
}

export default function EventsPageContent() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [grouped, setGrouped] = useState<GroupedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'event') setToast('Event submitted successfully for Admin approval!');
    if (success === 'program') setToast('Enrichment Program submitted successfully for Admin approval!');
    if (success) {
      router.replace('/events', { scroll: false });
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);
  const isAdmin: boolean = user?.role === "admin"
  const canAddEvent: boolean = user?.role === "admin" || user?.role === "partner"

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [{ activities }, { programs }] = await Promise.all([
          makeApiRequest<{ activities: Activity[] }>(`${WONDERHOOD_URL}/activity/with-events`),
          makeApiRequest<{ programs: EnrichmentProgram[] }>(`${WONDERHOOD_URL}/program`),
        ]);

        const formatted: GroupedActivity[] = activities.map((activity) => ({
          activityId: activity.id,
          activityName: activity.name,
          events: (activity.events ?? []).filter((e) => e.status === "approved"),
          programs: programs.filter((p) => p.activityId === activity.id),
        }));

        // Ensure Events section appears first, Programs second
        formatted.sort((a, b) => {
          const nameA = a.activityName.toLowerCase();
          const nameB = b.activityName.toLowerCase();

          if (nameA.includes("event")) return -1;
          if (nameB.includes("event")) return 1;

          if (nameA.includes("program")) return 1;
          if (nameB.includes("program")) return -1;

          return 0;
        });

        setGrouped(formatted);
      } catch (err) {
        console.error("Failed to fetch activities / programs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleDeleteEvent = (deletedId: string) => {
    setGrouped(prev =>
      prev.map((group) => ({
        ...group,
        events: group.events.filter(e => e.id !== deletedId),
      }))
    );
  };

  const handleDeleteProgram = (deletedId: string) => {
    setGrouped(prev =>
      prev.map((group) => ({
        ...group,
        programs: group.programs.filter(p => p.id !== deletedId),
      }))
    );
  };

  if (loading) return <div className="text-center py-20 text-green-700"><BeatLoader color="#90b35c" size={15} /></div>

  return (
    <main className="min-h-screen bg-gradient-to-br from-wonderbg via-white to-wondersun/20">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl bg-wondergreen px-6 py-3 text-white shadow-lg animate-fade-in">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-semibold">{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-white/70 hover:text-white text-lg leading-none">×</button>
        </div>
      )}
      <GradientBanner
        size="md"
        title="Upcoming Events"
        subtitle="Connect with other homeschooling families through hands-on
          experiences, outdoor adventures, and educational opportunities."
      />
      <div className="mx-auto max-w-7xl px-1.5 sm:px-6">
        <div className="text-center mb-12">
          {canAddEvent && (
            <div className="flex flex-col items-center justify-center mt-6">
              <Link href={"/events/addEvent"} className="mt-2 bg-green-700 text-white px-10 py-2 rounded text-sm font-medium hover:bg-green-800 transition-colors">
                <strong>ADD EVENT/ENRICHMENT PROGRAM</strong>
              </Link>
            </div>
          )}
        </div>

        {grouped.map(({ activityId, activityName, events, programs }) => (
          <ActivityBlock
            key={activityId}
            activityName={activityName}
            events={events}
            programs={programs}
            isAdmin={isAdmin}
            onDeleteEvent={handleDeleteEvent}
            onDeleteProgram={handleDeleteProgram}
          />
        ))}
      </div>
    </main>
  );
}
