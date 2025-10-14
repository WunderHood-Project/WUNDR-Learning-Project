// "use client"
// import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
// import { makeApiRequest } from "../../../utils/api";
// import { User } from "@/types/user";

// type AuthContextType = {
//   user: User | null;
//   token: string | null;
//   isLoggedIn: boolean;
//   setUser: (user: User | null) => void;
//   loginWithToken: (token: string, user?: User) => Promise<void>;
//   logout: () => void;
//   refreshUser: () => Promise<void>
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const isLoggedIn = !!token

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");
//     if (storedToken) setToken(storedToken);
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   //save user
//   useEffect(() => {
//     if (user) localStorage.setItem("user", JSON.stringify(user));
//     else localStorage.removeItem("user");
//   }, [user]);

//   //save token
//   useEffect(() => {
//     if (token) localStorage.setItem("token", token);
//     else localStorage.removeItem("token");
//   }, [token]);

//   const refreshUser = useCallback(async () => {
//     if (!token) return

//     try {
//       const me = await makeApiRequest<User>("http://localhost:8000/user/me", { token })
//       setUser(me)
//     } catch {
//       setToken(null)
//       setUser(null)
//     }
//   }, [token])

//   useEffect(() => {
//     if (token && !user) {
//       void refreshUser()
//     }
//   }, [token, user, refreshUser])

//   const loginWithToken = useCallback(
//     async (token: string, user?: User) => {
//       setToken(token);
//       if (user) {
//         setUser(user);
//       } else {
//         await refreshUser()
//       }
//       // Если backend не возвращает user — можешь декодировать токен и вытянуть инфу о пользователе
//   }, [refreshUser])

//   const logout = useCallback(() => {
//       setUser(null);
//       setToken(null);
//   }, [])

//     return (
//     <AuthContext.Provider value={{ user, setUser, isLoggedIn, logout, loginWithToken, token, refreshUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// }

"use client"
import { User } from "@/types/user";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";


type AuthContextType = {
  user: User | null;
  setUser: (user: User) => void;
  isLoggedIn: boolean;
  logout: () => void;
  loginWithToken: (token: string, user?: User) => void;
  token: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  //save user
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  //save token
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const loginWithToken = (token: string, user?: User) => {
    setToken(token);
    if (user) {
      setUser(user);
    }
    // Если backend не возвращает user — можешь декодировать токен и вытянуть инфу о пользователе
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn: !!user, logout, loginWithToken, token }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
