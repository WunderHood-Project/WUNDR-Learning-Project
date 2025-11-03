'use client';

import {
  Hand,
  Heart,
  HeartHandshake,
  HandHeart,
  type LucideIcon,
} from 'lucide-react';

/**
 * Tiny classnames helper: joins only truthy class strings.
 * Example: cn('a', condition && 'b') -> 'a b'
 */
const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

type BadgeProps = {
  /** Optional extra classes (you can also override size here) */
  className?: string;
  /** Brand color theme for the badge gradient */
  variant?: 'green' | 'sun' | 'leaf';
  /** Optional custom content placed inside the circle (for compositions) */
  children?: React.ReactNode;
};

/**
 * Circular gradient badge that matches your brand.
 * Acts as a wrapper around icons or custom content.
 */
export function BadgeCircle({ className, variant = 'green', children }: BadgeProps) {
  const palette =
    {
      green: 'from-wondergreen to-wonderleaf',
      sun: 'from-wonderorange to-wondersun',
      leaf: 'from-wonderleaf to-wondergreen',
    }[variant];

  return (
    <div
      className={cn(
        // layout + shape
        'relative inline-flex items-center justify-center rounded-full shadow-lg',
        // gradient background and icon color
        'bg-gradient-to-br text-white',
        palette,
        // default size; override via `className` if needed
        'w-16 h-16 md:w-16 md:h-16',
        className
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

/**
 * Helper for the common case: a single Lucide icon centered in a badge.
 */
function MonoIconBadge({
  Icon,
  variant,
  className,
  size = 26,
}: {
  Icon: LucideIcon;
  variant: 'green' | 'sun' | 'leaf';
  className?: string;
  size?: number;
}) {
  return (
    <BadgeCircle variant={variant} className={className}>
      <Icon size={size} strokeWidth={2.25} />
    </BadgeCircle>
  );
}

/**
 * Volunteer badge:
 * A hand icon plus a small heart “pinned” to the top-right.
 */
export function VolunteerBadge({ className }: { className?: string }) {
  return (
    <BadgeCircle variant="leaf" className={className}>
      <Hand size={26} strokeWidth={2.25} />
      <Heart size={14} strokeWidth={2.25} className="absolute -top-1.5 -right-1.5" />
    </BadgeCircle>
  );
}

/**
 * Partnership badge:
 * Heart-shaped handshake icon (single icon variant).
 */
export function PartnershipBadge({ className }: { className?: string }) {
  return <MonoIconBadge Icon={HeartHandshake} variant="sun" className={className} />;
}

/**
 * Donation badge:
 * Hand-with-heart icon (single icon variant).
 */
export function DonationBadge({ className }: { className?: string }) {
  return <MonoIconBadge Icon={HandHeart} variant="leaf" className={className} />;
}
