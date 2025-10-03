import { useState, useEffect } from "react"
import { makeApiRequest } from "../utils/api"
import { Event } from "@/types/event"
import { determineEnv } from "../utils/api"

const WONDERHOOD_URL = determineEnv()

export function useEvent(eventId: string | string[] | undefined) {
  const [event, setEvent] = useState<Event | null>(null)
  const [events, setEvents] = useState<Event[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      if (eventId && !Array.isArray(eventId)) {
          const eventData = await makeApiRequest<Event>(
          `${WONDERHOOD_URL}/event/${eventId}/`,
          { method: "GET" }
          )
          setEvent(eventData)
          setEvents(null)
      } else if (!eventId) {
        const eventsData = await makeApiRequest<{ events: Event[] }>(
          `${WONDERHOOD_URL}/event`,
          { method: "GET"}
        )
        setEvents(eventsData.events)
        setEvent(null)
      } else {
        setError("Invalid event ID")
        setEvent(null)
        setEvents(null)
      }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch event")
        setEvent(null)
        setEvents(null)
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
        fetchData()
    }, [eventId])

  const refetch = () => {
      fetchData()
  }

  return { event, events, loading, error, refetch }
}
