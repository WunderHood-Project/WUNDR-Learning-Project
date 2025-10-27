'use client';

import { FaUser, FaChild, FaCalendarCheck, FaBell } from 'react-icons/fa';

const icons = [FaUser, FaChild, FaCalendarCheck, FaBell];

export default function ProfileSidebar({
    tabs,
    activeIdx,
    onSelect,
}: {
    tabs: string[];
    activeIdx: number;
    onSelect: (i: number) => void;
}) {
    return (
        <nav className="bg-white/80 backdrop-blur rounded-2xl border border-wondergreen/10 shadow-sm p-2">
            {tabs.map((label, i) => {
                const Icon = icons[i] ?? FaUser;
                const active = i === activeIdx;
                

                return (
                    <button
                        key={label}
                        onClick={() => onSelect(i)}
                        className={
                        'w-full group flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ' +
                        (active
                            ? 'bg-wonderleaf/10 text-wondergreen border-l-4 border-wonderleaf shadow-inner'
                            : 'text-wondergreen/80 hover:bg-wonderleaf/10 hover:text-wondergreen')
                        }
                    >
                        <span
                        className={
                            'inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ' +
                            (active
                            ? 'border-wonderleaf/30 bg-white'
                            : 'border-wondergreen/15 bg-white group-hover:border-wonderleaf/40')
                        }
                        >
                            <Icon className="h-5 w-5" />
                        </span>

                        <span className="font-semibold">{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
