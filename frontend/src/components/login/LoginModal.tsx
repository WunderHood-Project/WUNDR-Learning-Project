'use client';

import { useModal } from "@/app/context/modal";
import { useAuth } from "@/app/context/auth";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams, } from "next/navigation";
import { setToken } from '../../../utils/auth';
import { determineEnv } from "../../../utils/api";

const WONDERHOOD_URL = determineEnv()


// Eye icon SVGs
const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
);


const LoginModal = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // "Forgot password" form states
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

    // Show/hide password in field
    const [showPassword, setShowPassword] = useState(false);

    // Get modal and auth actions
    const { closeModal } = useModal();
    const { loginWithToken } = useAuth();


    // Validate email format (returns true/false)
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Check email every time it changes, show error if invalid
    useEffect(() => {
        const newErrors: { [key: string]: string } = {};
        if (email && !validateEmail(email)) newErrors.email = "Please provide a valid email address";
        setErrors(newErrors);
    }, [email]);

    // Handle input changes (email & password), remove error if fixed
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
        setServerError(null);
    };

    // Handle submit for "Forgot Password" form
    const handleForgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!forgotPasswordEmail || !validateEmail(forgotPasswordEmail)) {
            setForgotPasswordMessage("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        setForgotPasswordMessage(null);

        try {
            const res = await fetch(`${WONDERHOOD_URL}/password_reset/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotPasswordEmail })
            });

            const data = await res.json();

            if (res.ok) {
                setForgotPasswordMessage("Password reset instructions have been sent to your email. Please check your inbox and copy the reset token.");
            } else {
                if (res.status === 404) {
                    setForgotPasswordMessage("No account found with this email address.");
                } else if (res.status === 500) {
                    setForgotPasswordMessage("Failed to send reset email. Please try again later.");
                } else {
                    setForgotPasswordMessage(data?.detail || "Failed to send reset email. Please try again.");
                }
            }
        } catch (err) {
            console.error("Forgot password error:", err);
            setForgotPasswordMessage("Network error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Compute safeNext: prefer `next` param; otherwise current path and keep #apply when on /volunteer
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const nextParam = searchParams.get('next');
    const isVolunteer = (pathname || '').toLowerCase().includes('/volunteer');

    const safeNext =
        nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
            ? nextParam
            : `${pathname || '/'}${isVolunteer ? '#apply' : ''}`;

    useEffect(() => {
        if (pathname.startsWith("/reset-password")) {
            router.replace("/");
        }
    }, [pathname, router]);

    // Handle submit for main login form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});
        setServerError(null);
        setIsLoading(true);

        // Client-side validation
        const newErrors: { [key: string]: string } = {};

        if (!email) newErrors.email = "Email is required";
        else if (!validateEmail(email)) newErrors.email = "Please provide a valid email address";

        if (!password) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        try {
            const res = await fetch(`${WONDERHOOD_URL}/auth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString()
            });

            let data;
            try {
                data = await res.json();
            } catch {
                data = {};
            }

            if (!res.ok) {
                // Handle different error scenarios
                if (res.status === 401) {
                    setServerError("Invalid email or password. Please check your credentials and try again.");
                } else if (res.status === 422) {
                    setServerError("Please check your email format and try again.");
                } else if (res.status >= 500) {
                    setServerError("Server error. Please try again later.");
                } else {
                    setServerError(data?.detail || data?.message || "Login failed. Please try again.");
                }
                setIsLoading(false);
                return;
            }

            const token = data.access_token;

            if (!token) {
                setServerError("Login failed. Please try again.");
                setIsLoading(false);
                return;
            }

            // Get user profile
            const userRes = await fetch(`${WONDERHOOD_URL}/auth/users/me`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!userRes.ok) {
                setServerError("Failed to retrieve user information. Please try again.");
                setIsLoading(false);
                return;
            }

            const user = await userRes.json();

            // Update context
            setToken(token);
            loginWithToken(token, user);
            closeModal();
            router.replace(safeNext); //redirect back
        } catch (err) {
            console.error("Login error:", err);
            setServerError("Network error occurred. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // If showForgotPassword=true, show "Forgot Password" form modal
    if (showForgotPassword) {
        return (
            <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                    <form onSubmit={handleForgotPasswordSubmit} className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-green-600 w-full text-center">Reset Password</h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-600 text-sm mb-4">
                                Enter your email address and we&apos;ll send you instructions to reset your password.
                            </p>

                            <input
                                type="email"
                                name="forgotPasswordEmail"
                                placeholder="Enter your email address"
                                value={forgotPasswordEmail}
                                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                                autoFocus
                            />

                            {forgotPasswordMessage && (
                                <div className={`p-3 rounded-lg text-sm ${forgotPasswordMessage.includes('sent')
                                    ? 'bg-green-50 border border-green-200 text-green-700'
                                    : 'bg-red-50 border border-red-200 text-red-700'
                                    }`}>
                                    {forgotPasswordMessage}
                                </div>
                            )}

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setForgotPasswordMessage(null);
                                        setForgotPasswordEmail("");
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                    disabled={isLoading}
                                >
                                    Back to Login
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !forgotPasswordEmail}
                                    className="flex-1 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    {isLoading ? "Sending..." : "Send Reset Email"}
                                </button>
                            </div>

                            {/* Link to reset password form */}
                            <div className="text-center pt-4">
                                <p className="text-sm text-gray-600">
                                    Already have a reset token?{" "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForgotPassword(false);
                                            // setShowResetPassword(true);
                                        }}
                                        className="text-green-600 hover:text-green-700 font-medium transition-colors"
                                    >
                                        Enter it here
                                    </button>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-green-600 w-full text-center">Welcome Back</h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                        >
                            ×
                        </button>
                    </div>

                    {/* Error Message */}
                    {serverError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {serverError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-800 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter your email"
                                required
                                autoFocus
                                maxLength={100}
                            />
                            {errors.email && (
                                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={handleChange}
                                    className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-gray-800 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Enter your password"
                                    required
                                    minLength={6}
                                    maxLength={32}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>


                            {errors.password && (
                                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-sm text-green-600 hover:text-green-700 transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email || !password || !!errors.email || !!errors.password}
                            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>

                        <div className="text-center text-sm text-gray-600 mt-4">
                            Don&apos;t have an account?{" "}
                            <button
                                type="button"
                                onClick={() => {
                                    console.log("Switch to signup modal");
                                }}
                                className="text-green-600 hover:text-green-700 font-medium transition-colors"
                            >
                                Sign up here
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
