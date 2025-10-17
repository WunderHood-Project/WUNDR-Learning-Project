// import { useEffect, useState } from "react"
// import { User } from "@/types/user"
// import { makeApiRequest } from "../utils/api"
// import { determineEnv } from "../utils/api"
import { useAuth } from "@/context/auth"

// const WONDERHOOD_URL = determineEnv()

export const useUser = () => {
    const { user, loadingUser: loading, userError: error, refetchUser: refetch } = useAuth()
    return { user, loading, error, refetch }
}

// export const useUser = () => {
//     const { token, authReady, setUser: setContextUser } = useAuth()
//     const [user, setUser] = useState<User | null>(null)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string | null>(null)

//     const fetchUser = async () => {
//         try {
//             setError(null)

//             if (!authReady) {
//                 setLoading(true)
//                 return
//             }

//             if (!token) {
//                 setUser(null)
//                 setContextUser(null)
//                 setLoading(false)
//                 return
//             }

//             const data = await makeApiRequest<User>(`${WONDERHOOD_URL}/user/me`, {
//                 headers: { Authorization: `Bearer ${token}`}
//             })
//             setUser(data)
//             setContextUser(data)
//         } catch (err) {
//             setUser(null)
//             setContextUser(null)
//             setError(err instanceof Error ? err.message : "Failed to fetch user")
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchUser()
//     }, [authReady, token])

//     const refetch = () => {
//         setLoading(true)
//         setError(null)
//         fetchUser()
//     }

//     return { user, loading, error, refetch }
// }
