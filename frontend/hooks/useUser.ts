import { useEffect, useState } from "react"
import { User } from "@/types/user"
import { makeApiRequest } from "../utils/api"
import { determineEnv } from "../utils/api"

const WONDERHOOD_URL = determineEnv()

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchUser = async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await makeApiRequest<User>(`${WONDERHOOD_URL}/user/me`)
            setUser(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch user")
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    const refetch = () => {
        setLoading(true)
        setError(null)
        fetchUser()
    }

    return { user, loading, error, refetch }
}
