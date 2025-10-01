'use client';

import { useState, useEffect } from 'react';
import AdminVolunteerOpportunities from '@/components/AdminVolunteer/AdminVolunteerOpportunities';
import ApplicantsPanel from '@/components/AdminVolunteer/ApplicantsPanel';
import type { Opp } from '@/types/opportunity';

type Tab = 'opps' | 'apps';

export default function AdminVolunteerPage() {
  const [tab, setTab] = useState<Tab>('opps');
  const [selectedOpp, setSelectedOpp] = useState<Pick<Opp, 'id' | 'title'> | null>(null);

  const openAppsFor = (opp: Opp) => {
    setSelectedOpp({ id: opp.id, title: opp.title });
    setTab('apps');
  };
  // const openAllApps = () => {
  //   setSelectedOpp(null);
  //   setTab('apps');
  // };


  const goApps = () => { setSelectedOpp(null); setTab('apps'); };
  const goOpps = () => setTab('opps');

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash === 'apps') setTab('apps');
    if (hash === 'opps') setTab('opps');
  }, []);
  useEffect(() => {
    const want = tab === 'apps' ? '#apps' : '#opps';
    if (window.location.hash !== want) history.replaceState(null, '', want);
  }, [tab]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">
          {tab === 'opps' ? 'Volunteer Opportunities (Admin)' : 'Applications'}
        </h1>
        <div role="tablist" className="flex gap-6 border-b pt-4 text-lg border-wonderleaf/30 w-full justify-end">
          <button
            role="tab"
            aria-selected={tab === 'opps'}
            onClick={goOpps}
            className={`pb-2 -mb-px ${tab === 'opps' ? 'text-wondergreen border-b-2 border-wondergreen font-semibold' : 'text-gray-600 hover:text-wondergreen'}`}
          >
            Opportunities
          </button>
          <button
            role="tab"
            aria-selected={tab === 'apps'}
            onClick={goApps}
            className={`pb-2 -mb-px ${tab === 'apps' ? 'text-wondergreen border-b-2 border-wondergreen font-semibold' : 'text-gray-600 hover:text-wondergreen'}`}
          >
            Applications
          </button>
        </div>
      </div>

      <div className="mt-6">
        {tab === 'opps' ? (
          <AdminVolunteerOpportunities
            // onViewAllApps={openAllApps}
            onViewAppsFor={openAppsFor}
          />
        ) : (
          <ApplicantsPanel
            mode={selectedOpp ? 'opp' : 'all'}
            opportunityId={selectedOpp?.id ?? ''}
            title={selectedOpp?.title}
            onBack={goOpps}
          />
        )}
      </div>
    </div>
  );
}
