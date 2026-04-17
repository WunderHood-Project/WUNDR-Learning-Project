'use client';

import Image from 'next/image';
import { normalizeNextImageSrc } from '../../../../utils/image/normalizeNextImageSrc';
import type { EnrichmentProgram } from '@/types/program';

function SentenceText({ text, className }: { text: string; className?: string }) {
  const sentences = text.match(/[^.!?]+[.!?]+["']?/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
  return (
    <div className={`space-y-5 ${className ?? ''}`}>
      {sentences.map((sentence, i) => (
        <p key={i} className="m-0">{sentence}</p>
      ))}
    </div>
  );
}

export default function ProgramDetailsAboutSection({ program }: { program: EnrichmentProgram }) {
  return (
    <section className="lg:col-span-2 space-y-6">
      {/* About */}
      <div className="bg-white/50 rounded-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm border border-white/60">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-wondergreen mb-3 sm:mb-4">
          About This Program
        </h2>
        <SentenceText text={program.description} className="text-sm sm:text-base text-gray-800 leading-relaxed" />
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
          {/* TOP — GREEN HEADER */}
          <div className="rounded-xl bg-gradient-to-br from-[#c6dea0] to-[#b5d58a] p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* IMAGE */}
              <div className="shrink-0">
                {(() => {
                  const img = normalizeNextImageSrc(program.directorImage ?? null);

                  if (img) {
                    return (
                      <Image
                        src={img.src}
                        alt={program.directorName}
                        width={120}
                        height={120}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-[6px] border-white/40"
                        unoptimized={img.unoptimized}
                      />
                    );
                  }

                  return (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl border-[6px] border-white/40">
                      {program.directorName.charAt(0).toUpperCase()}
                    </div>
                  );
                })()}
              </div>

              {/* TEXT */}
              <div className="min-w-0">
                <p className="text-[11px] sm:text-sm uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#3f6f4b] font-medium">
                  Program Lead
                </p>

                <p className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2f5d3a] leading-tight">
                  {program.directorName}
                </p>

                {program.directorTitle && (
                  <p className="mt-1 text-sm text-[#3f6f4b]">
                    {program.directorTitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* BIO */}
          {program.directorBio && (
            <SentenceText
              text={program.directorBio}
              className="text-sm sm:text-base text-gray-800 leading-relaxed"
            />
          )}
        </div>
      )}
    </section>
  );
}