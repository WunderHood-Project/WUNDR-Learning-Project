'use client';

import Image from 'next/image';
import { normalizeNextImageSrc } from '../../../../utils/image/normalizeNextImageSrc';
import type { EnrichmentProgram } from '@/types/program';

export default function ProgramDetailsAboutSection({ program }: { program: EnrichmentProgram }) {
  return (
    <section className="lg:col-span-2 space-y-6">
      {/* About */}
      <div className="bg-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm border border-white/60">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-wondergreen mb-3 sm:mb-4">
          About This Program
        </h2>
        <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
          {program.description}
        </p>
      </div>

      {/* What Your Child Will Gain */}
      {program.outcomes && program.outcomes.length > 0 && (
        <div className="bg-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm border border-white/60">
          <h3 className="text-lg sm:text-xl font-bold text-wondergreen mb-4">
            What Your Child Will Gain
          </h3>
          <ul className="space-y-2">
            {program.outcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-wonderleaf/20 text-wonderleaf flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <span className="text-sm sm:text-base text-gray-800 leading-relaxed">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Program Phases */}
      {program.phases && program.phases.length > 0 && (
        <div className="bg-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm border border-white/60">
          <h3 className="text-lg sm:text-xl font-bold text-wondergreen mb-4">
            Program Structure
          </h3>
          <div className="space-y-3">
            {program.phases.map((phase, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-xl bg-wonderbg/60 border border-wonderleaf/20"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-wondergreen text-white flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-bold text-wonderorange uppercase tracking-wide">
                    {phase.season}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">{phase.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Program Lead */}
      {program.directorName && (
        <div className="bg-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm border border-white/60">
          
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* LEFT — IMAGE */}
            <div className="shrink-0">
              {(() => {
                const img = normalizeNextImageSrc(program.directorImage ?? null);

                if (img) {
                  return (
                    <Image
                      src={img.src}
                      alt={program.directorName}
                      width={96}
                      height={96}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-wonderleaf/30"
                      unoptimized={img.unoptimized}
                    />
                  );
                }

                return (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-wondergreen/10 ring-2 ring-wonderleaf/30 flex items-center justify-center text-wondergreen font-bold text-xl sm:text-2xl">
                    {program.directorName.charAt(0).toUpperCase()}
                  </div>
                );
              })()}
            </div>

            {/* RIGHT — TEXT */}
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-widest text-wondergreen font-semibold">
                Program Lead
              </p>

              <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                {program.directorName}
              </p>

              {program.directorTitle && (
                <p className="mt-0.5 text-sm text-wondergreen font-medium">
                  {program.directorTitle}
                </p>
              )}

              {program.directorBio && (
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {program.directorBio}
                </p>
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
