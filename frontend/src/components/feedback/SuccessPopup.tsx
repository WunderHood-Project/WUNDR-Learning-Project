'use client';

import { CheckCircle } from 'lucide-react';

type Props = {
  title?: string;
  message: string;
  onClose: () => void;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function SuccessPopup({
  title = 'Application submitted!',
  message,
  onClose,
  ctaLabel = 'Back to opportunities',
  ctaHref = '#opportunities',
}: Props) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="
        fixed inset-0 z-[1000]
        bg-black/40 backdrop-blur-sm
        flex items-center justify-center p-4
      "
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brand bar */}
        <div className="h-1 bg-gradient-to-r from-wondersun to-wonderorange" />

        <div className="p-6 text-center">
          <div className="mx-auto mb-3 inline-flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-emerald-600" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-wondergreen">{title}</h3>
          <p className="mt-2 text-slate-600">{message}</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {ctaHref && (
              <a
                href={ctaHref}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 text-center"
                onClick={onClose}
              >
                {ctaLabel}
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-emerald-600 px-4 py-2 text-emerald-700 hover:bg-emerald-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
