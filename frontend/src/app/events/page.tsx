import { Suspense } from "react";
import EventsPageContent from "@/components/eventsPage/EventsPageContent";

export default function EventsPage() {
  return (
    <Suspense>
      <EventsPageContent />
    </Suspense>
  );
}
