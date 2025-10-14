'use client';
import React, { useState } from "react";
import ModalHeader from "./ModalHeader";
import Alert from "./Alert";
import { makeApiRequest, BASE } from "../../../utils/api";
import { useModal } from "@/app/context/modal";
import { errorMessage } from "../../../utils/errorHelpers"; 

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { closeModal } = useModal();

  // Submit handler for the "Forgot Password" form
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // 1. Basic email validation
    if (!isEmail(email)) {
      setMsg("Please enter a valid email address");
      return;
    }

    // 2. Reset message + start loading state
    setMsg(null);
    setLoading(true);

    try {
      // 3. Send request to backend (no auth required)
      const data = await makeApiRequest<{ message?: string; token?: string }>(
        `${BASE}/password_reset/forgot-password`,
        {
          method: "POST",
          body: { email },
          token: "",
        }
      );

      // 4. Display success message
      // (in DEV the backend may return a token for testing)
      setMsg(
        data?.token
          ? `Instructions sent. Dev token: ${data.token}`
          : "Password reset instructions have been sent to your email. Please check your inbox."
      );
    } catch (err: unknown) {
      // 5. Handle errors in a user-friendly way
      const text = errorMessage(err);
      if (text.includes("Network is unreachable") || text.includes("Failed to send email")) {
        setMsg("Email service is temporarily unavailable. Please try again later.");
      } else if (text.includes("API Error 404")) {
        setMsg("No account found with this email address.");
      } else if (text.includes("API Error 500")) {
        setMsg("Server error. Please try again later.");
      } else {
        setMsg(text || "Failed to send reset email. Please try again.");
      }
    } finally {
      // 6. Always stop the loading spinner
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <form onSubmit={submit} className="p-8">
          {/* Header */}
          <ModalHeader title="Reset Password" onClose={closeModal} />

          {/* Description */}
          <p className="text-gray-600 text-base leading-relaxed mb-8 text-center">
            Enter your email and we&apos;ll send you reset instructions.
          </p>

          {/* Email Input */}
          <div className="mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-5 py-4
                rounded-2xl 
                bg-gray-50
                text-gray-900 placeholder-gray-400 text-base
                border-2 border-gray-200
                outline-none
                focus:border-green-600 focus:bg-white
                transition-all duration-200
              "
              placeholder="Enter your email address"
              required
              autoFocus
              autoComplete="email"
              maxLength={100}
            />
          </div>

          {/* Alert */}
          {msg && (
            <Alert
              kind={msg.toLowerCase().includes("sent") ? "success" : "error"}
              className="mb-6"
            >
              {msg}
            </Alert>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              className="
                w-full
                rounded-2xl
                px-6 py-4
                bg-green-600 text-white
                font-semibold text-base
                hover:bg-green-700
                active:scale-[0.98]
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-green-600/20
              "
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Send Reset Email"}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="
                w-full
                rounded-2xl
                px-6 py-4
                bg-white text-gray-700
                font-medium text-base
                border-2 border-gray-200
                hover:bg-gray-50 hover:border-gray-300
                active:scale-[0.98]
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={loading}
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}