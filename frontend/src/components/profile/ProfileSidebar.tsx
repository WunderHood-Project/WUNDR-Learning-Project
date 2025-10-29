'use client';

import { FaUser, FaChild, FaCalendarCheck, FaBell, FaTrash } from 'react-icons/fa';
import OpenModalButton from '@/context/openModalButton';
import DeleteUser from '../profile/userInfo/DeleteUser';
import { useUser } from '../../../hooks/useUser';

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
    
    const { user } = useUser();

    return (
        <nav
        className="hidden md:block bg-white rounded-2xl border border-wondergreen/10 shadow-sm
                    overflow-hidden border-l-4 border-l-wonderleaf sticky top-4"
        aria-label="Profile menu"
        >
        <div className="bg-gradient-to-r from-wonderleaf/5 to-transparent px-4 py-3 border-b border-wondergreen/10">
            <h3 className="text-xs lg:text-base xl:text-lg font-bold text-wondergreen uppercase tracking-wide">Menu</h3>
        </div>

        <div className="p-2 space-y-1.5">
            {tabs.map((label, i) => {
            const Icon = icons[i] ?? FaUser;
            const active = i === activeIdx;
            return (
                <button
                key={label}
                onClick={() => onSelect(i)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition
                    ${active
                    ? 'bg-wonderleaf/15 text-wondergreen border-l-4 border-l-wonderleaf shadow-sm'
                    : 'text-wondergreen/70 hover:bg-wonderleaf/10 hover:text-wondergreen'}`}
                aria-current={active ? 'page' : undefined}
                >
                <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border
                    ${active ? 'bg-white border-wonderleaf' : 'bg-white border-wondergreen/15 text-wondergreen/70'}`}
                >
                    <Icon className="h-4 w-4" />
                </span>
                <span className={`text-sm font-semibold ${active ? 'text-wondergreen' : 'text-wondergreen/70'}`}>
                    {label}
                </span>
                {active && <span className="ml-auto h-2 w-2 rounded-full bg-wonderleaf" />}
                </button>
            );
            })}
        </div>

        <div className="border-t border-wondergreen/10 p-2">
            <OpenModalButton
            buttonText={
                <span className="flex items-center justify-center gap-2">
                <FaTrash className="h-4 w-4" />
                    Delete Account
                </span>
            }
            className="w-full rounded-xl py-2 px-3 bg-red-400 hover:bg-red-500 text-white text-sm font-semibold"
            modalComponent={<DeleteUser currUser={user} />}
            />
        </div>
        </nav>
    );
}
