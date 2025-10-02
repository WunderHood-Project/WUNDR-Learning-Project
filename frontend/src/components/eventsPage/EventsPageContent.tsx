"use client";

import { useEffect, useState } from "react";
import ActivityBlock from "@/components/eventsPage/ActivityBlock";
import { makeApiRequest } from "../../../utils/api";
import { Activity } from "@/types/activity";
import { Event } from "@/types/event";
import Link from "next/link";
import { determineEnv } from "../../../utils/api";

const WONDERHOOD_URL = determineEnv()

console.log("LALAL", WONDERHOOD_URL)

interface GroupedEvents {
  activity: string;
  events: Event[];
}

export default function EventsPageContent() {
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setIsAdmin(userObj.role === "admin");
    }
  }, []);

  useEffect(() => {
    const fetchActivitiesWithEvents = async () => {
      try {
        const { activities } = await makeApiRequest<{ activities: Activity[] }>(
          `${WONDERHOOD_URL}/activity/with-events`
        );

        const formatted: GroupedEvents[] = activities.map((activity) => ({
          activity: activity.name,
          events: activity.events ?? [],
        }));

        setGroupedEvents(formatted);
      } catch (err) {
        console.error("Failed to fetch activities with events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivitiesWithEvents();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-green-700">Loading events...</div>
    );
  }

  return (
    <main className="px-6 py-8 max-w-5xl md:max-w-7xl mx-auto bg-wonderbg min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-green-800">
          Upcoming Events
        </h1>
        <p className="text-green-700 max-w-2xl mx-auto text-lg">
          Connect with other homeschooling families through hands-on
          experiences, outdoor adventures, and educational opportunities.
        </p>
        {isAdmin && (
          <div className="flex flex-col items-center justify-center mt-6">
            <Link href={"/events/addEvent"}>
              <button className="mt-2 bg-green-700 text-white px-10 py-2 rounded text-sm font-medium hover:bg-green-800 transition-colors">
                <strong>ADD EVENT</strong>
              </button>
            </Link>
          </div>
        )}
      </div>

      {groupedEvents.map(({ activity, events }) => (
        <ActivityBlock
          key={activity}
          activityName={activity}
          events={events}
          isAdmin={isAdmin}
        />
      ))}
    </main>
  );
}
