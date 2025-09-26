'use client';

import { useEffect, useRef, useState } from 'react';
import { makeApiRequest } from '../../../utils/api';
import type { VolunteerCreate, AvailabilityDay } from '@/types/volunteer';
import { isLoggedIn } from '../../../utils/auth';
import { formatUs, toE164US } from '../../../utils/formatPhoneNumber';
import MultiSelect from '@/components/common/MultiSelect';
import { CITIES_CO } from '@/data/citiesCO';
import { useModal } from '@/app/context/modal';
import LoginModal from '@/components/login/LoginModal';
import SignupModal from '@/components/signup/SignupModal';
import { API } from '../../../utils/api';
import { Err } from '@/types/errors';

import {
  isGeneralSubmitted,
  markGeneralSubmitted,
  isOppSubmitted,
  markOppSubmitted,
} from './volunteerLocks';

const TIME_OPTIONS = ['Mornings', 'Afternoons', 'Evenings'] as const;

const initial = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  selectedCities: [] as string[],
  timesChoices: [] as string[],
  skillsLine: '',
  daysAvail: [] as AvailabilityDay[],
  bio: '',
  photoConsent: false,
  backgroundCheckConsent: false,
};

export default function VolunteerForm({
  opportunityId,
  roleTitle,
  onDone,
}: {
  opportunityId?: string;
  roleTitle?: string;
  onDone?: () => void;
}) {
  const [f, setF] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // client-only flags
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  const logged = client && isLoggedIn();

  // general one-time lock
  const [lockedGeneral, setLockedGeneral] = useState(false);
  useEffect(() => {
    if (client && logged) setLockedGeneral(isGeneralSubmitted());
  }, [client, logged]);

  // already applied to this specific opp?
  const oppLocked = client && opportunityId ? isOppSubmitted(opportunityId) : false;

  const disabled =
    !logged ||
    submitting ||
    (!opportunityId && lockedGeneral) ||
    (Boolean(opportunityId) && oppLocked);

  const { setModalContent } = useModal();
  const firstNameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (logged && !disabled) firstNameRef.current?.focus();
  }, [logged, disabled]);

  // helpers
  const toggleDay = (d: AvailabilityDay) =>
    setF(v => ({
      ...v,
      daysAvail: v.daysAvail.includes(d)
        ? v.daysAvail.filter(x => x !== d)
        : [...v.daysAvail, d],
    }));

  const toggleTime = (t: (typeof TIME_OPTIONS)[number]) =>
    setF(v => ({
      ...v,
      timesChoices: v.timesChoices.includes(t)
        ? v.timesChoices.filter(x => x !== t)
        : [...v.timesChoices, t],
    }));

  const selectAllTimes = () =>
    setF(v => ({
      ...v,
      timesChoices:
        v.timesChoices.length === TIME_OPTIONS.length ? [] : [...TIME_OPTIONS],
    }));

  // submit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(false);
    setOkMsg(null);

    // basic validation
    if (!f.firstName.trim() || !f.lastName.trim())
      return setError('Please provide first and last name.');
    if (!f.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
      return setError('Please provide a valid email address.');
    const e164 = toE164US(f.phoneNumber);
    if (!e164) return setError('Please enter a valid 10-digit US phone number.');
    if (!f.photoConsent || !f.backgroundCheckConsent)
      return setError('Photo and background check consents are required.');

    setSubmitting(true);
    try {
      const isRole = Boolean(opportunityId);
      const url = isRole ? `${API}/volunteer/${opportunityId}` : `${API}/volunteer/`;

      await makeApiRequest<{ volunteer: VolunteerCreate }>(url, {
        method: 'POST',
        body: {
          firstName: f.firstName.trim(),
          lastName: f.lastName.trim(),
          email: f.email.trim() || undefined,
          phoneNumber: e164,
          cities: f.selectedCities,
          daysAvail: f.daysAvail,
          timesAvail: f.timesChoices,
          skills: f.skillsLine.split(',').map(x => x.trim()).filter(Boolean),
          bio: f.bio.trim() || undefined,
          photoConsent: f.photoConsent,
          backgroundCheckConsent: f.backgroundCheckConsent,
        } satisfies VolunteerCreate,
      });

      if (isRole) {
        if (opportunityId) markOppSubmitted(opportunityId);
        setOk(true);
        setOkMsg(`Thank you! Your application for “${roleTitle ?? 'this role'}” was submitted. We will contact you within 2–3 business days.`);
        setError(null);
        onDone?.();
      } else {
        // General application 
        markGeneralSubmitted();
        setLockedGeneral(true);
        setOk(true);
        setOkMsg('Thank you! Your volunteer application was submitted. We will contact you within 2–3 business days.');
        setError(null);
      }

      setF(initial);
      requestAnimationFrame(() => {
        document.getElementById('volunteer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (err) {
      throw new Error(`Unable to create volunteer: ${err}`)
      //   const code = String(err?.status || err?.response?.status || '');
      //   const detail: string =
      //     (typeof err === 'string' && err) ||
      //     err?.detail ||
      //     err?.message ||
      //     err?.response?.data?.detail ||
      //     err?.response?.data?.message ||
      //     '';

      //   if (code === '401') {
      //     try {
      //       localStorage.removeItem('access_token');
      //       localStorage.removeItem('token');
      //     } catch { }
      //     setModalContent(<LoginModal />);
      //     setError('Please log in to apply as a volunteer.');
      //     return;
      //   }

      //   if (opportunityId) {
      //     if (code === '409' || /already applied to this opportunity/i.test(detail)) {
      //       markOppSubmitted(opportunityId);
      //       setOk(true);
      //       setError(null);
      //       setOkMsg(`You already applied to “${roleTitle ?? 'this role'}”.`);
      //       onDone?.();
      //       return;
      //     }
      //     if (code === '404') {
      //       setError('This opportunity no longer exists.');
      //       return;
      //     }
      //   } else {
      //     if (/already registered as a volunteer/i.test(detail)) {
      //       markGeneralSubmitted();
      //       setLockedGeneral(true);
      //       setOk(true);
      //       setOkMsg('You have already submitted a volunteer application. Thank you!');
      //       setError(null);
      //       return;
      //     }
      //   }

      //   setError(detail || 'Failed to submit application.');
      // } 
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="volunteer" className="mx-auto max-w-3xl scroll-mt-24">
      {/* Header */}
      {opportunityId ? (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
          Applying for: <span className="font-medium">{roleTitle ?? 'Selected role'}</span>
        </div>
      ) : null}

      <div className="mb-6 text-center">
        <p className="mt-2 text-slate-600">
          Tell us a bit about yourself and your availability — we'll match you with a good fit.
        </p>
        <div className="mt-4 rounded-xl">
          Wonderhood team will reach out within <span className="font-medium">2–3 business days</span>.
        </div>
      </div>

      {/* Login prompt for guests */}
      {client && !logged && (
        <div
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900"
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
        >
          <p className="font-medium">Please log in to apply as a volunteer.</p>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onMouseDown={e => e.stopPropagation()}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                requestAnimationFrame(() => setModalContent(<LoginModal />));
              }}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
            >
              Log in
            </button>
            <button
              type="button"
              onMouseDown={e => e.stopPropagation()}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                requestAnimationFrame(() => setModalContent(<SignupModal />));
              }}
              className="rounded-lg border border-emerald-600 px-4 py-2 text-emerald-700 hover:bg-emerald-50"
            >
              Sign up
            </button>
          </div>
        </div>
      )}

      {/* Locks banners */}
      {!opportunityId && logged && lockedGeneral && !ok && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
          You have already submitted a volunteer application. Thank you!
        </div>
      )}
      {opportunityId && logged && oppLocked && !ok && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
          You already applied to this role.
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
        <fieldset disabled={disabled} aria-disabled={disabled} className={disabled ? 'opacity-60' : ''}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                First name <span className="text-rose-600">*</span>
              </label>
              <input
                ref={firstNameRef}
                className="w-full rounded-lg border px-3 py-2"
                value={f.firstName}
                onChange={e => setF({ ...f, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Last name <span className="text-rose-600">*</span>
              </label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={f.lastName}
                onChange={e => setF({ ...f, lastName: e.target.value })}
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
                value={f.email}
                onChange={e => setF({ ...f, email: e.target.value })}
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
                value={f.phoneNumber}
                onChange={e => setF({ ...f, phoneNumber: formatUs(e.target.value) })}
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
                options={CITIES_CO as unknown as string[]}
                value={f.selectedCities}
                onChange={next => setF({ ...f, selectedCities: next })}
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
                  {f.timesChoices.length === TIME_OPTIONS.length ? 'Clear all' : 'Select all'}
                </button>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
                {TIME_OPTIONS.map(t => (
                  <label key={t} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={f.timesChoices.includes(t)}
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
            <label className="block text-sm font-medium">Availability (days)</label>
            <div className="flex gap-6 text-sm">
              {(['Weekdays', 'Weekends'] as AvailabilityDay[]).map(d => (
                <label key={d} className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={f.daysAvail.includes(d)} onChange={() => toggleDay(d)} />
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
              placeholder="hiking, photography"
              className="w-full rounded-lg border px-3 py-2.5"
              value={f.skillsLine}
              onChange={e => setF({ ...f, skillsLine: e.target.value })}
              required
            />
          </div>

          {/* Short bio */}
          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium">Short bio (optional)</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border px-3 py-2"
              value={f.bio}
              onChange={e => setF({ ...f, bio: e.target.value })}
            />
          </div>

          {/* Consents */}
          <div className="space-y-3 mt-4">
            <label className="block text-sm font-medium">
              Consents <span className="text-rose-600">*</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={f.photoConsent}
                onChange={e => setF({ ...f, photoConsent: e.target.checked })}
                required
              />
              <span className="text-sm">I consent to photos/videos (Photo Policy).</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={f.backgroundCheckConsent}
                onChange={e => setF({ ...f, backgroundCheckConsent: e.target.checked })}
                required
              />
              <span className="text-sm">I consent to a background check (18+).</span>
            </label>
          </div>

          {/* Success / Error */}
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-800">
              {error}
            </div>
          )}
          {ok && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
              <p>
                {okMsg ??
                  "Thank you for applying! We've received your information and will contact you within 2–3 business days."}
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
          <div
            className="mt-6 flex justify-center sm:justify-end"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <button
              type="submit"
              disabled={disabled}
              className="w-full sm:w-auto min-h-11 rounded-xl bg-emerald-600 px-5 py-2.5 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit application'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
