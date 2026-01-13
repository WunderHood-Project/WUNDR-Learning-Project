'use client';

import { useModal } from '@/context/modal';
import LoginModal from '@/components/login/LoginModal';
import VolunteerForm from './VolunteerForm';
import { useEffect, useRef, useState } from 'react';
import { API, makeApiRequest } from '../../../utils/api';
import { markOppSubmitted, isOppSubmitted } from './volunteerHelpers';
import type { Opp, Venue } from '../../types/opportunity';
import { useAuth } from '@/context/auth';
// import { useUser } from '../../../hooks/useUser';

export default function Opportunities({
  onApply,
}: {
  onApply?: (roleTitle?: string, opportunityId?: string) => void;
}) {
  const { setModalContent, closeModal } = useModal();
  const { isLoggedIn, token } = useAuth();
  // const { user } = useUser()
  const fetched = useRef(false);

  const [items, setItems] = useState<Opp[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await makeApiRequest<{ opportunities: Opp[] }>(`${API}/opportunities/public`);
        setItems(res.opportunities ?? []);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);


  useEffect(() => {
    if (!isLoggedIn || !token || fetched.current) return;

    let cancelled = false;
    (async () => {
      try {
        // if (user) {
        const res = await makeApiRequest<{ opportunityIds?: string[] }>(`${API}/volunteer/my-opportunities`, { token });
        if (cancelled) return;
        (res.opportunityIds ?? []).forEach(id => markOppSubmitted(id));
        fetched.current = true;
        // }
      } catch {
        fetched.current = true;
      }
    })();

    return () => { cancelled = true; };
  }, [isLoggedIn, token]);

  const goToGeneralForm = () => (window.location.hash = 'apply');

  const envLabel = (venue: Venue[]) => {
    const hasIn = venue.includes('Indoors');
    const hasOut = venue.includes('Outdoors');
    const hasOn = venue.includes('Online');
    if (hasIn && hasOut) return 'Indoor/Outdoor';
    if (hasIn && hasOn) return 'Indoor/Online';
    if (hasIn) return 'Indoor';
    if (hasOut) return 'Outdoor';
    return 'Online';
  };

  const openApply = (oppId: string, title: string) => {
    if (onApply) return onApply(title, oppId);
    if (!isLoggedIn) return setModalContent(<LoginModal />);
    setModalContent(
      <div className="max-w-3xl">
        <VolunteerForm key={oppId} opportunityId={oppId} roleTitle={title} onDone={closeModal} />
      </div>
    );
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-2">
      <header className="text-center mb-8">
        <p className="mt-3 text-sm md:text-lg text-gray-700">
          Want to get involved? Tell us your skills - we&apos;ll find a good fit.
        </p>
        <p className="mt-2 text-xs md:text-sm text-gray-600">
          In the application, please include availability and desired location.
        </p>
      </header>

      {/* Volunteer Hours */}
      <section className="mb-8 sm:mb-10">
        <div className="group rounded-xl border-2 border-wondergreen/20 bg-white p-4 sm:p-6 shadow-lg">
          <div className="mb-2 flex items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-wondergreen to-wonderleaf transition-transform duration-300 group-hover:scale-110">
              <span className="text-lg sm:text-xl font-bold text-white">🌟</span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-wondergreen">
              Become a WonderTeen Volunteer (Ages 12-17)
            </h3>
          </div>
          <p className="text-sm sm:text-base md:max-w-4xl text-gray-700">
            Earn service hours, develop leadership skills, and make a difference. All under staff supervision, WonderTeen volunteers help at events, assist instructors, and support younger learners.
            <span className="block mt-2">Want to join? Email us at {" "}
              <a
                href="mailto:info@whproject.org"
                rel="noopener noreferrer"
                className="underline transition-colors duration-200 text-wonderleaf hover:text-wondergreen"
              >
                info@whproject.org
              </a>
              .
            </span>
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
        {loaded && items.length === 0 ? (
          <div className="col-span-full flex justify-center">
            <article className="w-full max-w-xl rounded-2xl bg-white border border-wonderleaf/20 p-6 text-center shadow-sm">
              <h3 className="text-base md:text-xl font-semibold text-gray-900">No open opportunities right now</h3>
              <p className="mt-2 text-gray-700 text-sm md:text-lg">
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
          items.map(r => {
            const applied = isLoggedIn && isOppSubmitted(r.id);
            return (
              <article
                key={r.id}
                data-applied={applied ? 'true' : 'false'}
                className={`h-full flex flex-col rounded-2xl bg-white border p-5 shadow-sm hover:shadow transition border-wonderleaf/20 ${applied ? 'opacity-75 ring-1 ring-emerald-200' : ''
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-semibold text-wondergreen">{r.title}</h3>
                  <div className="flex items-center gap-2">
                    {applied && (
                      <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Applied
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 rounded-full bg-wondersun text-gray-700 shrink-0">{envLabel(r.venue)}</span>
                  </div>
                </div>

                {r.tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {r.tags.map(t => (
                      <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-wondergreen/10 text-wondergreen">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 grid sm:grid-cols-2 gap-4">
                  <div className="min-h-[190px] md:min-h-[210px]">
                    <h4 className="font-medium text-gray-900 mb-1">What you&apos;ll do</h4>
                    <ul className="list-disc pl-5 text-gray-700 text-sm leading-relaxed space-y-2">
                      {r.duties.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="min-h-[190px] md:min-h-[210px]">
                    <h4 className="font-medium text-gray-900 mb-1">Good fit</h4>
                    <ul className="list-disc pl-5 text-gray-700 text-sm leading-relaxed space-y-2">
                      {r.skills.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-5 rounded-lg bg-wondersun/10 border border-wondersun/30 p-3 text-sm text-gray-800">
                  <p>
                    <span className="font-semibold text-wondergreen">Time:</span> {r.time}
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-wondergreen">Requirements:</span> {r.requirements.join(' · ')}
                  </p>
                </div>

                <div className="mt-auto pt-4 flex items-center gap-3 border-t border-wonderleaf/20">
                  <button
                    onClick={() => openApply(r.id, r.title)}
                    disabled={applied}
                    className={`px-5 py-2.5 rounded-lg text-white transition-colors ${applied ? 'bg-gray-300 cursor-not-allowed' : 'bg-wondergreen hover:bg-wonderleaf'
                      }`}
                  >
                    {applied ? 'Applied' : 'Apply for this role'}
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
