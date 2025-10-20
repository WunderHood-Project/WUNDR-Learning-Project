import { useAuth } from "@/context/auth"

export const useUser = () => {
    const { user, loadingUser: loading, userError: error, refetchUser: refetch } = useAuth()
    return { user, loading, error, refetch }
}
