export type Event = {
    id?: string
    activityId: string

    name: string
    description: string
    date: string
    startTime: string
    endTime: string
    image: string
    participants?: number
    limit: number

    city: string
    state: string
    address: string
    zipCode: string
    latitude: number | null
    longitude: number | null

    userId: string[]
    childIDs: string[]
}

export type EventForm = Pick<Event, "activityId" | "name" | "description" | "date" | "startTime" | "participants"
    | "endTime" | "image" | "limit" | "city" | "state" | "address" | "zipCode" | "latitude" | "longitude"
>

export type EventFormErrors = Partial<Record<keyof EventForm, string>>
export type EventForCalendar = Omit<Event, "activityId" | "image" | "participants" | "limit" | "state" | "address" | "zipCode" | "latitude" | "longitude" | "userId">
