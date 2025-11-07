'use client';
import type { Notification } from '@/types/notification';
import { Bell, Dot, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatWhen } from '../../../../utils/formatDate';

export function List({
  items, busy, onMarkRead, onDelete,
}: {
  items: (Notification & { link?: string })[];
  busy: string | null;
  onMarkRead: (id: string) => void;
  onDelete:   (id: string) => void;
}) {
  if (!items.length) return <EmptyState />;
  return (
    <ul className="space-y-3">
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

export function Row({
  n, busy, onMarkRead, onDelete,
}: {
  n: Notification & { link?: string };
  busy: string | null;
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const isUnread = !n.isRead;

  const content = (
    <div className={`rounded-xl border p-4 sm:p-5 transition bg-white
                     ${isUnread ? 'border-wondergreen bg-wondergreen/5' : 'border-wonderleaf/40'}`}>
      <div className="flex items-start gap-4">
        <div className="pt-1">
          {isUnread ? <Dot className="w-6 h-6 text-wonderleaf -ml-1" /> : <span className="w-3 h-3 block" />}
        </div>
        <div className="shrink-0 rounded-lg bg-wonderleaf/10 text-wonderleaf p-2">
          <Bell className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-wondergreen break-words">{n.title}</p>
          {n.description && <p className="text-gray-700 mt-1 break-words">{n.description}</p>}
          <div className="mt-2 text-xs text-gray-500">{formatWhen(n.time)}</div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          {isUnread && (
            <button
              onClick={(e)=>{ e.stopPropagation(); onMarkRead(); }}
              disabled={busy === `read:${n.id}`}
              className="text-xs text-wonderleaf hover:underline disabled:opacity-50"
            >
              Mark as read
            </button>
          )}
          <button
            onClick={(e)=>{ e.stopPropagation(); onDelete(); }}
            aria-label="Delete notification"
            disabled={busy === `del:${n.id}`}
            className="rounded-md p-1.5 text-wondergreen/80 hover:text-wondergreen hover:bg-wonderbg disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {n.link && (
            <Link href={n.link} className="text-xs font-semibold text-wondergreen hover:underline">
              Open
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return n.link ? <Link href={n.link}>{content}</Link> : content;
}

export function ListSkeleton() {
  return (
    <ul className="space-y-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i} className="rounded-xl border border-wonderleaf/30 bg-white p-5">
          <div className="flex items-start gap-4">
            <div className="h-4 w-4 rounded bg-wonderbg" />
            <div className="h-9 w-9 rounded-lg bg-wonderbg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-wonderbg rounded" />
              <div className="h-3 w-2/3 bg-wonderbg rounded" />
            </div>
            <div className="h-4 w-16 bg-wonderbg rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-wonderleaf/30 bg-white p-10 text-center">
      <div className="mx-auto mb-3 w-10 h-10 rounded-full bg-wonderleaf/10 flex items-center justify-center text-wonderleaf">
        <Bell className="w-5 h-5" />
      </div>
      <p className="text-wondergreen font-semibold">No notifications yet</p>
      <p className="text-gray-500 text-sm mt-1">We’ll keep you posted when something happens.</p>
    </div>
  );
}

// удобный неймспейс-экспорт скелетона
List.Skeleton = ListSkeleton;
