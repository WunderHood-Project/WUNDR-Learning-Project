'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { makeApiRequest, determineEnv } from '../../../utils/api';
import { useActivity } from '../../../hooks/useActivity';
import { useUser } from '../../../hooks/useUser';
import { ymdToIsoNoShift, todayYMDUTC } from '../../../utils/formatDate';
import { compressImage } from '../../../utils/image/compressImage';
import type { CreateProgramPayload, ProgramFormErrors } from '@/types/program';
import { ApiError } from '../../../utils/api';

const WONDERHOOD_URL = determineEnv();

const initialForm = (): CreateProgramPayload => ({
    activityId: '',
    name: '',
    description: '',
    ageMin: 0,
    ageMax: 18,
    startDate: '',
    endDate: '',
    sessionSchedule: '',
    image: '',
    outcomes: [],
    label: 'wonderhood',
    // phases: [],
    directorName: '',
    directorTitle: '',
    directorImage: '',
    directorBio: '',
    limit: null,
    venue: 'in_person',
    city: '',
    state: 'CO',
    address: '',
    zipCode: '',
});


export default function AddProgramForm() {
    const router = useRouter();
    const { activities } = useActivity();
    const defaultProgramActivity = activities.find(
        (a) => a.name === 'Enrichment Programs'
    );
    const { user } = useUser();
    const todayYMD = useMemo(() => todayYMDUTC(), []);

    const isPartner = user?.role === 'partner';
    const endpoint = isPartner
        ? `${WONDERHOOD_URL}/program/submit`
        : `${WONDERHOOD_URL}/program`;

    const [form, setForm] = useState<CreateProgramPayload>(() => initialForm());
    const [errors, setErrors] = useState<ProgramFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.role === 'partner' && form.label !== 'partner') {
            setForm((prev) => ({
                ...prev,
                label: 'partner',
            }));
        }
    }, [user?.role, form.label]);

    // Set default activity to "Enrichment Programs" on load (required by backend)
    useEffect(() => {
        if (defaultProgramActivity?.id && !form.activityId) {
            setForm((prev) => ({
                ...prev,
                activityId: defaultProgramActivity.id,
            }));
        }
    }, [defaultProgramActivity, form.activityId]);

    // Raw string display values for number inputs that should be clearable
    const [ageMinInput, setAgeMinInput] = useState('0');
    const [ageMaxInput, setAgeMaxInput] = useState('18');

    // Dynamic lists
    const [outcomeInput, setOutcomeInput] = useState('');
    // const [phases, setPhases] = useState<ProgramPhase[]>([]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === 'limit') {
            setForm((prev) => ({ ...prev, limit: value === '' ? null : parseInt(value, 10) }));
            return;
        }
        if (name === 'ageMin') {
            setAgeMinInput(value);
            setForm((prev) => ({ ...prev, ageMin: parseInt(value, 10) || 0 }));
            return;
        }
        if (name === 'ageMax') {
            setAgeMaxInput(value);
            setForm((prev) => ({ ...prev, ageMax: parseInt(value, 10) || 0 }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleDirectorImageChange = async (fileOrUrl: File | string | null) => {
        if (fileOrUrl instanceof File) {
            const dataUrl = await compressImage(fileOrUrl, {
                maxWidth: 1200,
                maxHeight: 1200,
                quality: 0.8,
                type: 'image/webp',
            });
            setForm((prev) => ({ ...prev, directorImage: dataUrl }));
        } else {
            setForm((prev) => ({ ...prev, directorImage: fileOrUrl ?? '' }));
        }
    };

    const handleImageChange = async (fileOrUrl: File | string | null) => {
        if (fileOrUrl instanceof File) {
            const dataUrl = await compressImage(fileOrUrl, {
                maxWidth: 1600,
                maxHeight: 1200,
                quality: 0.8,
                type: 'image/webp',
            });
            setForm((prev) => ({ ...prev, image: dataUrl }));
        } else {
            setForm((prev) => ({ ...prev, image: fileOrUrl ?? '' }));
        }
    };

    const addOutcome = () => {
        const trimmed = outcomeInput.trim();
        if (!trimmed) return;
        setForm((prev) => ({ ...prev, outcomes: [...(prev.outcomes ?? []), trimmed] }));
        setOutcomeInput('');
    };

    const removeOutcome = (i: number) => {
        setForm((prev) => ({
            ...prev,
            outcomes: (prev.outcomes ?? []).filter((_, idx) => idx !== i),
        }));
    };

    // const addPhase = () => {
    //   setPhases((prev) => [...prev, { season: '', title: '' }]);
    // };

    // const updatePhase = (i: number, field: keyof ProgramPhase, value: string) => {
    //   setPhases((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
    // };

    // const removePhase = (i: number) => {
    //   setPhases((prev) => prev.filter((_, idx) => idx !== i));
    // };

    const scrollToFirstError = (errs: ProgramFormErrors) => {
        const firstKey = Object.keys(errs)[0];
        if (!firstKey) return;
        // Find the input/select/textarea with a matching name attribute and scroll to it
        setTimeout(() => {
            const el = document.querySelector<HTMLElement>(`[name="${firstKey}"]`);
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el?.focus({ preventScroll: true });
        }, 0);
    };

    const validate = (): ProgramFormErrors => {
        const errs: ProgramFormErrors = {};

        // Name
        if (!form.name.trim()) {
            errs.name = 'Program name is required.';
        } else if (form.name.trim().length < 3) {
            errs.name = 'Program name must be at least 3 characters.';
        } else if (form.name.trim().length > 100) {
            errs.name = 'Program name must be 100 characters or fewer.';
        }

        // Description
        if (!form.description.trim()) {
            errs.description = 'Description is required.';
        } else if (form.description.trim().length < 10) {
            errs.description = 'Description must be at least 10 characters.';
        }

        // Activity
        if (!form.activityId) errs.activityId = 'Activity is required.';

        // Dates
        if (!form.startDate) {
            errs.startDate = 'Start date is required.';
        }
        if (!form.endDate) {
            errs.endDate = 'End date is required.';
        }
        if (form.startDate && form.endDate && form.startDate > form.endDate) {
            errs.endDate = 'End date must be on or after the start date.';
        }

        // Ages
        if (form.ageMin < 4) {
            errs.ageMin = 'Min age cannot be less than four.';
        } else if (form.ageMin > 18) {
            errs.ageMin = 'Min age cannot exceed 18.';
        }
        if (form.ageMax < 0) {
            errs.ageMax = 'Max age cannot be negative.';
        } else if (form.ageMax > 18) {
            errs.ageMax = 'Max age cannot exceed 18.';
        } else if (form.ageMax < form.ageMin) {
            errs.ageMax = 'Max age must be greater than or equal to min age.';
        }

        // Capacity
        if (form.limit !== null && form.limit !== undefined) {
            if (!Number.isInteger(form.limit) || form.limit < 1) {
                errs.limit = 'Capacity must be a whole number of at least 1.';
            }
        }

        // Location — only for in-person / hybrid
        if (form.venue !== 'online') {
            if (form.state && form.state.trim().length !== 2) {
                errs.state = 'State must be a 2-letter abbreviation (e.g. CO).';
            }
            if (form.zipCode && form.zipCode.trim() && !/^\d{5}$/.test(form.zipCode.trim())) {
                errs.zipCode = 'Zip code must be exactly 5 digits.';
            }
        }

        setErrors(errs);
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            scrollToFirstError(errs);
            return;
        }

        setIsSubmitting(true);
        setServerError(null);

        // const validPhases = phases.filter((p) => p.season.trim() && p.title.trim());

        const { activityId, ...reset } = form;

        const payload = {
            ...reset,
            activityId,
            startDate: ymdToIsoNoShift(form.startDate as string),
            endDate: ymdToIsoNoShift(form.endDate as string),
            // phases: validPhases.length > 0 ? validPhases : undefined,
            sessionSchedule: form.sessionSchedule || undefined,
            directorName: form.directorName || undefined,
            directorTitle: form.directorTitle || undefined,
            directorImage: form.directorImage || undefined,
            image: form.image || undefined,
            limit: form.limit ?? undefined,
            city: form.city || undefined,
            state: form.state || undefined,
            address: form.address || undefined,
            zipCode: form.zipCode || undefined,
        };

        try {
            await makeApiRequest(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
            });
            router.push(isPartner ? '/events?success=program' : '/events');
        } catch (err) {
            if (err instanceof ApiError && Object.keys(err.fields).length > 0) {
                // Map server-side field errors into inline form errors and scroll to the first one
                setErrors((prev) => ({ ...prev, ...err.fields }));
                scrollToFirstError(err.fields);
            } else {
                setServerError(
                    err instanceof Error ? err.message.replace(/^API Error \d+:\s*/, '') : 'Failed to create program.'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputCls =
        'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/40';
    const labelCls = 'block text-sm font-semibold text-gray-700 mb-1';
    const errorCls = 'text-xs text-red-600 mt-1';

    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-wondergreen mb-2">
                {isPartner ? 'Submit an Enrichment Program' : 'Add Enrichment Program'}
            </h1>
            {isPartner && (
                <p className="text-sm text-gray-600 mb-6">
                    Your submission will be reviewed by a WonderHood admin before it goes live.
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="bg-white/60 rounded-2xl border border-white/60 backdrop-blur-sm p-6 sm:p-8 space-y-6 shadow-md"
            >
                {/* Basic info */}
                <section className="space-y-4">
                    {/* <h2 className="text-base font-bold text-wondergreen uppercase tracking-wide border-b border-gray-200 pb-2">
              Basic Information
            </h2> */}

                    {/* Admin-only: label */}
                    {/* {!isPartner && ( */}
                    <div>
                        <label className={labelCls}>
                            Label <span className="text-rose-600">*</span>
                        </label>
                        {isPartner ?
                            <select
                                name="label"
                                value={form.label}
                                onChange={handleChange}
                                className={`${inputCls} bg-gray-50 cursor-not-allowed text-gray-500`}
                                disabled
                            >
                                <option value="partner">Partner</option>
                            </select> :
                            <select
                                name="label"
                                value={form.label}
                                onChange={handleChange}
                                className={inputCls}
                                required
                            >
                                <option value="wonderhood">WonderHood</option>
                                <option value="partner">Partner</option>
                            </select>
                        }
                    </div>
                    {/* )} */}

                    <div>
                        <label className={labelCls}>
                            Program Name <span className="text-rose-600">*</span>
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={inputCls}
                            placeholder="e.g. Creative Kids Enrichment Program"
                        />
                        {errors.name && <p className={errorCls}>{errors.name}</p>}
                    </div>

                    <div>
                        <label className={labelCls}>
                            Description <span className="text-rose-600">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            className={inputCls}
                            placeholder="Describe what the program is about…"
                        />
                        {errors.description && <p className={errorCls}>{errors.description}</p>}
                    </div>
                </section>

                {/* Dates & ages */}
                <section className="space-y-4">
                    <h2 className="text-base font-bold text-wondergreen uppercase tracking-wide border-b border-gray-200 pb-2">
                        Dates & Ages
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>
                                Start Date <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate as string}
                                min={todayYMD}
                                onChange={handleChange}
                                className={inputCls}
                            />
                            {errors.startDate && <p className={errorCls}>{errors.startDate}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>
                                End Date <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate as string}
                                min={form.startDate as string || todayYMD}
                                onChange={handleChange}
                                className={inputCls}
                            />
                            {errors.endDate && <p className={errorCls}>{errors.endDate}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Session Schedule (optional)</label>
                        <input
                            name="sessionSchedule"
                            value={form.sessionSchedule ?? ''}
                            onChange={handleChange}
                            className={inputCls}
                            placeholder="e.g. Weekly, Tuesdays 4–5 PM"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>
                                Min Age <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="number"
                                name="ageMin"
                                value={ageMinInput}
                                min={0}
                                max={18}
                                onChange={handleChange}
                                className={inputCls}
                            />
                            {errors.ageMin && <p className={errorCls}>{errors.ageMin}</p>}
                        </div>
                        <div>
                            <label className={labelCls}>
                                Max Age <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="number"
                                name="ageMax"
                                value={ageMaxInput}
                                min={0}
                                max={18}
                                onChange={handleChange}
                                className={inputCls}
                            />
                            {errors.ageMax && <p className={errorCls}>{errors.ageMax}</p>}
                        </div>
                    </div>
                </section>

                {/* Outcomes */}
                <section className="space-y-3">
                    <h2 className="text-base font-bold text-wondergreen uppercase tracking-wide border-b border-gray-200 pb-2">
                        What Your Child Will Gain
                    </h2>

                    <div className="flex gap-2">
                        <input
                            value={outcomeInput}
                            onChange={(e) => setOutcomeInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') { e.preventDefault(); addOutcome(); }
                            }}
                            className={`${inputCls} flex-1`}
                            placeholder="Add an outcome and press Enter or click Add"
                        />
                        <button
                            type="button"
                            onClick={addOutcome}
                            className="px-4 py-2 rounded-lg bg-wondergreen text-white text-sm font-semibold hover:bg-wonderleaf transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    {(form.outcomes ?? []).length > 0 && (
                        <ul className="space-y-1.5">
                            {(form.outcomes ?? []).map((o, i) => (
                                <li
                                    key={i}
                                    className="flex items-center justify-between gap-2 rounded-lg bg-wonderbg/60 px-3 py-2 text-sm"
                                >
                                    <span className="text-gray-800">{o}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeOutcome(i)}
                                        className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Phases */}
                {/* <section className="space-y-3">
            <h2 className="text-base font-bold text-wondergreen uppercase tracking-wide border-b border-gray-200 pb-2">
              Program Phases (optional)
            </h2>

            {phases.map((phase, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={phase.season}
                  onChange={(e) => updatePhase(i, 'season', e.target.value)}
                  className={`${inputCls} w-28`}
                  placeholder="Season"
                />
                <input
                  value={phase.title}
                  onChange={(e) => updatePhase(i, 'title', e.target.value)}
                  className={`${inputCls} flex-1`}
                  placeholder="Phase title"
                />
                <button
                  type="button"
                  onClick={() => removePhase(i)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold px-2"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addPhase}
              className="text-sm font-semibold text-wondergreen underline hover:opacity-80"
            >
              + Add phase
            </button>
          </section> */}

                {/* Director */}
                <section className="space-y-4">
                    <h2 className="text-base font-bold text-wondergreen uppercase tracking-wide border-b border-gray-200 pb-2">
                        Program Lead (optional)
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls}>Program Lead Name</label>
                            <input
                                name="directorName"
                                value={form.directorName ?? ''}
                                onChange={handleChange}
                                className={inputCls}
                                placeholder="Full name"
                            />
                        </div>
                        <div>
                            <label className={labelCls}>Role (optional)</label>
                            <input
                                name="directorTitle"
                                value={form.directorTitle ?? ''}
                                onChange={handleChange}
                                className={inputCls}
                                placeholder="e.g. Lead Instructor"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelCls}>Bio (optional)</label>
                        <textarea
                            name="directorBio"
                            value={form.directorBio ?? ''}
                            onChange={handleChange}
                            rows={3}
                            className={inputCls}
                            placeholder="A short bio about the program lead…"
                        />
                    </div>

                    <div>
                        <label className={labelCls}>Program Lead Photo (optional)</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleDirectorImageChange(e.target.files?.[0] ?? null)}
                            className="block w-full text-sm text-gray-700"
                        />

                        {form.directorImage && (
                            <div className="mt-3">
                                <img
                                    src={form.directorImage}
                                    alt="Program Lead"
                                    className="h-20 w-20 rounded-full object-cover border border-gray-200"
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className={labelCls}>— or paste a photo URL</label>
                        <input
                            name="directorImage"
                            value={form.directorImage ?? ''}
                            onChange={handleChange}
                            className={inputCls}
                            placeholder="https://…"
                        />
                    </div>
                </section>

                {/* Venue & location */}
                <section className="space-y-4">
                    <h2 className="text-base font-bold text-wondergreen uppercase tracking-wide border-b border-gray-200 pb-2">
                        Venue & Location
                    </h2>

                    <div>
                        <label className={labelCls}>Venue</label>
                        <select name="venue" value={form.venue} onChange={handleChange} className={inputCls}>
                            <option value="in_person">In-Person</option>
                            <option value="online">Online</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>

                    {form.venue !== 'online' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Address</label>
                                <input
                                    name="address"
                                    value={form.address ?? ''}
                                    onChange={handleChange}
                                    className={inputCls}
                                    placeholder="123 Main St"
                                />
                            </div>
                            <div>
                                <label className={labelCls}>City</label>
                                <input
                                    name="city"
                                    value={form.city ?? ''}
                                    onChange={handleChange}
                                    className={inputCls}
                                    placeholder="Westcliffe"
                                />
                            </div>
                            <div>
                                <label className={labelCls}>State</label>
                                <input
                                    name="state"
                                    value={form.state ?? ''}
                                    onChange={handleChange}
                                    className={inputCls}
                                    placeholder="CO"
                                    maxLength={2}
                                />
                                {errors.state && <p className={errorCls}>{errors.state}</p>}
                            </div>
                            <div>
                                <label className={labelCls}>Zip Code</label>
                                <input
                                    name="zipCode"
                                    value={form.zipCode ?? ''}
                                    onChange={handleChange}
                                    className={inputCls}
                                    placeholder="81252"
                                />
                                {errors.zipCode && <p className={errorCls}>{errors.zipCode}</p>}
                            </div>
                        </div>
                    )}
                </section>

                {/* Enrollment */}
                <section className="space-y-4">
                    <h2 className="text-base font-bold text-wondergreen uppercase tracking-wide border-b border-gray-200 pb-2">
                        Enrollment
                    </h2>

                    <div>
                        <label className={labelCls}>Capacity Limit (leave blank for no limit)</label>
                        <input
                            type="number"
                            name="limit"
                            value={form.limit ?? ''}
                            min={1}
                            onChange={handleChange}
                            className={inputCls}
                            placeholder="No limit"
                        />
                        {errors.limit && <p className={errorCls}>{errors.limit}</p>}
                    </div>
                </section>

                {/* Image */}
                <section className="space-y-3">
                    <h2 className="text-base font-bold text-wondergreen uppercase tracking-wide border-b border-gray-200 pb-2">
                        Program Image (optional)
                    </h2>

                    <div>
                        <label className={labelCls}>Upload image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
                            className="block w-full text-sm text-gray-700"
                        />
                    </div>

                    <div>
                        <label className={labelCls}>— or paste an image URL</label>
                        <input
                            name="image"
                            value={form.image ?? ''}
                            onChange={handleChange}
                            className={inputCls}
                            placeholder="https://…"
                        />
                    </div>
                </section>

                {serverError && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                        {serverError}
                    </p>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-wondergreen px-6 py-3 text-white font-bold uppercase tracking-wide text-sm hover:bg-wonderleaf transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting
                            ? isPartner
                                ? 'Submitting…'
                                : 'Creating…'
                            : isPartner
                                ? 'Submit for Review'
                                : 'Create Program'}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/events')}
                        className="text-gray-600 font-medium hover:text-gray-900 underline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
