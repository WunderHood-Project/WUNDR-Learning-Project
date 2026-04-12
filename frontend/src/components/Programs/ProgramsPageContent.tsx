'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BeatLoader } from 'react-spinners';
import { useProgram } from '../../../hooks/useProgram';
import { useUser } from '../../../hooks/useUser';
import ProgramCard from './ProgramCard';
import GradientBanner from '@/components/ui/GradientBanner';

export default function ProgramsPageContent() {
  const { user } = useUser();
  const { programs, loading, error, refetch } = useProgram(undefined);

  const isAdmin = user?.role === 'admin';
  const canAddProgram = user?.role === 'admin' || user?.role === 'partner';

  const [localPrograms, setLocalPrograms] = useState<typeof programs>(null);

  // Use localPrograms if set (after a delete), otherwise fall back to fetched list
  const displayPrograms = localPrograms ?? programs ?? [];

  const handleDelete = (deletedId: string) => {
    setLocalPrograms((displayPrograms).filter((p) => p.id !== deletedId));
  };

  if (loading)
    return (
      <div className="text-center py-20 text-green-700">
        <BeatLoader color="#90b35c" size={15} />
      </div>
    );

  if (error)
    return (
      <div className="min-h-[40vh] grid place-items-center text-red-600">
        {error}{' '}
        <button onClick={refetch} className="ml-3 underline text-wondergreen">
          Try again
        </button>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-wonderbg via-white to-wondersun/20">
      <GradientBanner
        size="md"
        title="Enrichment Programs"
        subtitle="Multi-week learning experiences designed to help children grow, explore, and thrive."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        {/* Add Program CTA */}
        {canAddProgram && (
          <div className="flex justify-center mt-6 mb-10">
            <Link
              href="/programs/addProgram"
              className="bg-wondergreen text-white px-10 py-2 rounded text-sm font-bold hover:bg-wonderleaf transition-colors"
            >
              {isAdmin ? 'ADD PROGRAM' : 'SUBMIT A PROGRAM'}
            </Link>
          </div>
        )}

        {displayPrograms.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-lg font-medium">No enrichment programs available yet.</p>
            <p className="text-sm mt-2 text-gray-500">Check back soon!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {displayPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
