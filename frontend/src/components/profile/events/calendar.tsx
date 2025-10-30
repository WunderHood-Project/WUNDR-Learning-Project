"use client"

import React, { useMemo, useState } from "react"
import { Views, Calendar, dateFnsLocalizer, type View } from "react-big-calendar"
import { format, getDay, parse, startOfWeek } from "date-fns"
import {enUS} from 'date-fns/locale';
import { EventForCalendar } from "@/types/event"
import "react-big-calendar/lib/css/react-big-calendar.css";
import { combineLocal } from "../../../../utils/formatDate";
import { CalendarEvent } from "@/types/calendar";

//this is necessary for the calendar. calendar needs localizer
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0}),
    getDay,
    locales: { "en-US": enUS }
})

type Props = {
    events: EventForCalendar[]
    onPick: (eventId: string) => void
}

const EventCalendar: React.FC<Props> = ({ events, onPick }) => {
    const [date, setDate] = useState<Date>(new Date())
    const [view, setView] = useState<View>(Views.MONTH)

    const calendarEvents = useMemo<CalendarEvent[]>(() => {
        return (events ?? []).flatMap((e) => {
            if (!e?.id || !e?.name || !e?.date) return []

            const start = combineLocal(e.date, e.startTime)
            const end = combineLocal(e.date, e.endTime)
            return [{ id: e.id, title: e.name, start, end, resource: e }]
        })
    }, [events])

    return (
        <section className="bg-white rounded-2xl shadow-lg border border-wondergreen/10 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-wondersun via-wonderleaf to-wondergreen" />
            <div className="p-4 sm:p-6">
                {/* <h3 className="text-wondergreen font-bold text-base sm:text-lg mb-3">Calendar</h3> */}
                <div className="h-[440px] sm:h-[520px] md:h-[620px]">
                    <Calendar
                        localizer={localizer}
                        defaultView={Views.MONTH}
                        views={{ month: true }}
                        events={calendarEvents}
                        date={date}
                        onNavigate={setDate}
                        view={view}
                        onView={(v) => setView(v)}
                        popup
                        onSelectEvent={(ev: CalendarEvent) => {
                        const id = ev?.resource?.id ?? ev?.id;
                        if (id) onPick(String(id));
                        }}
                    />
                </div>
            </div>
        </section>
  );
}

export default EventCalendar
