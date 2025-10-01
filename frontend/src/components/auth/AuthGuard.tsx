"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isTokenExpired } from "../../../utils/auth";

export default function AuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // if (!token) return;

    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/");
    }
  }, [router]);

  return null;
}
