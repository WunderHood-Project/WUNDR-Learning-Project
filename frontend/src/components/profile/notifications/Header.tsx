'use client';
import { Bell, Check, Trash2 } from 'lucide-react';

export function Header({
    hasAnyRead, unreadCount, loading, busy, onMarkAllRead, onClearRead,
}: {
    hasAnyRead: boolean;
    unreadCount: number;
    loading: boolean;
    busy: string | null;
    onMarkAllRead: () => void;
    onClearRead: () => void;
}) {
    return (
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-wondergreen/10 bg-gradient-to-r from-wonderbg/40 to-white">
            <div className="flex items-center justify-between flex-nowrap gap-2">
                {/* Icon + title */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-xl bg-wonderleaf/10 text-wonderleaf p-1.5 sm:p-2">
                        <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h1 className="truncate text-lg sm:text-xl md:text-2xl font-extrabold text-wondergreen">
                        Notifications
                    </h1>
                </div>

                {/* Buttons on the right */}
                <div className="ml-auto flex items-center gap-2">
                <button
                    type="button"
                    onClick={onClearRead}
                    disabled={busy === 'del:read' || !hasAnyRead}
                    className="inline-flex h-7 md:h-9 items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold
                            border disabled:opacity-50 shrink-0
                            border-wondergreen/20 text-wondergreen hover:bg-wonderbg hover:border-wondergreen/40"
                    title="Clear all read"
                >
                    <span className="w-7 md:w-9 inline-flex items-center justify-center">
                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </span>
                    <span className="hidden md:inline">Clear read</span>
                </button>

                <button
                    type="button"
                    onClick={onMarkAllRead}
                    disabled={!unreadCount || busy === 'read:all' || loading}
                    className="inline-flex h-7 md:h-9 items-center justify-center gap-2 rounded-lg px-2 text-sm font-semibold
                            border disabled:opacity-50 shrink-0
                            border-wondergreen/20 text-wondergreen hover:bg-wonderbg hover:border-wondergreen/40"
                    title={unreadCount ? 'Mark all as read' : 'No unread'}
                >
                    <span className="w-6 md:w-9 inline-flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </span>
                    <span className="hidden md:inline">Mark all as read</span>
                </button>
                </div>
            </div>
        </div>
    );
}
