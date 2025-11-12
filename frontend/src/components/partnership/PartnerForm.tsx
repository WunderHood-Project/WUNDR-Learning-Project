"use client";

import { useState } from "react";
import type { PartnerApplication, PartnerType } from "../../types/partnership";
import {determineEnv, makeApiRequest } from "../../../utils/api";
import { normalizeWebsite } from "../../../utils/url";
import { onlyDigitals, formatUs, toE164US } from "../../../utils/formatPhoneNumber";

const WONDERHOOD_URL = determineEnv()

const defaultData: PartnerApplication = {
    orgName: "",
    contactName: "",
    email: "",
    partnerType: "venue",
};

export default function PartnerForm() {
    const [data, setData] = useState<PartnerApplication>(defaultData);
    const [loading, setLoading] = useState(false);
    const [ok, setOk] = useState<null | "ok" | "err">(null);

    const update = <K extends keyof PartnerApplication>(k: K, v: PartnerApplication[K]) =>
        setData((d) => ({ ...d, [k]: v }));

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void (async () => {
        setLoading(true);
        setOk(null);

        const payload = {
        ...data,
        website: normalizeWebsite(data.website) ?? undefined,
        phone: toE164US(data.phone) || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        howCanYouHelp: data.howCanYouHelp || undefined,
        preferredDates: data.preferredDates || undefined,
        budgetOrInKind: data.budgetOrInKind || undefined,
        notes: data.notes || undefined,
        };

        try {
            await makeApiRequest(`${WONDERHOOD_URL}/partners`, {
                method: "POST",
                body: payload,
            });
            setOk("ok");
            setData(defaultData);
        } catch {
            const subject = encodeURIComponent("Partnership Inquiry");
            const body = encodeURIComponent(
                [
                `Organization: ${data.orgName}`,
                `Contact: ${data.contactName}`,
                `Email: ${data.email}`,
                `Phone: ${data.phone ?? ""}`,
                `Type: ${data.partnerType}`,
                `Website: ${normalizeWebsite(data.website) ?? ""}`,
                `Location: ${[data.city, data.state].filter(Boolean).join(", ")}`,
                `How can you help: ${data.howCanYouHelp ?? ""}`,
                `Preferred dates: ${data.preferredDates ?? ""}`,
                `Budget or in-kind: ${data.budgetOrInKind ?? ""}`,
                `Notes: ${data.notes ?? ""}`,
                ].join("\n")
        );
        window.location.href = `mailto:wonderhood.project@gmail.com?subject=${subject}&body=${body}`;
        setOk("ok");
        } finally {
        setLoading(false);
        }
    })();
    }


    const inputCls = "w-full rounded-lg border border-gray-300 px-3 py-2 text-[15px] sm:text-base outline-none focus:ring-2 focus:ring-wondergreen/60";

    return (
        <section id="apply" className="py-10 sm:py-12 lg:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col items-center xl:items-start">
                    <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-wondergreen text-center xl:text-left">
                        Partnership Inquiry
                    </h2>
                    <div className="h-1 w-3/4 sm:w-[26%] bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full shadow-md mb-6 sm:mb-8 mt-2 self-center xl:self-start" />
                </div>

                <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 rounded-2xl bg-white p-5 sm:p-6 ring-1 ring-wonderleaf/20 shadow-sm"
                >
                    {/* left */}
                    <div className="grid gap-4">
                        <Field label="Organization Name *">
                            <input
                                required
                                value={data.orgName}
                                onChange={(e) => update("orgName", e.target.value)}
                                className={inputCls}
                            />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Contact Name *">
                                <input
                                required
                                value={data.contactName}
                                onChange={(e) => update("contactName", e.target.value)}
                                className={inputCls}
                                />
                            </Field>
                            <Field label="Email *">
                                <input
                                required
                                type="email"
                                autoCapitalize="none"
                                autoCorrect="off"
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => update("email", e.target.value)}
                                className={inputCls}
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Phone">
                                <input
                                    value={formatUs(data.phone ?? "")}
                                    onChange={(e) => update("phone", onlyDigitals(e.target.value))}
                                    onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                                    e.preventDefault();
                                    const text = e.clipboardData.getData("text");
                                    update("phone", onlyDigitals(text));
                                    }}
                                    inputMode="tel"
                                    pattern="^[0-9]{3}-[0-9]{3}-[0-9]{4}$" 
                                    autoComplete="tel"
                                    maxLength={12} 
                                    className={inputCls}
                                />
                            </Field>


                            <Field label="Partner Type">
                                <select
                                value={data.partnerType}
                                onChange={(e) => update("partnerType", e.target.value as PartnerType)}
                                className={inputCls}
                                >
                                <option value="venue">Venue</option>
                                <option value="program">Program</option>
                                <option value="resource">Resource Sponsor</option>
                                <option value="education">Education</option>
                                </select>
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Website">
                                <input
                                value={data.website ?? ""}
                                onChange={(e) => update("website", e.target.value)}
                                className={inputCls}
                                />
                            </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="City">
                            <input
                                value={data.city ?? ""}
                                onChange={(e) => update("city", e.target.value)}
                                className={inputCls}
                            />
                            </Field>
                            <Field label="State">
                            <input
                                value={data.state ?? ""}
                                onChange={(e) => update("state", e.target.value)}
                                className={inputCls}
                            />
                            </Field>
                        </div>
                        </div>
                    </div>

                    {/* right */}
                    <div className="grid gap-4">
                        <Field label="How can you help?">
                            <textarea
                                rows={4}
                                value={data.howCanYouHelp ?? ""}
                                onChange={(e) => update("howCanYouHelp", e.target.value)}
                                className={inputCls}
                            />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Preferred dates / season">
                                <input
                                value={data.preferredDates ?? ""}
                                onChange={(e) => update("preferredDates", e.target.value)}
                                className={inputCls}
                                />
                            </Field>
                            <Field label="Budget or in-kind">
                                <input
                                value={data.budgetOrInKind ?? ""}
                                onChange={(e) => update("budgetOrInKind", e.target.value)}
                                className={inputCls}
                                />
                            </Field>
                        </div>

                        <Field label="Notes">
                        <textarea
                            rows={3}
                            value={data.notes ?? ""}
                            onChange={(e) => update("notes", e.target.value)}
                            className={inputCls}
                        />
                        </Field>

                        {/* btn submit */}
                        <div className="flex items-center justify-center gap-3 text-center mt-1">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex rounded-xl bg-wondergreen text-white px-5 py-3 text-[15px] sm:text-base font-semibold shadow-md hover:brightness-105 active:scale-[.99] disabled:opacity-60"
                            >
                                {loading ? "Submitting…" : "Submit Partnership Inquiry"}
                            </button>
                            {ok === "ok" && (
                                <span className="text-wondergreen font-medium text-sm sm:text-base">
                                    Thanks! We&apos;ll be in touch.
                                </span>
                            )}
                            {ok === "err" && (
                                <span className="text-red-600 text-sm sm:text-base">Something went wrong.</span>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
    }

    function Field({ label, children }: { label: string; children: React.ReactNode }) {
        return (
            <label className="grid gap-1">
                <span className="text-[13px] sm:text-sm font-medium text-wondergreen/90">{label}</span>
                    {children}
            </label>
        );
}
