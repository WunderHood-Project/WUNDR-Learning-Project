'use client';
import { User } from "@/types/user";
import React, {
  createContext, useContext, useState, ReactNode,
  useEffect, useMemo, useCallback
} from "react";
import { determineEnv, makeApiRequest } from "../../utils/api";

/**
 * Shape of the authentication context that the app can consume.
 * Keeping this explicit helps with autocomplete and refactors.
 */
type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  logout: () => void;
  loginWithToken: (token: string, user?: User) => void;
  token: string | null;
  authReady: boolean;      // true once we've read persisted auth (localStorage)
  loadingUser: boolean;    // true while /user/me is being fetched
  userError: string | null;// error message from the last /user/me attempt
  refetchUser: () => void; // manual refresh of the current profile
};

/**
 * Context is created as possibly undefined so useAuth() can guard against
 * using it outside of <AuthProvider>.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const WONDERHOOD_URL = determineEnv();

/**
 * Top-level provider that owns auth state and exposes it via context.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Core auth state
  const [user, setUser]         = useState<User | null>(null);
  const [token, setToken]       = useState<string | null>(null);

  // Status flags
  const [authReady, setAuthReady]     = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError]     = useState<string | null>(null);

  /**
   * 1) On first mount, restore auth from localStorage and mark that
   *    the initial auth check has completed (authReady = true).
   *    Any JSON parse errors are ignored deliberately.
   */
  useEffect(() => {
    try {
      const storedUser  = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser)  setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
    } catch { /* ignore corrupted storage */ }
    setAuthReady(true);
  }, []);

  /**
   * 2) Persist user and token changes back to localStorage.
   *    (If you later move to cookies/HttpOnly tokens, remove this.)
   */
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else      localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else       localStorage.removeItem("token");
  }, [token]);

  /**
   * 3) Fetch the full profile for the current token.
   *    This is wrapped in useCallback so effects can depend on a stable ref.
   */
  const fetchUser = useCallback(async () => {
    if (!token) return;                // no token -> nothing to fetch
    setLoadingUser(true);
    setUserError(null);
    try {
      const data = await makeApiRequest<User>(`${WONDERHOOD_URL}/auth/users/me`, {
          headers: { Authorization: `Bearer ${token}`}
      })
      setUser(data)
    } catch (err) {
      setUser(null);
      setUserError(err instanceof Error ? err.message : "Failed to fetch user");
    } finally {
      setLoadingUser(false);
    }
  }, [token]);

  /**
   * 4) When initial auth has been read (authReady) and we have a token,
   *    fetch the latest profile. If there's no token, clear user state.
   *    This makes the UI briefly show "logged out" during hard reloads,
   *    until the token is restored and /user/me resolves.
   */
  useEffect(() => {
    if (!authReady) return;        // wait until localStorage was checked
    if (!token) {
      setUser(null);
      setUserError(null);
      setLoadingUser(false);
      return;
    }
    fetchUser();
  }, [authReady, token, fetchUser]);

  /**
   * 5) Helper actions exposed to the app.
   */
  const refetchUser = useCallback(() => {
    if (!token) return;
    fetchUser();
  }, [fetchUser, token]);

  /**
   * Store token and optionally set a preliminary user object
   * to render the UI immediately; the effect above will then
   * fetch the authoritative profile from the backend.
   */
  const loginWithToken = (newToken: string, initialUser?: User) => {
    setToken(newToken);
    if (initialUser) setUser(initialUser);
  };

  /**
   * Clear all client auth and send the user to the home page.
   * (If you add a server-side session later, also call a logout API.)
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  /**
   * Memoize the context value to avoid unnecessary re-renders.
   */
  const value = useMemo(
    () => ({
      user,
      setUser,
      token,
      isLoggedIn: Boolean(token),
      authReady,
      loadingUser,
      userError,
      refetchUser,
      loginWithToken,
      logout,
    }),
    [user, token, authReady, loadingUser, userError, refetchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to consume the auth context. Throws if used outside <AuthProvider>,
 * which helps catch wiring mistakes early.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}



// "use client"
// import { User } from "@/types/user";
// import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useMemo, useCallback } from "react";
// import { determineEnv, makeApiRequest } from "../../utils/api";


// type AuthContextType = {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   isLoggedIn: boolean;
//   logout: () => void;
//   loginWithToken: (token: string, user?: User) => void;
//   token: string | null;
//   authReady: boolean
//   loadingUser: boolean
//   userError: string | null
//   refetchUser: () => void
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const WONDERHOOD_URL = determineEnv()

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [authReady, setAuthReady] = useState(false)
//   const [loadingUser, setLoadingUser] = useState(false)
//   const [userError, setUserError] = useState<string | null>(null)
//   const didFetch = useRef(false)

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedToken = localStorage.getItem("token");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch {}
//     }

//     if (storedToken) setToken(storedToken);
//     setAuthReady(true)
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

//   const fetchUser = useCallback(async () => {
//     if (!token) {
//       setUser(null)
//       setUserError(null)
//       setLoadingUser(false)
//       return
//     }
//     setLoadingUser(true)
//     setUserError(null)

//     try {
//       const data = await makeApiRequest<User>(`${WONDERHOOD_URL}/user/me`, {
//           headers: { Authorization: `Bearer ${token}`}
//       })
//       setUser(data)
//     } catch (err) {
//       setUser(null)
//       setUserError(err instanceof Error ? err.message : "Failed to fetch user")
//     } finally {
//       setLoadingUser(false)
//     }
//   }, [token])

//   useEffect(() => {
//     if (!authReady) return
//     if (!token) {
//       didFetch.current = false
//       setUser(null)
//       return
//     }

//     if (didFetch.current) return
//     didFetch.current = true
//     fetchUser()
//   }, [authReady, token, fetchUser])

//   const refetchUser = useCallback(() => {
//     didFetch.current = true
//     fetchUser()
//   }, [fetchUser])

//   const loginWithToken = (token: string, user?: User) => {
//     setToken(token);
//     if (user) setUser(user)
//     // If the backend doesn't return a user, you can decode the token and extract user information.
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     window.location.href = "/";
//   };

//   const value = useMemo(() => ({
//     user, setUser, token,
//     isLoggedIn: !!token,
//     authReady, loadingUser, userError,
//     refetchUser, loginWithToken, logout
//   }), [user, token, authReady, loadingUser, userError, refetchUser])

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }



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
