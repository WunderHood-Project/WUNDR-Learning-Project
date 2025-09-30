import { EventForCalendar } from "./event"

export type CalendarEvent = {
    id: string
    title: string
    resource: EventForCalendar
    start: Date
    end: Date
}
