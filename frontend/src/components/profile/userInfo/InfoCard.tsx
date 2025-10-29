'use client';
import type { ReactNode } from 'react';
import clsx from 'clsx';

export default function InfoCard({
  icon,
  label,
  value,
  large = false,
  valueClassName,
  labelClassName,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  /** Увеличить типографику на md+ (удобно для десктопа) */
  large?: boolean;
  /** Точный оверрайд классов для значения (например только Email) */
  valueClassName?: string;
  /** Точный оверрайд классов для лейбла */
  labelClassName?: string;
}) {
  return (
    <div className="rounded-lg sm:rounded-xl border border-wonderorange/30 bg-wondersun/5 p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Icon */}
        <div
          className={clsx(
            'mt-0 flex-shrink-0',
            large ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg md:text-xl'
          )}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Label */}
          <p
            className={clsx(
              'uppercase tracking-wide font-bold text-wondergreen/70',
              large
                ? 'text-xs sm:text-sm md:text-base leading-4 sm:leading-5 md:leading-6'
                : 'text-xs sm:text-sm md:text-sm leading-4 sm:leading-5',
              labelClassName
            )}
          >
            {label}
          </p>

          {/* Value */}
          <p
            className={clsx(
              'mt-1.5 sm:mt-2 font-semibold text-wondergreen break-words whitespace-pre-line',
              large
                ? 'text-sm sm:text-base md:text-lg lg:text-xl'
                : 'text-xs sm:text-sm md:text-base',
              valueClassName
            )}
          >
            {value || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
