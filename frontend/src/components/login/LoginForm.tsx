'use client';
import React, { useState } from "react";
import ModalHeader from "./ModalHeader";
import Alert from "./Alert";
import PasswordField from "./PasswordField";
import { useAuth } from "@/context/auth";
import { useModal } from "@/context/modal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BASE } from "../../../utils/api";
import { handleLogin, setToken } from "../../../utils/auth";
import { errorMessage } from "../../../utils/errorHelpers";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type LoginErrors = Partial<Record<'email' | 'password', string>>;

export default function LoginForm({ onForgot }:{ onForgot: ()=>void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [errors, setErrors] = useState<{email?:string; password?:string}>({});
    const [errors, setErrors] = useState<LoginErrors>({});
    const [serverError, setServerError] = useState<string|null>(null);
    const [loading, setLoading] = useState(false);

    const { loginWithToken } = useAuth();
    const { closeModal } = useModal();
    const router = useRouter();
    const pathname = usePathname() || "/";
    const params = useSearchParams();
     // Preserve redirect target if provided via ?next=
    const nextParam = params.get("next");
    const isVolunteer = pathname.toLowerCase().includes("/volunteer");
    const safeNext = (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//"))
    ? nextParam
    : `${pathname}${isVolunteer ? "#apply" : ""}`;

    // Client-side validation
    function validate() {
        const e: LoginErrors = {};
        if (!email) e.email = "Email is required";
        else if (!isEmail(email)) e.email = "Please provide a valid email address";
        if (!password) e.password = "Password is required";
        else if (password.length < 6) e.password = "Password must be at least 6 characters";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setServerError(null);
        if (!validate()) return;

        setLoading(true);
        try {
        // 1) login — your helper stores the token in localStorage
        const res = await handleLogin(email, password); // saved token
        const token = res?.access_token || localStorage.getItem("token");
        if (!token) throw new Error("Login failed. Please try again.");

        // 2) fetch user profile
        const meRes = await fetch(`${BASE}/auth/users/me`, { headers: { Authorization: `Bearer ${token}` }});
        if (!meRes.ok) throw new Error("Failed to retrieve user information.");
        const user = await meRes.json();

        // 3) update auth context and redirect
        // setToken(token);
        loginWithToken(token, user);
        closeModal();
        router.replace(safeNext);
        } catch (err:unknown) {
            setServerError(errorMessage(err) || "Login failed. Please try again.");
        } finally { setLoading(false); }
    }


// 'use client';
// import React, { useState } from "react";
// import ModalHeader from "./ModalHeader";
// import Alert from "./Alert";
// import PasswordField from "./PasswordField";
// import { useAuth } from "@/context/auth";
// import { useModal } from "@/context/modal";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { BASE, determineEnv, makeApiRequest } from "../../../utils/api";
// import { handleLogin, setToken } from "../../../utils/auth";
// import { errorMessage } from "../../../utils/errorHelpers";
// import { User } from "@/types/user";

// const WONDERHOOD_URL = determineEnv()
// const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// type LoginErrors = Partial<Record<'email' | 'password', string>>;

// export default function LoginForm({ onForgot }:{ onForgot: ()=>void }) {
//     const { loginWithToken, authReady, isLoggedIn } = useAuth()
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     // const [errors, setErrors] = useState<{email?:string; password?:string}>({});
//     const [errors, setErrors] = useState<LoginErrors>({});
//     const [serverError, setServerError] = useState<string|null>(null);
//     const [loading, setLoading] = useState(false);

//     const { closeModal } = useModal();
//     const router = useRouter();
//     const pathname = usePathname() || "/";
//     const params = useSearchParams();
//      // Preserve redirect target if provided via ?next=
//     const nextParam = params.get("next");
//     const isVolunteer = pathname.toLowerCase().includes("/volunteer");
//     const safeNext = (nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//"))
//         ? nextParam
//         : `${pathname}${isVolunteer ? "#apply" : ""}`;

//     // Client-side validation
//     function validate() {
//         const e: LoginErrors = {};
//         if (!email) e.email = "Email is required";
//         else if (!isEmail(email)) e.email = "Please provide a valid email address";
//         if (!password) e.password = "Password is required";
//         else if (password.length < 6) e.password = "Password must be at least 6 characters";
//         setErrors(e);
//         return Object.keys(e).length === 0;
//     }

//     async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
//         e.preventDefault();
//         setServerError(null);
//         if (!validate()) return;

//         setLoading(true);
//         try {
//             // 1) calls backend to get token
//             const { access_token } = await handleLogin(email, password)
//             if (!access_token) {
//                 throw new Error("Login failed. Please try again.")
//             }

//             //2) tell authcontext about the call
//             loginWithToken(access_token)
//             // const res = await handleLogin(email, password); // saved token
//             // const token = res?.access_token || localStorage.getItem("token");
//             // if (!token) throw new Error("Login failed. Please try again.");

//             // 2) fetch user profile
//             // const meRes = await fetch(`${BASE}/auth/users/me`, { headers: { Authorization: `Bearer ${token}` }});
//             // const res = await makeApiRequest<{ access_token?: string; token?: string}>(`${WONDERHOOD_URL}/auth/login`,
//             //     {}
//             // );
//             // setUser(meRes)
//             // if (!meRes.ok) throw new Error("Failed to retrieve user information.");
//             // const user = await meRes.json();

//             // 3) update auth context and redirect
//             // setToken(token);
//             // loginWithToken(token, user);
//             setEmail("")
//             setPassword("")
//             closeModal();
//             router.replace(safeNext);
//         } catch (err:unknown) {
//             setServerError(errorMessage(err) || "Login failed. Please try again.");
//         } finally { setLoading(false); }
//     }

//     if (!authReady) return null

//     if (isLoggedIn) {
//         closeModal()
//         router.replace(safeNext)
//         return null
//     }


    return (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-auto">
                <form onSubmit={onSubmit} className="p-6 sm:p-8">
                    <ModalHeader title="Welcome Back" onClose={closeModal} />

                    {serverError && <Alert kind="error" className="mb-5">{serverError}</Alert>}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={e=>{ setEmail(e.target.value); if (errors.email) setErrors(p=>({...p,email:undefined})); }}
                            className={`
                                w-full px-4 py-3.5 rounded-2xl bg-white
                                text-gray-900 placeholder-gray-400 text-base
                                border-2 ${errors.email ? 'border-red-500' : 'border-green-600'}
                                outline-none focus:outline-none
                                focus:ring-2 focus:ring-green-600 focus:border-transparent
                                transition-all duration-200
                            `}
                            placeholder="Enter your email"
                            required
                            maxLength={100}
                            autoFocus
                            />
                            {errors.email && <div className="text-red-500 text-sm mt-2">{errors.email}</div>}
                        </div>

                        <PasswordField
                        label="Password"
                        name="password"
                        value={password}
                        onChange={e=>{ const v=(e.target as HTMLInputElement).value; setPassword(v); if (errors.password) setErrors(p=>({...p,password:undefined})); }}
                        minLength={6}
                        maxLength={32}
                        placeholder="Enter your password"
                        error={errors.password}
                        required
                        />

                        <div className="flex justify-end pt-1">
                            <button type="button" onClick={onForgot} className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                                Forgot password?
                            </button>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="
                            w-full bg-green-600 text-white
                            px-6 py-3.5 rounded-2xl
                            hover:bg-green-700
                            font-semibold text-base
                            transition-all duration-200
                            active:translate-y-0.5
                            disabled:opacity-50 disabled:cursor-not-allowed
                          "
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>

                        <div className="text-center text-sm text-gray-600 pt-2">
                            Don&apos;t have an account?{" "}
                            <button type="button" onClick={()=>console.log("Switch to signup modal")} className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                                Sign up here
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
