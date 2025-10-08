"use client"

import { Activity } from "@/types/activity"
import { useEffect, useState } from "react"
import { determineEnv, makeApiRequest } from "../utils/api"


const WONDERHOOD_URL = determineEnv()
type Activities = {activities: Activity[]}

export const useActivity = () => {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchActivities = async () => {
        try {
            setLoading(true)
            setError(null)

            const data: Activities = await makeApiRequest(`${WONDERHOOD_URL}/activity`)
            setActivities(data.activities ?? [])
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to fetch activities")
            setActivities([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchActivities()
    }, [])

    const refetch = () => fetchActivities()

    return { activities, loading, error, refetch }
}
