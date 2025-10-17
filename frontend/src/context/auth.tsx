"use client"
import { User } from "@/types/user";
import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useMemo } from "react";
import { determineEnv, makeApiRequest } from "../../utils/api";


type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  logout: () => void;
  loginWithToken: (token: string, user?: User) => void;
  token: string | null;
  authReady: boolean
  loadingUser: boolean
  userError: string | null
  refetchUser: () => void
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const WONDERHOOD_URL = determineEnv()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [authReady, setAuthReady] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [userError, setUserError] = useState<string | null>(null)
  const didFetch = useRef(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }

    if (storedToken) setToken(storedToken);
    setAuthReady(true)
  }, []);

  //save user
  useEffect(() => {
    user
      ? localStorage.setItem("user", JSON.stringify(user))
      : localStorage.removeItem("user")
  }, [user])

  useEffect(() => {
    token
      ? localStorage.setItem("token", token)
      : localStorage.removeItem("token")
   }, [token])

  const fetchUser = async () => {
    if (!token) {
      setUser(null)
      setUserError(null)
      setLoadingUser(false)
      return
    }
    setLoadingUser(true)
    setUserError(null)

    try {
      const data = await makeApiRequest<User>(`${WONDERHOOD_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}`}
      })
      setUser(data)
    } catch (err) {
      setUser(null)
      setUserError(err instanceof Error ? err.message : "Failed to fetch user")
    } finally {
      setLoadingUser(false)
    }
  }

  useEffect(() => {
    if (!authReady) return
    if (!token) {
      didFetch.current = false
      setUser(null)
      return
    }

    if (didFetch.current) return
    didFetch.current = true
    fetchUser()
  }, [authReady, token])

  const refetchUser = () => {
    didFetch.current = true
    fetchUser()
  }

  const loginWithToken = (token: string, user?: User) => {
    setToken(token);
    if (user) setUser(user)
    // If the backend doesn't return a user, you can decode the token and extract user information.
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const value = useMemo(() => ({
    user, setUser, token,
    isLoggedIn: !!token,
    authReady, loadingUser, userError,
    refetchUser, loginWithToken, logout
  }), [user, token, authReady, loadingUser, userError])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}



// "use client"
// import { User } from "@/types/user";
// import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";


// type AuthContextType = {
//   user: User | null;
//   setUser: (user: User) => void;
//   isLoggedIn: boolean;
//   logout: () => void;
//   loginWithToken: (token: string, user?: User) => void;
//   token: string | null;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");
//     if (storedUser) setUser(JSON.parse(storedUser));
//     if (storedToken) setToken(storedToken);
//   }, []);

//   //save user
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user");
//     }
//   }, [user]);

//   //save token
//   useEffect(() => {
//     if (token) {
//       localStorage.setItem("token", token);
//     } else {
//       localStorage.removeItem("token");
//     }
//   }, [token]);

//   const loginWithToken = (token: string, user?: User) => {
//     setToken(token);
//     if (user) {
//       setUser(user);
//     }
//     // If the backend doesn't return a user, you can decode the token and extract user information.
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, isLoggedIn: !!user, logout, loginWithToken, token }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }
