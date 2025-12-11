'use client';

import React, { useRef, useState, useEffect } from 'react';
import MultiSelect from '@/components/common/MultiSelect';
import { CITIES_CO } from '@/data/citiesCO';
import type { AvailabilityDay, VolunteerCreate, TimeOption } from '@/types/volunteer';
import { TIME_OPTIONS } from '@/types/volunteer';


type Props = {
  form: VolunteerCreate;
  disabled: boolean;
  opportunityId?: string;
  ok: boolean;
  okMsg: string | null;
  error: string | null;
  //Patch-like state update from parent
  onChange: (patch: Partial<VolunteerCreate>) => void;
  //Parent will finalize/normalize (e.g., phone to E.164) and POST */
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
};

export default function VolunteerFormContent({form, disabled, opportunityId, ok, okMsg, error, onChange, onSubmit }: Props) {

    // Keep focus on the first input when the form becomes enabled
    const firstNameRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!disabled) firstNameRef.current?.focus();
    }, [disabled]);


    // Toggle day in `daysAvail` (no extra UI state, works directly on API field)
    const toggleDay = (d: AvailabilityDay) => {
        const set = new Set(form.daysAvail);
        if (set.has(d)) {
            set.delete(d);
        } else {
            set.add(d);
        }
        onChange({ daysAvail: [...set] });
    };

    //Toggle time option in 'timesAvail'
    const toggleTime = (t: TimeOption) => {
        const current = form.timesAvail ?? [];
        const set = new Set(current);
        if (set.has(t)) {
            set.delete(t);
        } else {
            set.add(t);
        }
        onChange({ timesAvail: [...set] });
    };

    //Select or clear all time options
    const selectAllTimes = () => {
        const allSelected = (form.timesAvail?.length ?? 0) === TIME_OPTIONS.length;
        onChange({ timesAvail: allSelected ? [] : [...TIME_OPTIONS] });
    };

    // Local text for skills input
    const [skillsInput, setSkillsInput] = useState<string>((form.skills ?? []).join(', '));

    // We synchronize if the parent resets the form (after a successful submission)
    useEffect(() => {
    setSkillsInput((form.skills ?? []).join(', '));
    }, [form.skills]);

    // Split string -> array (comma or newline), remove duplicates
    const toSkillsArray = (s: string) => {
    const tokens = s
        .split(/\s*,\s*|\r?\n/g)
        .map(x => x.trim())
        .filter(Boolean);
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const t of tokens) {
        const key = t.toLowerCase();
        if (!seen.has(key)) { seen.add(key); unique.push(t); }
    }
    return unique;
    };

    const commitSkills = (raw: string) => {
    const next = toSkillsArray(raw);
    onChange({ skills: next });
    setSkillsInput(next.join(', '));
    };


    return (
        <form onSubmit={onSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
            {/* Put disabled on the fieldset to get native browser behavior */}
            <fieldset disabled={disabled} aria-disabled={disabled} className={disabled ? 'opacity-60' : ''}>
                {/* Identity */}
                <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        First name <span className="text-rose-600">*</span>
                    </label>
                    <input
                    ref={firstNameRef}
                    className="w-full rounded-lg border px-3 py-2"
                    value={form.firstName}
                    onChange={(e) => onChange({ firstName: e.target.value })}
                    required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Last name <span className="text-rose-600">*</span>
                    </label>
                    <input
                    className="w-full rounded-lg border px-3 py-2"
                    value={form.lastName}
                    onChange={(e) => onChange({ lastName: e.target.value })}
                    required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Email <span className="text-rose-600">*</span>
                    </label>
                    <input
                    type="email"
                    className="w-full rounded-lg border px-3 py-2"
                    value={form.email ?? ''}
                    onChange={(e) => onChange({ email: e.target.value })}
                    placeholder="name@example.com"
                    required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Phone <span className="text-rose-600">*</span>
                    </label>
                    <input
                    inputMode="tel"
                    className="w-full rounded-lg border px-3 py-2"
                    value={form.phoneNumber ?? ''}
                    onChange={(e) => onChange({ phoneNumber: e.target.value })}
                    placeholder="123-456-7890"
                    required
                    />
                </div>
                </div>

                {/* Cities + Times */}
                <div className="grid gap-6 md:grid-cols-2 mt-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Cities <span className="ml-1 text-xs text-gray-500">(multi-select)</span>
                    </label>
                    <MultiSelect
                    // Spread to get a mutable array from a readonly tuple (common need for select widgets)
                    options={[...CITIES_CO]}
                    value={form.cities}
                    onChange={(next: string[]) => onChange({ cities: next })}
                    placeholder="Select cities…"
                    className="text-gray-400"
                    />
                </div>

                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-sm font-medium">Times</label>
                    <button
                        type="button"
                        onClick={selectAllTimes}
                        className="text-xs text-emerald-700 hover:underline mr-4"
                    >
                        {(form.timesAvail?.length ?? 0) === TIME_OPTIONS.length ? 'Clear all' : 'Select all'}
                    </button>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                    {TIME_OPTIONS.map((t) => (
                        <label key={t} className="inline-flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={(form.timesAvail ?? []).includes(t)}
                            onChange={() => toggleTime(t)}
                        />
                        <span>{t}</span>
                        </label>
                    ))}
                    </div>
                </div>
                </div>

                {/* Availability (days) */}
                <div className="space-y-2 mt-4">
                <label className="block text-sm font-medium">Availability (Days)</label>
                <div className="flex gap-6 text-sm">
                    {(['Weekdays', 'Weekends'] as AvailabilityDay[]).map((d) => (
                    <label key={d} className="inline-flex items-center gap-2">
                        <input
                        type="checkbox"
                        checked={form.daysAvail.includes(d)}
                        onChange={() => toggleDay(d)}
                        />
                        <span>{d}</span>
                    </label>
                    ))}
                </div>
                </div>

                {/* Skills */}
                <div className="space-y-2 mt-4">
                <label className="block text-sm font-medium">
                    Skills <span className="text-rose-600">*</span>
                </label>
                <input
                placeholder="First Aid, Project management, Youth mentoring"
                className="w-full rounded-lg border px-3 py-2.5"
                value={skillsInput}                          // local text
                onChange={(e) => setSkillsInput(e.target.value)} //don't parse every character
                onBlur={() => commitSkills(skillsInput)}     // commit on loss of focus
                onKeyDown={(e) => {
                if (e.key === 'Enter') {                   // commit tru Enter (not submitting form)
                    e.preventDefault();
                    commitSkills(skillsInput);
                }
                }}
                required
                />
                <p className="mt-1 text-xs text-slate-500">
                    Separate skills with commas or press Enter. Spaces inside a skill are allowed (e.g., “First Aid”).
                </p>
                </div>


                {/* Short bio */}
                <div className="space-y-2 mt-4">
                <label className="block text-sm font-medium">Short Biography (optional)</label>
                <textarea
                    rows={4}
                    className="w-full rounded-lg border px-3 py-2"
                    value={form.bio ?? ''}
                    onChange={(e) => onChange({ bio: e.target.value })}
                />
                </div>

                {/* Required consents */}
                <div className="space-y-3 mt-4">
                <label className="block text-sm font-medium">
                    Consents <span className="text-rose-600">*</span>
                </label>

                <label className="flex items-start gap-2">
                    <input
                    type="checkbox"
                    checked={!!form.photoConsent}
                    onChange={(e) => onChange({ photoConsent: e.target.checked })}
                    required
                    />
                    <span className="text-sm">I consent to photos/videos (Photo Policy).</span>
                </label>

                <label className="flex items-start gap-2">
                    <input
                    type="checkbox"
                    checked={!!form.backgroundCheckConsent}
                    onChange={(e) => onChange({ backgroundCheckConsent: e.target.checked })}
                    required
                    />
                    <span className="text-sm">I consent to a background check (18+).</span>
                </label>
                </div>

                {/* Server response banners */}
                {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">{error}</div>
                )}

                {ok && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
                    <p>
                    {okMsg ??
                        "Thank you for applying! We&apos;ve received your information and will contact you within 2–3 business days."}
                    </p>
                    {!opportunityId && (
                    <div className="mt-3">
                        <a
                        href="#opportunities"
                        className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                        >
                            Back to opportunities
                        </a>
                    </div>
                    )}
                </div>
                )}

                {/* Submit */}
                <div className="mt-6 flex justify-center sm:justify-end" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <button
                    type="submit"
                    disabled={disabled}
                    className="w-full sm:w-auto min-h-11 rounded-xl bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                    Submit application
                </button>
                </div>
            </fieldset>
        </form>
  );
}
