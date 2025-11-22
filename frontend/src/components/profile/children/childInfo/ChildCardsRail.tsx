'use client';
import React from 'react';
import ChildInfoCard from './ChildInfoCard';
import type { Child } from '@/types/child';

type Props = {
    items: ReadonlyArray<Child>;
    onEdit: (id: string) => void;
    onDeleted: (id: string) => void;
};

export default function ChildCardsRail({ items, onEdit, onDeleted }: Props) {
    const showHint = items.length > 1; // show if more than 1 child

    return (
        <div className="md:hidden -mx-4 px-4">
            {/* show only for mob */}
            {showHint && (
                <div className="mb-2 flex justify-start ml-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-wonderleaf/20 px-3 py-1 text-[13px] text-wonderforest/80 shadow-sm ring-1 ring-black/5">
                        <span className="leading-none">Swipe to see other children</span>
                        <span aria-hidden className="leading-none">→</span>
                    </div>
                </div>
            )}

            {/* Rail with swipe */}
            <div
                className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 pb-2"
                style={{ WebkitOverflowScrolling: 'touch' }}
            >
                {items.map((child) => (
                    <div key={child.id} className="shrink-0 w-[88vw] snap-center">
                        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 hover:shadow-md transition overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-wondersun via-wonderorange to-wondergreen" />
                        <div className="p-4 sm:p-5">
                            <ChildInfoCard
                            child={child}
                            onEdit={() => onEdit(child.id)}
                            onDeleted={onDeleted}
                            />
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
