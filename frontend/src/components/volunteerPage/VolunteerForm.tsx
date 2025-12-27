'use client';

import { useEffect, useState } from 'react';
import type { VolunteerCreate } from '@/types/volunteer';
import { isLoggedIn } from '../../../utils/auth';
import { toE164US } from '../../../utils/formatPhoneNumber';
import { useModal } from '@/context/modal';
import LoginModal from '@/components/login/LoginModal';
import SignupModal from '@/components/signup/SignupModal';
import { API, makeApiRequest } from '../../../utils/api';
import { isGeneralSubmitted, markGeneralSubmitted, isOppSubmitted, markOppSubmitted } from './volunteerHelpers';
import VolunteerFormContent from './VolunteerFormContent';
import SuccessPopup from '@/components/feedback/SuccessPopup';

// Initial client-side form state
const initial: VolunteerCreate = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  cities: [],
  daysAvail: [],
  timesAvail: [],
  skills: [],
  bio: '',
  photoConsent: false,
  backgroundCheckConsent: false,
};

export default function VolunteerForm({ opportunityId, roleTitle, onDone }: {
  opportunityId?: string;
  roleTitle?: string;
  onDone?: () => void;
}) {
  const [form, setForm] = useState<VolunteerCreate>(initial);
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
  const oppLocked = client && !!opportunityId && isOppSubmitted(opportunityId);

  const disabled =
    !logged || submitting || (!opportunityId && lockedGeneral) || (Boolean(opportunityId) && oppLocked);

  const { setModalContent } = useModal();

  // helpers to patch state
  const onChange = (patch: Partial<VolunteerCreate>) =>
    setForm(prev => ({ ...prev, ...patch }));


  // submit
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setOk(false);
    setOkMsg(null);

    // validation
    if (!form.firstName.trim() || !form.lastName.trim())
      return setError('Please provide first and last name.');
    if (!form.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return setError('Please provide a valid email address.');
    const e164 = toE164US(form.phoneNumber || '');
    if (!e164) return setError('Please enter a valid 10-digit US phone number.');
    if (!form.photoConsent || !form.backgroundCheckConsent)
      return setError('Photo and background check consents are required.');

    setSubmitting(true);
    try {
      const url = opportunityId ? `${API}/volunteer/${opportunityId}` : `${API}/volunteer/`;
      const isRole = Boolean(opportunityId);

      await makeApiRequest<{ volunteer: VolunteerCreate }>(url, {
        method: 'POST',
        body: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim() || undefined,
          phoneNumber: e164,
          cities: form.cities,
          daysAvail: form.daysAvail,
          timesAvail: form.timesAvail ?? [],
          skills: form.skills,
          bio: form.bio?.trim() || undefined,
          photoConsent: form.photoConsent,
          backgroundCheckConsent: form.backgroundCheckConsent,
        } satisfies VolunteerCreate,
      });

      if (isRole) {
        if (opportunityId) markOppSubmitted(opportunityId);
        const msg = `Thank you! Your application for “${roleTitle ?? 'this role'}” was submitted. We will contact you within 2-3 business days.`;
        setOk(true);
        setOkMsg(`Thank you! Your application for “${roleTitle ?? 'this role'}” was submitted. We will contact you within 2-3 business days.`);
        setError(null);
        setModalContent(
          <SuccessPopup
            title="Application sent 🎉"
            message={msg}
            ctaLabel="Back to opportunities"
            ctaHref="#opportunities"
            onClose={() => setModalContent(null)}
          />
    );
        onDone?.();
      } else {
        markGeneralSubmitted();
        setLockedGeneral(true);
        const msg = 'Thank you! Your volunteer application was submitted. We will contact you within 2-3 business days.';
        setOk(true);
        setOkMsg('Thank you! Your volunteer application was submitted. We will contact you within 2-3 business days.');
        setError(null);
        setModalContent(
          <SuccessPopup
            title="Thank you for volunteering! 🌿"
            message={msg}
            ctaLabel="Back to opportunities"
            ctaHref="#opportunities"
            onClose={() => setModalContent(null)}
          />
        );
      }

      setForm(initial);
      requestAnimationFrame(() => {
        document.getElementById('volunteer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (err: unknown) {
      const code =
        typeof err === 'object' && err !== null
          ? String((err as { status?: number; response?: { status?: number } }).status ??
              (err as { response?: { status?: number } }).response?.status ??
              '')
          : '';

      const detail =
        typeof err === 'string'
          ? err
          : err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null
          ? String(
              (err as { detail?: unknown; message?: unknown; response?: { data?: { detail?: unknown; message?: unknown } } }).detail ??
                (err as { message?: unknown }).message ??
                (err as { response?: { data?: { detail?: unknown; message?: unknown } } }).response?.data?.detail ??
                (err as { response?: { data?: { detail?: unknown; message?: unknown } } }).response?.data?.message ??
                ''
            )
          : '';

      if (code === '401') {
        try {
          localStorage.removeItem('access_token');
          localStorage.removeItem('token');
        } catch {}
        setModalContent(<LoginModal />);
        setError('Please log in to apply as a volunteer.');
        return;
      }

      if (opportunityId) {
        if (code === '409' || /already applied to this opportunity/i.test(detail)) {
          if (opportunityId) markOppSubmitted(opportunityId);
          setOk(true);
          setError(null);
          setOkMsg(`You already applied to “${roleTitle ?? 'this role'}”.`);
          onDone?.();
          return;
        }
        if (code === '404') {
          setError('This opportunity no longer exists.');
          return;
        }
      } else {
        if (/already registered as a volunteer/i.test(detail)) {
          markGeneralSubmitted();
          setLockedGeneral(true);
          setOk(true);
          setOkMsg('You have already submitted a volunteer application. Thank you!');
          setError(null);
          return;
        }
      }

      setError(detail || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  const oppLockedBanner = client && opportunityId && isOppSubmitted(opportunityId);

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
          Tell us a bit about yourself and your availability — we&apos;ll match you with a good fit.
        </p>
        <div className="mt-4 rounded-xl">
          WonderHood team will reach out within <span className="font-medium">2-3 business days</span>.
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
      {opportunityId && logged && oppLockedBanner && !ok && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
          You already applied to this role.
        </div>
      )}

      <VolunteerFormContent
        form={form}
        disabled={disabled}
        opportunityId={opportunityId}
        ok={ok}
        okMsg={okMsg}
        error={error}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
