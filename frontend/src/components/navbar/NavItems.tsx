'use client';

import Link from 'next/link';
import React from 'react';
import type { NavLink } from './navLinks';

type CommonProps = {
  links: NavLink[];
  pathname: string;
};

// Desktop version of the nav bar items
export function DesktopNavItems({ links, pathname }: CommonProps) {
  return (
    <div className="hidden lg:flex items-center space-x-6 ml-10">
      {links.map(({ href, label, disabled, badge }) => {
        const isActive = pathname === href;

        if (disabled) {
          // Non-clickable item with a small yellow "Soon" badge slightly above the word.
          return (
            <div
              key={href}
              role="link"
              aria-disabled="true"
              title="Coming soon"
              className="
                relative inline-flex items-center
                px-4 py-2 text-xl font-semibold
                text-wondergreen cursor-not-allowed select-none
              "
              onClick={(e) => e.preventDefault()}
            >
              {/* Anchor for absolute-positioned badge */}
              <span className="relative">
                {label}
                {badge === 'coming-soon' && (
                  <span
                    className="
                      absolute -top-3 right-0
                      left-1/4 -translate-x-1/2 translate-x-4
                      px-2 py-0.5 rounded-full whitespace-nowrap
                      text-[10px] font-semibold leading-none
                      bg-amber-200/90 text-amber-800 border border-amber-300 shadow-sm
                    "
                    aria-label="Coming soon"
                    title="Coming soon"
                  >
                    Soon
                  </span>
                )}
              </span>
            </div>
          );
        }

        return (
          <Link
          key={href}
          href={href}
          className={`
            relative px-4 py-2 text-xl font-semibold transition-all duration-300 group
            ${isActive ? 'text-wondergreen' : 'text-wondergreen hover:text-wondergreen'}
          `}
          >
            <span className="relative z-10">{label}</span>

            {/* Hover background */}
            <div className="absolute inset-0 bg-gradient-to-r from-wonderleaf/10 to-wondergreen/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Active underline */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-wonderleaf to-wondergreen rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}

// Mobile version of the nav bar items
type MobileProps = CommonProps & { onClose: () => void };

export function MobileNavItems({ links, pathname, onClose }: MobileProps) {
  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      {links.map(({ href, label, disabled, badge }) => {
        const isActive = pathname === href;

        if (disabled) {
          // Mobile: non-clickable row; badge sits to the right (no absolute needed).
          return (
            <div
              key={href}
              role="link"
              aria-disabled="true"
              title="Soon"
              className="flex items-center justify-between px-4 py-3 text-lg font-semibold rounded-lg text-gray-500 bg-gray-50 cursor-not-allowed select-none"
              onClick={(e) => e.preventDefault()}
            >
              <span>{label}</span>
              {badge === 'coming-soon' && (
                <span
                  className="
                    px-2 py-0.5 rounded-full whitespace-nowrap
                    text-[10px] font-semibold leading-none
                    bg-amber-200/90 text-amber-800 border border-amber-300 shadow-sm
                  "
                  aria-label="Coming soon"
                  title="Coming soon"
                >
                  Soon
                </span>
              )}
            </div>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`block px-4 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-wonderleaf/20 to-wondergreen/20 text-wondergreen border-l-4 border-wondergreen'
                : 'text-gray-700 hover:text-wondergreen hover:bg-wondergreen/5'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
