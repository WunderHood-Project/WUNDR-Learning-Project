import { useCallback, useEffect, useState } from "react";
import { determineEnv, makeApiRequest } from "../utils/api";
import { Child } from "@/types/child";
import { useAuth } from "@/context/auth";


const WONDERHOOD_URL = determineEnv()

export function useChild(childId: string | string[] | undefined) {
  const { token, authReady } = useAuth()
  const [child, setChild] = useState<Child | null>(null)
  const [children, setChildren] = useState<Child[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!token) {
      setChild(null)
      setChildren(null)
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      if (childId && !Array.isArray(childId)) {
          const childData = await makeApiRequest<Child>(`${WONDERHOOD_URL}/child/${childId}`, {token})
          setChild(childData)
          setChildren(null)
      } else if (!childId) {
        const childrenData = await makeApiRequest<Child[]>(`${WONDERHOOD_URL}/child/current`, {token})
        setChildren(childrenData ?? [])
        setChild(null)
      } else {
        setError("Invalid event id")
        setChild(null)
        setChildren(null)
      }

    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch event")
        setChild(null)
        setChildren(null)
    } finally {
        setLoading(false)
    }
  }, [childId, token])

  useEffect(() => {
      if (!authReady) return
      fetchData()
  }, [authReady, fetchData])

  const refetch = () => {
      fetchData()
  }

  return { child, children, loading, error, refetch }
}
