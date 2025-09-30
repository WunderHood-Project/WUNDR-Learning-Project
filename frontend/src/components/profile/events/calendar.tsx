"use client"

import React, { useMemo, useState } from "react"
import { Views, Calendar, dateFnsLocalizer, type View } from "react-big-calendar"
import { format, getDay, parse, startOfWeek } from "date-fns"
import {enUS} from 'date-fns/locale';
import { EventForCalendar } from "@/types/event"
import "react-big-calendar/lib/css/react-big-calendar.css";
import { combineLocal } from "../../../../utils/formatDate";
import { CalendarEvent } from "@/types/calendar";


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
        <div className="h-[700px]">
            <Calendar
                localizer={localizer}
                defaultView={Views.MONTH}
                views={{month: true, week: false, day: false, agenda: false}}
                events={calendarEvents}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                view={view}
                onView={(v) => setView(v)}
                popup
                onSelectEvent={(ev: CalendarEvent) => {
                    const id = ev?.resource?.id ?? ev?.id
                    if (id && onPick) onPick(String(id))
                }}
            />
        </div>
    )
}

export default EventCalendar
