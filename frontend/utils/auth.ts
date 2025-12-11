import { Role, User } from "@/types/user";
import { BASE, makeApiRequest } from "./api";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// * Signup ===================================================

export interface SignupPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    avatar?: string;
    address: string
    city: string;
    state: string;
    zipCode: string;
    // children?: ChildPayload[];
    role: Role;
    emailNotificationsEnabled: boolean;
}

export async function handleSignup(payload: SignupPayload) {
  const res = await makeApiRequest<{ token?: string; access_token?: string; user?: User; message?: string }>(
    "/auth/signup",
    { method: "POST", body: payload }
  );

  // const tok = res.access_token || res.token;
  // if (tok) localStorage.setItem("token", tok);

  return res;
}

// * Login  ===================================================

export async function handleLogin(email: string, password: string) {
    const formData = new URLSearchParams({ username: email, password });
    // formData.append("username", email);
    // formData.append("password", password);

    const response = await fetch(`${BASE}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
    });

    const text = await response.text()
    let data: any = {}
    try {
      data = text ? JSON.parse(text) : {};
    } catch { }

    if (!response || !data.access_token) {
      throw new Error(data?.detail || `Login failed (${response.status})`)
    }

    return { access_token: data.access_token }
}

// * Logout ===================================================

export function handleLogout() {
  const router = useRouter()

  localStorage.removeItem("token");
  // console.log("👋 Logged out");
  router.push('/')
}

// GetToken  =================================================
//!Get the token from localStorage (client-side only).

export const TOKEN_KEY = 'token';

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

//! Quick UI check: does a token exist? (not a security check)
export function isLoggedIn(): boolean {
  return !!getToken();
}


// ! Verify Token Helper (for use in layout.tsx)
export function isTokenExpired(token: string): boolean {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// ! Notification ===================================================
export interface NotificationPayload {
  title: string
  description: string
  time: string
}

// ! UserRole =================================================
export function getUserRole():
  | 'admin' | 'parent' | 'instructor' | 'volunteer' | null {
  try {
    const str = localStorage.getItem('user');
    if (str) return JSON.parse(str)?.role ?? null;
    const raw = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (!raw) return null;
    const payload = JSON.parse(atob(raw.split('.')[1] || ''));
    return (payload.role || payload.user?.role) ?? null;
  } catch { return null; }
}
