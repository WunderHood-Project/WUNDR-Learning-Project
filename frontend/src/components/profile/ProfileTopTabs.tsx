'use client';

import { useState } from 'react';
import {FaUser, FaChild, FaCalendarCheck, FaBell, FaEllipsisV, FaTrash, FaGraduationCap} from 'react-icons/fa';
import type { IconType } from 'react-icons';

type Tab = { key: string; label: string; icon: IconType };

export const DEFAULT_TABS: Tab[] = [
    { key: 'user',          label: 'User Information',    icon: FaUser },
    { key: 'child',         label: "Child's Information", icon: FaChild },
    { key: 'events',        label: 'Your Events',         icon: FaCalendarCheck },
    { key: 'programs',      label: 'Your Programs',       icon: FaGraduationCap },
    { key: 'notifications', label: 'Notifications',       icon: FaBell },
];

export function ProfileTopTabs({
    tabs = DEFAULT_TABS,
    activeKey,
    onChange,
    renderDelete,
    className = '',
    notificationsUnread = 0,
}: {
    tabs?: Tab[];
    activeKey: string;
    onChange: (key: string) => void;
    renderDelete?: (closeMenu: () => void) => React.ReactNode;
    className?: string;
    notificationsUnread?: number;
}) {
    
    const [moreOpen, setMoreOpen] = useState(false);
    const [tipKey, setTipKey] = useState<string | null>(null);

    const showTip = (key: string) => {
        setTipKey(key);
        window.setTimeout(() => setTipKey(null), 1200);
    };

    if (!tabs?.length) return null;

    // class presets
    const base =
        'group relative inline-flex items-center justify-center rounded-xl ring-1 transition focus:outline-none ' +
        'focus:ring-2 focus:ring-wondersun/60 focus:ring-offset-2';
    const activeCls = 'bg-wondergreen text-white ring-wondergreen shadow-md';
    const idleCls =
        'bg-gradient-to-r from-wondersun to-wonderorange text-wondergreen ring-wonderorange/50 ' +
        'hover:from-wonderorange/95 hover:to-wonderorange hover:ring-wonderorange';

    return (
        <div className={`sticky top-0 z-10 bg-wonderbg/80 backdrop-blur supports-[backdrop-filter]:bg-wonderbg/60 ${className}`}>
            {/* ===== single relative wrapper for bar + underline + spacer ===== */}
            <div className="relative">
                {/* Tabs bar — sits above the underline */}
                <div className="relative z-[1] flex items-center justify-between gap-4 py-3 md:py-3 mb-3 sm:mb-4">
                    {/* Tabs */}
                    <div
                        role="tablist"
                        aria-label="Profile sections"
                        className="flex gap-2.5 sm:gap-3 md:gap-4 lg:gap-6
                        flex-wrap md:flex-nowrap
                        justify-center md:justify-start
                        overflow-x-auto no-scrollbar overscroll-x-contain
                        ">
                            {tabs.map(({ key, label, icon: Icon }) => {
                                const active = key === activeKey;
                                const isNotifications = key === 'notifications';
                                return (
                                    <button
                                    key={key}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    aria-controls={`panel-${key}`}
                                    aria-current={active ? 'page' : undefined}
                                    aria-label={label}
                                    title={label}
                                    onClick={() => onChange(key)}
                                    onTouchStart={() => showTip(key)}
                                    className={[
                                        base,
                                        // mobile: icon-only; desktop: comfy pills
                                        'w-9 h-9 sm:w-11 sm:h-15 md:w-auto md:h-auto md:px-2.5 md:py-2 lg:px-6 lg:py-2.5',
                                        active ? activeCls : idleCls,
                                        ].join(' ')}
                                    >
                                    <span className="relative inline-flex">
                                        <Icon className="h-4 w-4 md:h-4 md:w-5 lg:h-5 lg:w-6 flex-shrink-0" />
                                        {isNotifications && notificationsUnread > 0 && (
                                        <span
                                            className="
                                            md:hidden
                                            absolute -top-2.5 -right-2.5
                                            min-w-[16px] h-[16px] px-1
                                            rounded-full bg-red-500 text-white
                                            text-[10px] font-bold
                                            flex items-center justify-center
                                            "
                                        >
                                            {notificationsUnread > 9 ? '9+' : notificationsUnread}
                                        </span>
                                        )}
                                    </span>
                                    <span className="hidden md:inline ml-2 whitespace-nowrap text-sm md:text-sm lg:text-base font-medium">
                                        {label}
                                    </span>
                                    {/* mobile tooltip */}
                                    <span
                                        className={`
                                            md:hidden pointer-events-none
                                            absolute left-1/2 -translate-x-1/2
                                            bottom-full mb-2                /* place above the button instead of using top */
                                            whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold
                                            text-white bg-wondergreen shadow z-20
                                            opacity-0 transition-opacity duration-150
                                            ${tipKey === key
                                            ? 'opacity-100'
                                            : 'group-hover:opacity-100 group-focus-visible:opacity-100'}
                                        `}
                                        >
                                        {label}
                                        </span>
                                    </button>
                                );
                            })}
                    </div>

                    {/* More / Delete button */}
                    <div className="relative shrink-0">
                        <button
                            type="button"
                            aria-label="More actions"
                            aria-haspopup="menu"
                            aria-expanded={moreOpen}
                            onClick={() => setMoreOpen(v => !v)}
                            className="
                            inline-flex items-center justify-center
                            h-9 w-9 md:h-10 md:w-10
                            rounded-2xl border border-wonderleaf/40
                            bg-white/80 backdrop-blur-sm
                            text-wondergreen
                            shadow-sm hover:shadow-md
                            transition-all duration-200
                            hover:-translate-y-[1px] active:translate-y-0
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-wondergreen/30 focus-visible:ring-offset-2
                            "
                        >
                            <FaEllipsisV className="h-4 w-4" />
                        </button>

                        {moreOpen && (
                            <div role="menu" className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                                {renderDelete ? (
                                renderDelete(() => setMoreOpen(false))
                                ) : (
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => setMoreOpen(false)}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <FaTrash className="h-4 w-4" />
                                    Delete Account
                                </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Absolute orange underline: full width, closer to tabs, doesn't block clicks */}
                <div
                aria-hidden
                className="
                    pointer-events-none
                    absolute inset-x-0 top-full z-0
                    -translate-y-2 md:-translate-y-3
                    h-[2px] md:h-[2px]
                    bg-gradient-to-r from-wondersun/80 via-wonderorange/85 to-wonderorange -mt-2
                "/>

                {/* Spacer (reserves space for the underline so content below doesn't jump) */}
                <div className="h-1 md:h-2 lg:h-2 mb-4" />
            </div>
        </div>
    );
}
