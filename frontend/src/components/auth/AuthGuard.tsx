"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/auth";
import { isTokenExpired } from "../../../utils/auth";

export default function AuthGuard() {
  const { logout } = useAuth();
  const logoutRef = useRef(logout);

  // Keep ref up to date with the latest logout function without re-running the interval effect
  useEffect(() => {
    logoutRef.current = logout;
  });

  useEffect(() => {
    function checkToken() {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        logoutRef.current();
      }
    }

    checkToken();
    const interval = setInterval(checkToken, 60 * 1000); // check every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return null;
}