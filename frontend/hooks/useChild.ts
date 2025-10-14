import { useEffect, useState } from "react";
import { determineEnv, makeApiRequest } from "../utils/api";
import { Child } from "@/types/child";


const WONDERHOOD_URL = determineEnv()

export function useChild(childId: string | string[] | undefined) {
  const [child, setChild] = useState<Child | null>(null)
  const [children, setChildren] = useState<Child[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      if (childId && !Array.isArray(childId)) {
          const childData = await makeApiRequest<Child>(
          `${WONDERHOOD_URL}/child/${childId}/`,
          { method: "GET" }
          )
          setChild(childData)
          setChildren(null)
      } else if (!childId) {
        const childrenData = await makeApiRequest<Child[]>(
          `${WONDERHOOD_URL}/child/current`,
          { method: "GET"}
        )
        setChildren(childrenData)
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
  }

  useEffect(() => {
      fetchData()
  }, [childId])

  const refetch = () => {
      fetchData()
  }

  return { child, children, loading, error, refetch }
}
