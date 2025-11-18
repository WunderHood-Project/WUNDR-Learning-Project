'use client';

import { useEffect, useState } from 'react';
import HeroVolunteer from './Hero';
import Opportunities from './Opportunities';
import VolunteerForm from './VolunteerForm';
import { useModal } from '@/context/modal';

type TabKey = 'opps' | 'form';
const hashToTab = (h: string): TabKey =>
  h === 'apply' || h === 'form' || h === 'volunteer' ? 'form' : 'opps';

export default function Volunteer() {
  const [tab, setTab] = useState<TabKey>('opps');
  const [mounted, setMounted] = useState(false);
  const { closeModal } = useModal();

  const [selected, setSelected] = useState<{ id?: string; title?: string }>({});

  useEffect(() => {
    setMounted(true);
    const setFromHash = () => {
      const h = window.location.hash.slice(1).toLowerCase();
      const t = hashToTab(h);
      setTab(t);
    };
    setFromHash();
    window.addEventListener('hashchange', setFromHash);
    return () => window.removeEventListener('hashchange', setFromHash);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const want = tab === 'form' ? '#apply' : '#opportunities';
    if (window.location.hash !== want) history.replaceState(null, '', want);
  }, [tab, mounted]);

  const goOpps = () => { closeModal(); setTab('opps'); };


  const goFormGeneral = () => {
    closeModal();
    setSelected({});
    setTab('form');
    requestAnimationFrame(() => {
      document.getElementById('volunteer')?.scrollIntoView({ block: 'start' });
    });
  };

  // “Apply for this role”
  const handleApply = (roleTitle?: string, opportunityId?: string) => {
    setSelected({ id: opportunityId, title: roleTitle });
    setTab('form');
    requestAnimationFrame(() => {
      document.getElementById('volunteer')?.scrollIntoView({ block: 'start' });
    });
  };

  useEffect(() => {
    return () => closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen">
      <HeroVolunteer />

      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div role="tablist" className="flex gap-8 border-b pt-6 text-xl border-wonderleaf/30">
          <button
            role="tab"
            aria-selected={tab === 'opps'}
            onClick={goOpps}
            className={`pb-3 -mb-px font-semibold ${tab === 'opps' ? 'text-wondergreen border-b-2 border-wondergreen' : 'text-gray-600 hover:text-wondergreen'}`}
          >
            Volunteer Opportunities
          </button>
          <button
            role="tab"
            aria-selected={tab === 'form'}
            onClick={goFormGeneral}
            className={`pb-3 -mb-px font-semibold ${tab === 'form' ? 'text-wondergreen border-b-2 border-wondergreen' : 'text-gray-600 hover:text-wondergreen'}`}
          >
            Volunteer Application
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'opps' ? (
          <Opportunities onApply={handleApply} />
        ) : selected.id ? (

          <VolunteerForm
            key={`opp-${selected.id}`}
            opportunityId={selected.id}
            roleTitle={selected.title}
          />
        ) : (
          <VolunteerForm key="general" />
        )}
      </div>
    </div>
  );
}
