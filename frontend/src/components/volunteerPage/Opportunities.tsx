'use client';

import { useModal } from '@/app/context/modal';
// import { isLoggedIn } from '../../../utils/auth';
import LoginModal from '@/components/login/LoginModal';
import VolunteerForm from './VolunteerForm';
import { useEffect, useRef, useState } from 'react';
import {API, makeApiRequest } from '../../../utils/api';
import { markOppSubmitted, isOppSubmitted } from './volunteerHelpers';
import { Opp, Venue } from "../../types/opportunity"
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

type ErrLike = { status?: number; response?: { status?: number }; body?: unknown };
const statusOf = (e: unknown) =>
  (e as ErrLike)?.status ?? (e as ErrLike)?.response?.status ?? 0;

// const ALSO_HELPFUL = [
//   { title: 'Fundraising / Grants (Online)', blurb: 'Find mini-grants and draft simple applications.' },
//   { title: 'Community Outreach (Indoor/Online)', blurb: 'Connect with libraries, museums, parks, schools.' },
//   { title: 'Equipment Manager (Indoor)', blurb: 'Track and prep kits/materials for programs.' },
// ];

export default function Opportunities({onApply}: {
  onApply?: (roleTitle?: string, opportunityId?: string) => void;
}) {
  
  const { setModalContent, closeModal } = useModal();

  // Client-only flags
  const [hydrated, setHydrated] = useState(false);
  const [logged, setLogged] = useState(false);
  const fetched = useRef(false); // guard against StrictMode double-run

  // Data
  const [items, setItems] = useState<Opp[]>([]);
  const [loaded, setLoaded] = useState(false); // "loaded" ensures we don't flash the placeholder before fetch completes

  const goToGeneralForm = () => window.location.hash = 'apply';

  useEffect(() => {
    (async () => {
      try {
        const res = await makeApiRequest<{ opportunities: Opp[] }>(
          `${API}/opportunities/public`,
          { method: 'GET' }
        );
        setItems(res.opportunities ?? []);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const envLabel = (venue: Venue[]) => {
    const hasIn = venue.includes('Indoors');
    const hasOut = venue.includes('Outdoors');
    const hasOn = venue.includes('Online');
    if (hasIn && hasOut) return 'Indoor/Outdoor';
    if (hasIn && hasOn)  return 'Indoor/Online';
    if (hasIn) return 'Indoor';
    if (hasOut) return 'Outdoor';
    return 'Online';
  };

  // useEffect(() => {
  //   setHydrated(true);
  //   setLogged(isLoggedIn());
  // }, []);


  const [authChecked, setAuthChecked] = useState(false);
    useEffect(() => {
      setHydrated(true);
      (async () => {
        try {
          await makeApiRequest(`${API}/auth/users/me`, { method: 'GET' }); 
          setLogged(true);
        } catch {
          setLogged(false);
        } finally {
          setAuthChecked(true);
        }
      })();
    }, []);


  useEffect(() => {
    if (!hydrated || !authChecked || !logged || fetched.current) return;

    let cancelled = false;

    const run = async () => {
      try {
        const res = await makeApiRequest<{ opportunityIds?: string[] }>(
          `${API}/volunteer/my-opportunities`,
          { method: 'GET' }
        );
        if (cancelled) return;
        (res.opportunityIds ?? []).forEach(id => markOppSubmitted(id));
        fetched.current = true; 
      } catch (e: unknown) {
        const status = statusOf(e);
          if(!cancelled && (status === 401 || status === 404 )) {
            setTimeout(() => { if (!cancelled && !fetched.current) run(); }, 600);
            return;
          }
          fetched.current = true; 
        }
      }

    run();
    return () => { cancelled = true; };
  }, [hydrated, authChecked, logged]);


  const openApply = (oppId: string, title: string) => {
    if (onApply) return onApply(title, oppId);
    if (!logged) return setModalContent(<LoginModal />);
    setModalContent(
      <div className="max-w-3xl">
        <VolunteerForm key={oppId} opportunityId={oppId} roleTitle={title} onDone={closeModal} />
      </div>
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-2">
      <header className="text-center mb-8">
        <p className="mt-3 text-lg text-gray-700">
          We&apos;re building a small team of caring helpers. Pick a role or tell us your skills —
          we&apos;ll find a good fit (one-time or ongoing).
        </p>
        <p className="mt-2 text-sm text-gray-600">
          In the application, please include your cities and availability (weekdays/weekends, morning/afternoon/evening).
        </p>
      </header>

      {/* Grid of opportunity cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        {loaded && items.length === 0 ? (
          <div className="col-span-full flex justify-center">
            <article className="w-full max-w-xl rounded-2xl bg-white border border-wonderleaf/20 p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                No open opportunities right now
              </h3>
              <p className="mt-2 text-gray-700">
                You can still apply as a volunteer — we&apos;ll contact you when there&apos;s a good fit.
                Thank you for your willingness to help!
              </p>
              <button
                type="button"
                onClick={goToGeneralForm}
                className="inline-flex mt-4 items-center justify-center px-4 py-2 rounded-lg bg-wondergreen text-white font-semibold hover:bg-wonderleaf transition"
              >
                Apply to Volunteer
              </button>
            </article>
          </div>
        ) : (

          items.map((r) => {
            // If the user already applied to this opportunity, card is visually muted & action disabled
            const applied = logged && hydrated && isOppSubmitted(r.id);
            return (
              <article
                key={r.id}
                data-applied={applied ? 'true' : 'false'}
                className={`h-full flex flex-col rounded-2xl bg-white border p-5 shadow-sm hover:shadow transition border-wonderleaf/20
                  ${applied ? 'opacity-75 ring-1 ring-emerald-200' : ''}`}
              >

                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold text-wondergreen">{r.title}</h3>
                  <div className="flex items-center gap-2">
                    {applied && (
                      <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Applied
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 rounded-full bg-wondersun text-gray-700 shrink-0">
                      {envLabel(r.venue)}
                    </span>
                  </div>
                </div>

                {r.tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-1 rounded-full bg-wondergreen/10 text-wondergreen"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 grid sm:grid-cols-2 gap-4">
                  <div className="min-h-[190px] md:min-h-[210px]">
                    <h4 className="font-medium text-gray-900 mb-1">What you&apos;ll do</h4>
                    <ul className="list-disc pl-5 text-gray-700 text-sm leading-relaxed space-y-2">
                      {r.duties.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                  <div className="min-h-[190px] md:min-h-[210px]">
                    <h4 className="font-medium text-gray-900 mb-1">Good fit</h4>
                    <ul className="list-disc pl-5 text-gray-700 text-sm leading-relaxed space-y-2">
                      {r.skills.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 rounded-lg bg-wondersun/10 border border-wondersun/30 p-3 text-sm text-gray-800">
                  <p><span className="font-semibold text-wondergreen">Time:</span> {r.time}</p>
                  <p className="mt-1"><span className="font-semibold text-wondergreen">Requirements:</span> {r.requirements.join(' · ')}</p>
                </div>

                <div className="mt-auto pt-4 flex items-center gap-3 border-t border-wonderleaf/20">
                  <button
                    onClick={() => openApply(r.id, r.title)}
                    disabled={applied}
                    className={`px-5 py-2.5 rounded-lg text-white transition-colors
                      ${applied ? 'bg-gray-300 cursor-not-allowed' : 'bg-wondergreen hover:bg-wonderleaf'}`}
                  >
                    {applied ? 'Applied' : 'Apply for this role'}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* <div className="mt-8 rounded-2xl bg-white border border-wonderleaf/20 p-5">
        <h3 className="text-lg font-semibold text-wondergreen mb-2">Also helpful</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          {ALSO_HELPFUL.map(x => (
            <li key={x.title}>
              <b>{x.title}:</b> {x.blurb}
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <Link
            href="#apply"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-wondergreen text-white font-semibold hover:bg-wonderleaf transition"
          >
            Apply to Volunteer
          </Link>
        </div>
      </div> */}
    </section>
  );
}
