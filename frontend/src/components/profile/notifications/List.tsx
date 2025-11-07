'use client';
import type { Notification } from '@/types/notification';
import { Bell, Trash2, Check } from 'lucide-react';
import { formatWhen } from '../../../../utils/formatDate';

/* ================= List ================= */

export function List({
    items, busy, onMarkRead, onDelete,
}: {
    items: Notification[];
    busy: string | null;
    onMarkRead: (id: string) => void;
    onDelete:   (id: string) => void;
}) {
    if (!items.length) return <EmptyState />;
    return (
        <ul className="space-y-2.5 md:space-y-3">
            {items.map(n => (
                <li key={n.id}>
                    <Row
                        n={n}
                        busy={busy}
                        onMarkRead={() => onMarkRead(n.id)}
                        onDelete={() => onDelete(n.id)}
                    />
                </li>
            ))}
        </ul>
    );
}

/* ================= Row ================= */

export function Row({ n, busy, onMarkRead, onDelete }: {
    n: Notification;
    busy: string | null;
    onMarkRead: () => void;
    onDelete: () => void;
}) {
    const isUnread = !n.isRead;

    return (
        <div
        className={`rounded-xl border transition bg-white
                    px-3 py-4 md:px-4 md:py-6
                    ${isUnread ? 'border-wondergreen bg-wondergreen/5' : 'border-wonderleaf/40'}`}
        >
            <div className="flex items-center gap-3 md:gap-4">
                {/* icon bell */}
                <div className="shrink-0 rounded-lg bg-wonderleaf/10 text-wonderleaf p-1.5 md:p-2 self-start">
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                </div>

                {/* text */}
                <div className="flex-1 min-w-0">
                <p className="font-semibold text-wondergreen text-sm md:text-base break-words">
                    {n.title}
                </p>
                {!!n.description && (
                    <p className="text-gray-700 mt-1 text-xs md:text-sm break-words line-clamp-2 md:line-clamp-none">
                    {n.description}
                    </p>
                )}
                <div className="mt-1.5 md:mt-2 text-[11px] md:text-xs text-gray-500">
                    {formatWhen(n.createdAt ?? n.eventDate ?? new Date().toISOString())}
                </div>
                </div>

                {/* actions */}
                <div className="flex flex-row md:flex-col gap-1.5 md:gap-2 items-center md:items-end shrink-0">
                {isUnread && (
                    <button
                    onClick={(e)=>{ e.stopPropagation(); onMarkRead(); }}
                    disabled={busy === `read:${n.id}`}
                    className="rounded-md p-1.5 md:px-2 md:py-1.5 text-wonderleaf hover:bg-wonderbg disabled:opacity-50 inline-flex items-center gap-1"
                    title="Mark as read"
                    >
                    <Check className="w-4 h-4" />
                    <span className="hidden md:inline text-xs">Mark as read</span>
                    </button>
                )}

                <button
                    onClick={(e)=>{ e.stopPropagation(); onDelete(); }}
                    aria-label="Delete notification"
                    disabled={busy === `del:${n.id}`}
                    className="rounded-md p-1.5 md:px-2 md:py-1.5 text-wondergreen/80 hover:text-wondergreen hover:bg-wonderbg disabled:opacity-50 inline-flex items-center gap-1 md:mr-1"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden md:inline text-xs">Delete</span>
                </button>
                </div>
            </div>
        </div>
    );
}


/* ================= Skeleton & Empty ================= */

export function ListSkeleton() {
  return (
    <ul className="space-y-2.5 md:space-y-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={`notif-skel-${i}`} className="rounded-xl border border-wonderleaf/30 bg-white p-4 md:p-5">
            <div className="flex items-start gap-3 md:gap-4">
                <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-wonderbg" />
                <div className="flex-1 space-y-2">
                <div className="h-3.5 md:h-4 w-1/3 bg-wonderbg rounded" />
                <div className="h-3 w-2/3 bg-wonderbg rounded" />
                </div>
                <div className="h-3.5 md:h-4 w-14 md:w-16 bg-wonderbg rounded" />
            </div>
        </li>
      ))}
    </ul>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-wonderleaf/30 bg-white p-8 md:p-10 text-center">
      <div className="mx-auto mb-3 w-9 h-9 md:w-10 md:h-10 rounded-full bg-wonderleaf/10 flex items-center justify-center text-wonderleaf">
        <Bell className="w-5 h-5" />
      </div>
      <p className="text-wondergreen font-semibold text-sm md:text-base">No notifications yet</p>
      <p className="text-gray-500 text-xs md:text-sm mt-1">We’ll keep you posted when something happens.</p>
    </div>
  );
}

// convenient namespace export of skeleton
List.Skeleton = ListSkeleton;
