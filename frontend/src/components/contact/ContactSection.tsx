"use client";
import { useState } from "react";
import { determineEnv } from "../../../utils/api";

const API = determineEnv();

export default function ContactSection() {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: (formData.get("name") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      reason: (formData.get("reason") || "").toString().trim() || null,
      message: (formData.get("message") || "").toString().trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setPending(true);

      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Status ${res.status}`);
      }

      setSuccess("Thank you! Your message has been sent.");
      form.reset();
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong. Please try again later or email us directly at wonderhood.project@gmail.com."
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <section>
        {/* Layout: cards + form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: quick contacts */}
            <div className="space-y-6 lg:col-span-1">
                <div className="rounded-2xl bg-white/80 shadow-sm border border-wonderleaf/30 p-5">
                    <div className="rounded-2xl bg-white/80 shadow-sm border border-wonderleaf/30 p-5">
                    <h2 className="text-base font-semibold text-wondergreen mb-2">
                        General Questions
                    </h2>
                    <p className="text-sm text-gray-700 mb-1">
                        Have a question about WonderHood or how our programs work?
                    </p>
                    <p className="text-sm font-semibold text-wondergreen break-all">
                        wonderhood.project@gmail.com
                    </p>
                    <p className="mt-2 text-xs text-gray-600">
                        Messages are reviewed by our leadership and operations team:
                        <br />
                        Anastasiia Muzhzhavlev – Founder &amp; CEO
                        <br />
                        Dmitriy Muzhzhavlev – Board Chair
                        <br />
                        Heather Wingfeld – Board Secretary
                        <br />
                        Ekaterina Golin – CFO
                        <br />
                        Evgeny Aleksandrushkin – Treasurer
                        <br />
                        Andrew Lizon – Technical Lead (platform &amp; website)
                    </p>
                    </div>

                    <div className="rounded-2xl bg-white/80 shadow-sm border border-wonderleaf/30 p-5 mt-2">
                        <h2 className="text-base font-semibold text-wondergreen mb-2">
                        Tech Support &amp; Website Issues
                        </h2>
                        <p className="text-sm text-gray-700 mb-1">
                        Having trouble with your account or our website? Please mention
                        <span className="font-semibold"> “tech support” </span>
                        in your message — it will be routed to our Technical Lead,
                        Andrew Lizon.
                        </p>
                        <p className="text-sm font-semibold text-wondergreen break-all">
                        andrew.lizon12@gmail.com
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-2">
                <form
                    className="rounded-2xl bg-white/90 shadow-md border border-wonderleaf/30 p-6 sm:p-8 space-y-4"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                        </label>
                        <input
                        type="text"
                        name="name"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/60 focus:border-wondergreen"
                        placeholder="Your name"
                        required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                        </label>
                        <input
                        type="email"
                        name="email"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/60 focus:border-wondergreen"
                        placeholder="you@example.com"
                        required
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for contacting
                    </label>
                    <select
                        name="reason"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/60 focus:border-wondergreen"
                        defaultValue=""
                    >
                        <option value="" disabled>
                        Select an option
                        </option>
                        <option value="Question about programs or events">
                        Question about programs or events
                        </option>
                        <option value="Volunteering">Volunteering</option>
                        <option value="Donations / Sponsorship">
                        Donations / Sponsorship
                        </option>
                        <option value="Partnership / Collaboration">
                        Partnership / Collaboration
                        </option>
                        <option value="Other">Other</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                    </label>
                    <textarea
                        name="message"
                        rows={5}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/60 focus:border-wondergreen"
                        placeholder="Tell us how we can help..."
                        required
                    />
                    </div>

                    {/* Errors */}
                    {error && (
                    <p className="text-sm text-red-600" role="alert">
                        {error}
                    </p>
                    )}
                    {success && (
                    <p className="text-sm text-green-600" role="status">
                        {success}
                    </p>
                    )}

                    <p className="text-xs text-gray-500">
                    Please do not share medical, financial, or other highly sensitive personal
                    information in this form. If your question is urgent or safety-related,
                    please contact local emergency services.
                    </p>

                    <div className="pt-2">
                    <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex items-center justify-center rounded-xl bg-wondergreen px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-wonderleaf transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {pending ? "Sending..." : "Send Message"}
                    </button>
                    </div>
                </form>

                {/* Location / nonprofit info */}
                <div className="mt-6 text-xs text-gray-600 space-y-1">
                    <p>
                    WonderHood Project is a Colorado-based nonprofit serving homeschool and online-learning families across the state.
                    </p>
                    <p>
                    WonderHood Project is a 501(c)(3) public charity. EIN: 39-3199830.
                    Donations are tax-deductible to the fullest extent allowed by law.
                    </p>
                </div>
            </div>
        </div>
    </section>
  );
}
