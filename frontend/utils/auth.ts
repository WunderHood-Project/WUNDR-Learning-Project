import { Role } from "@/types/user";
import { makeApiRequest } from "./api";
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
}

export async function handleSignup(payload: SignupPayload) {
  const response = await makeApiRequest<{
    user: Record<string, any>;
    token: string;
    message: string;
  }>("http://localhost:8000/auth/signup", {
    method: "POST",
    body: payload,
  });

  if (response.token) {
    localStorage.setItem("token", response.token);
    // console.log("✅ Token stored after signup");
  }

  return response;
}

// & Example Body for handleSignup:

// const payload: SignupPayload = {
//   firstName: "Jane",
//   lastName: "Doe",
//   email: "jane.doe@example.com",
//   password: "securePassword123",
//   role: "parent",
//   avatar: "https://example.com/avatar.jpg",
//   city: "Austin",
//   state: "TX",
//   zipCode: 78701,
//   children: [
//     {
//       firstName: "Ella",
//       lastName: "Doe",
//       homeschool: false,
//       birthday: new Date("2015-06-15").toISOString(), // "2015-06-15T00:00:00.000Z",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//     {
//       firstName: "Max",
//       lastName: "Doe",
//       homeschool: true,
//       birthday: new Date("2018-09-22").toISOString(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//   ],
// };

// & Example function call:

// const response = await handleSignup(payload);

// * Login  ===================================================

export async function handleLogin(email: string, password: string) {

    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || "Login Failed");
    }

    if (result.access_token) {
        localStorage.setItem("token", result.access_token);
    }

    return result;
}

// & Example Implementation

// import { handleLogin } from "@/lib/api"; // adjust path as needed

// function SomeComponent() {
//   const loginUser = async () => {
//     try {
//       const result = await handleLogin("user@example.com", "securePassword123");
//       console.log("Logged in!", result);
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   return <button onClick={loginUser}>Login</button>;
// }

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
// * Event ===================================================
// export interface EventPayload {

//   id?: string
//   activityId: string
//   name: string
//   description: string
//   date: string
//   startTime: string
//   endTime: string
//   image: string
//   participants?: number
//   limit: number

//   city: string
//   state: string
//   address: string
//   zipCode: number
//   latitude?: number
//   longitude?: number

//   userId: string[]
//   childIDs: string[]
// }

// * Notification ===================================================
export interface NotificationPayload {
  title: string
  description: string
  time: string
}

// UserRole =================================================
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
