export type EventSchoolAccess =
  | "all"
  | "homeschool_only"
  | "public_custer_only"
  | "private_custer_only";

export type EventLabel = "wonderhood" | "partner";

export type EventStatus = "pending" | "approved" | "rejected";


export type Event = {
    id?: string
    activityId: string

    name: string
    description: string
    notes?: string | null
    date: string
    startTime: string | null
    endTime: string | null
    image: string
    participants?: number
    limit: number | null
    schoolAccess: EventSchoolAccess
    label: EventLabel

    city: string
    state: string
    address: string
    zipCode: string
    latitude: number | null
    longitude: number | null

    userId: string[]
    childIds: string[]
    status?: EventStatus
}

type ServerManaged = "id" | "participants" | "userId" | "childIds"
type EventMutable = Omit<Event, ServerManaged>
export type CreateEventPayload = EventMutable
export type UpdateEventPayload = Partial<EventMutable>
export type EventFormErrors = Partial<Record<keyof EventMutable, string>>

export type EventForCalendar = Omit<Event, "activityId" | "image" | "participants" | "limit" | "state" | "address" | "zipCode" | "latitude" | "longitude" | "userId">
