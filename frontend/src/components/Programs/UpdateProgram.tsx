'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { makeApiRequest, determineEnv } from '../../../utils/api';
import { useActivity } from '../../../hooks/useActivity';
import { useProgram } from '../../../hooks/useProgram';
import { ymdToIsoNoShift, isoToYMD } from '../../../utils/formatDate';
import { compressImage } from '../../../utils/image/compressImage';
import type { UpdateProgramPayload, ProgramFormErrors } from '@/types/program';

const WONDERHOOD_URL = determineEnv();

export default function UpdateProgram() {
  const router = useRouter();
  const { programId } = useParams() as { programId: string };
  const { program, loading, error } = useProgram(programId);
  const { activities } = useActivity();

  const [form, setForm] = useState<UpdateProgramPayload>({});
  // const [phases, setPhases] = useState<ProgramPhase[]>([]);
  const [errors, setErrors] = useState<ProgramFormErrors>({});
  const [outcomeInput, setOutcomeInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Populate form once program is loaded
  useEffect(() => {
    if (!program) return;
    setForm({
      activityId: program.activityId ?? '',
      name: program.name,
      description: program.description,
      ageMin: program.ageMin,
      ageMax: program.ageMax,
      startDate: isoToYMD(program.startDate),
      endDate: isoToYMD(program.endDate),
      sessionSchedule: program.sessionSchedule ?? '',
      image: program.image ?? '',
      outcomes: program.outcomes ?? [],
      label: program.label,
      directorName: program.directorName ?? '',
      directorTitle: program.directorTitle ?? '',
      directorImage: program.directorImage ?? '',
      limit: program.limit ?? null,
      venue: program.venue,
      city: program.city ?? '',
      state: program.state ?? '',
      address: program.address ?? '',
      zipCode: program.zipCode ?? '',
    });
    // setPhases(program.phases ?? []);
  }, [program]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'limit') {
      setForm((prev) => ({ ...prev, limit: value === '' ? null : parseInt(value, 10) }));
      return;
    }
    if (name === 'ageMin' || name === 'ageMax') {
      setForm((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
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

  // const addPhase = () => setPhases((prev) => [...prev, { season: '', title: '' }]);

  // const updatePhase = (i: number, field: keyof ProgramPhase, value: string) =>
  //   setPhases((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));

  // const removePhase = (i: number) =>
  //   setPhases((prev) => prev.filter((_, idx) => idx !== i));

  const validate = (): boolean => {
    const errs: ProgramFormErrors = {};
    if (!form.name?.trim()) errs.name = 'Name is required.';
    if (!form.description?.trim()) errs.description = 'Description is required.';
    if (form.startDate && form.endDate && form.startDate > form.endDate)
      errs.endDate = 'End date must be after start date.';
    if (form.ageMin !== undefined && form.ageMax !== undefined && form.ageMax < form.ageMin)
      errs.ageMax = 'Max age must be ≥ min age.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);
    setSuccessMsg(null);

    // const validPhases = phases.filter((p) => p.season.trim() && p.title.trim());

    const payload: UpdateProgramPayload = {
      ...form,
      startDate: form.startDate ? ymdToIsoNoShift(form.startDate as string) : undefined,
      endDate: form.endDate ? ymdToIsoNoShift(form.endDate as string) : undefined,
      // phases: validPhases.length > 0 ? validPhases : undefined,
      sessionSchedule: form.sessionSchedule || undefined,
      directorName: form.directorName || undefined,
      directorTitle: form.directorTitle,
      directorImage: form.directorImage || undefined,
      image: form.image || undefined,
      limit: form.limit ?? undefined,
      city: form.city || undefined,
      state: form.state || undefined,
      address: form.address || undefined,
      zipCode: form.zipCode || undefined,
    };

    try {
      await makeApiRequest(`${WONDERHOOD_URL}/program/${programId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });
      setSuccessMsg('Program updated successfully!');
      setTimeout(() => router.push(`/programs/${programId}`), 1200);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to update program.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wondergreen/40';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1';
  const errorCls = 'text-xs text-red-600 mt-1';

  if (loading)
    return <div className="min-h-[40vh] grid place-items-center text-gray-600">Loading…</div>;
  if (error)
    return (
      <div className="min-h-[40vh] grid place-items-center text-red-600">Error: {error}</div>
    );

  return (
    <div className="bg-wonderbg min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-wondergreen mb-6">Update Program</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/60 rounded-2xl border border-white/60 backdrop-blur-sm p-6 sm:p-8 space-y-6 shadow-md"
        >
          {/* Basic info */}
          <section className="space-y-4">
            <h2 className="text-base font-bold text-wondergreen uppercase tracking-wide border-b border-gray-200 pb-2">
              Basic Information
            </h2>

            <div>
              <label className={labelCls}>Program Name *</label>
              <input
                name="name"
                value={form.name ?? ''}
                onChange={handleChange}
                className={inputCls}
              />
              {errors.name && <p className={errorCls}>{errors.name}</p>}
            </div>

            <div>
              <label className={labelCls}>Activity</label>
              <select
                name="activityId"
                value={form.activityId ?? ''}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select an activity…</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Description *</label>
              <textarea
                name="description"
                value={form.description ?? ''}
                onChange={handleChange}
                rows={4}
                className={inputCls}
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
                <label className={labelCls}>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate as string ?? ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate as string ?? ''}
                  onChange={handleChange}
                  className={inputCls}
                />
                {errors.endDate && <p className={errorCls}>{errors.endDate}</p>}
              </div>
            </div>

            <div>
              <label className={labelCls}>Session Schedule</label>
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
                <label className={labelCls}>Min Age</label>
                <input
                  type="number"
                  name="ageMin"
                  value={form.ageMin ?? 0}
                  min={0}
                  max={18}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Max Age</label>
                <input
                  type="number"
                  name="ageMax"
                  value={form.ageMax ?? 18}
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
              Program Phases
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
              Program Lead
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Program Lead Name</label>
                <input
                  name="directorName"
                  value={form.directorName ?? ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Role (optional)</label>
                <input
                  name="directorTitle"
                  value={form.directorTitle ?? ''}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
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
              <select name="venue" value={form.venue ?? 'in_person'} onChange={handleChange} className={inputCls}>
                <option value="in_person">In-Person</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {form.venue !== 'online' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Address</label>
                  <input name="address" value={form.address ?? ''} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>City</label>
                  <input name="city" value={form.city ?? ''} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>State</label>
                  <input name="state" value={form.state ?? ''} onChange={handleChange} className={inputCls} maxLength={2} />
                </div>
                <div>
                  <label className={labelCls}>Zip Code</label>
                  <input name="zipCode" value={form.zipCode ?? ''} onChange={handleChange} className={inputCls} />
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
            </div>
          </section>

          {/* Image */}
          <section className="space-y-3">
            <h2 className="text-base font-bold text-wondergreen uppercase tracking-wide border-b border-gray-200 pb-2">
              Program Image
            </h2>

            <div>
              <label className={labelCls}>Upload new image</label>
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

          {/* Label */}
          <div>
            <label className={labelCls}>Label</label>
            <select name="label" value={form.label ?? 'wonderhood'} onChange={handleChange} className={inputCls}>
              <option value="wonderhood">WonderHood</option>
              <option value="partner">Partner</option>
            </select>
          </div>

          {serverError && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {serverError}
            </div>
          )}

          {successMsg && (
            <div className="rounded-lg bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm font-semibold">
              {successMsg}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-wondergreen px-6 py-3 text-white font-bold uppercase tracking-wide text-sm hover:bg-wonderleaf transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="text-gray-600 font-medium hover:text-gray-900 underline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
