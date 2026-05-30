'use client';

import { useEffect, useMemo, useState } from 'react';
import { determineEnv, makeApiRequest } from '../../../utils/api';

const API = determineEnv();

type ImpactResponse = {
  year: number | 'all';
  events: {
    partnerPublished: number;
    wonderhoodPublished: number;
    totalPublished: number;
  };
  programs: {
    partnerPublished: number;
    wonderhoodPublished: number;
    totalPublished: number;
  };
  community: {
    childrenServed: number;
    communityPartners: number;
  };
};

export default function ImpactSummary() {
  const [data, setData] = useState<ImpactResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState('2026');

  const token = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }, []);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const res = await makeApiRequest<ImpactResponse>(
          `${API}/impact/admin?year=${year}`,
          {
            method: 'GET',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }
        );

        setData(res);
      } catch (e) {
        console.error('Failed to load impact summary:', e);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token, year]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading impact…</div>;
  }

  if (!data) {
    return <div className="text-sm text-red-600">Failed to load impact data.</div>;
  }

  const cards = [
    ['Partner Events', data.events.partnerPublished],
    ['WonderHood Events', data.events.wonderhoodPublished],
    ['Total Events', data.events.totalPublished],
    ['Partner Programs', data.programs.partnerPublished],
    ['WonderHood Programs', data.programs.wonderhoodPublished],
    ['Total Programs', data.programs.totalPublished],
    ['Children Served', data.community.childrenServed],
    ['Community Partners', data.community.communityPartners],
  ];

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-wondergreen">Impact Summary</h2>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-wondergreen"
        >
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="">All years</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">{label}</div>
            <div className="mt-2 text-3xl font-bold text-wondergreen">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}