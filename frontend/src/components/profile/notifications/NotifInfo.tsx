'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Calendar as CalIcon, MessageSquare, Check, Dot, Trash2 } from 'lucide-react';
import { formatWhen } from '../../../../utils/formatDate';
import { API, makeApiRequest } from '../../../../utils/api';
import { useAuth } from '@/context/auth';
import type { Notification, NotificationsResponse } from '@/types/notification';

type TabKey = 'all' | 'unread' | 'event' | 'message';

export default function Notifications() {
  const { token, authReady } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [tab, setTab] = useState<TabKey>('all');
  const [loading, setLoading] = useState(false);
  const [loadErrors, setLoadErrors] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null); // id операции (для спиннера на кнопках)
  const didFetchForToken = useRef<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setItems([]);
      setLoadErrors(null);
      return;
    }
    setLoading(true);
    setLoadErrors(null);
    try {
      const res: NotificationsResponse = await makeApiRequest(`${API}/notifications/`, { token });
      setItems(res?.Notifications ?? []);
    } catch (e) {
      setItems([]);
      setLoadErrors(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!authReady) return;
    if (didFetchForToken.current !== token) {
      didFetchForToken.current = token ?? null;
      void fetchNotifications();
    }
  }, [authReady, token, fetchNotifications]);

  const unreadCount = useMemo(() => items.filter(i => !i.isRead).length, [items]);
  const eventCount  = useMemo(() => items.filter(i => (i as any).type === 'event').length, [items]);
  const msgCount    = useMemo(() => items.filter(i => (i as any).type === 'message').length, [items]);

  const filtered = useMemo(() => {
    switch (tab) {
      case 'unread': return items.filter(i => !i.isRead);
      case 'event' : return items.filter(i => (i as any).type === 'event');
      case 'message':return items.filter(i => (i as any).type === 'message');
      default      : return items;
    }
  }, [items, tab]);

  // ---- actions ----
  const markAsRead = async (id: string) => {
    try {
      setBusy(`read:${id}`);
      await makeApiRequest(`${API}/notifications/${id}/read`, { method: 'PATCH' });
      setItems(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error('Failed to mark read', e);
    } finally {
      setBusy(null);
    }
  };

  const markAllRead = async () => {
    if (!unreadCount) return;
    try {
      setBusy('read:all');
      await makeApiRequest(`${API}/notifications/mark-all-read`, { method: 'POST' });
      setItems(prev => prev.map(i => ({ ...i, isRead: true })));
    } catch (e) {
      setLoadErrors(e instanceof Error ? e.message : 'Failed to update');
    } finally {
      setBusy(null);
    }
  };

  const deleteOne = async (id: string) => {
    try {
      setBusy(`del:${id}`);
      await makeApiRequest(`${API}/notifications/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      setLoadErrors(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setBusy(null);
    }
  };

  const deleteAllRead = async () => {
    try {
      setBusy('del:read');
      await makeApiRequest(`${API}/notifications/read`, { method: 'DELETE' });
      setItems(prev => prev.filter(n => !n.isRead));
    } catch (e) {
      setLoadErrors(e instanceof Error ? e.message : 'Failed to delete');
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="w-full">
      <div className="bg-white rounded-2xl shadow-lg border border-wondergreen/10 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-wondersun via-wonderleaf to-wondergreen" />

        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-wondergreen/10 bg-gradient-to-r from-wonderbg/40 to-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-wonderleaf/10 text-wonderleaf p-2">
                <Bell className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-wondergreen">Notifications</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={deleteAllRead}
                disabled={busy === 'del:read' || !items.some(i => i.isRead)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold
                           border disabled:opacity-50
                           border-wondergreen/20 text-wondergreen hover:bg-wonderbg hover:border-wondergreen/40"
                title="Clear all read"
              >
                <Trash2 className="w-4 h-4" />
                Clear read
              </button>

              <button
                type="button"
                onClick={markAllRead}
                disabled={!unreadCount || busy === 'read:all' || loading}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold
                           border disabled:opacity-50
                           border-wondergreen/20 text-wondergreen hover:bg-wonderbg hover:border-wondergreen/40"
                title={unreadCount ? 'Mark all as read' : 'No unread'}
              >
                <Check className="w-4 h-4" />
                Mark all as read
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Tab active={tab === 'all'} onClick={() => setTab('all')} label="All" />
            <Tab active={tab === 'unread'} onClick={() => setTab('unread')}
                 label="Unread" count={unreadCount} />
            <Tab active={tab === 'event'} onClick={() => setTab('event')}
                 label="Events" count={eventCount} />
            <Tab active={tab === 'message'} onClick={() => setTab('message')}
                 label="Messages" count={msgCount} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <SkeletonList />
          ) : loadErrors ? (
            <div className="rounded-xl border border-red-200 bg-white p-6 text-center text-red-600 text-sm">
              {loadErrors}
              <div className="mt-3">
                <button
                  onClick={fetchNotifications}
                  className="px-3 py-1.5 rounded-lg border text-red-700 border-red-300 hover:bg-red-50"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-3">
              {filtered.map(n => (
                <li key={n.id}>
                  <NotificationRow
                    n={n}
                    busy={busy}
                    onMarkRead={() => markAsRead(n.id)}
                    onDelete={() => deleteOne(n.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- UI bits ---------- */

function Tab({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-semibold transition
        ${active
          ? 'bg-white text-wondergreen border border-wondergreen shadow-sm'
          : 'bg-white/70 text-gray-700 border border-transparent hover:border-wonderleaf/40'}`}
    >
      <span className="align-middle">{label}</span>
      {!!count && (
        <span className="ml-2 inline-flex min-w-5 h-5 px-1 items-center justify-center rounded-full bg-wondergreen/10 text-wondergreen text-xs">
          {count}
        </span>
      )}
    </button>
  );
}

function NotificationRow({
  n,
  onMarkRead,
  onDelete,
  busy,
}: {
  n: Notification & { type?: 'event' | 'message'; link?: string };
  onMarkRead: () => void;
  onDelete: () => void;
  busy: string | null;
}) {
  const Icon = n.type === 'message' ? MessageSquare : CalIcon;
  const isUnread = !n.isRead;

  const content = (
    <div className={`rounded-xl border p-4 sm:p-5 transition bg-white
        ${isUnread ? 'border-wondergreen bg-wondergreen/5' : 'border-wonderleaf/40'}`}>
      <div className="flex items-start gap-4">
        {/* unread dot */}
        <div className="pt-1">
          {isUnread ? <Dot className="w-6 h-6 text-wonderleaf -ml-1" /> : <span className="w-3 h-3 block" />}
        </div>

        {/* icon */}
        <div className="shrink-0 rounded-lg bg-wonderleaf/10 text-wonderleaf p-2">
          <Icon className="w-4 h-4" />
        </div>

        {/* text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-wondergreen truncate">{n.title}</p>
            {n.type && (
              <span className="rounded-full bg-wondergreen/10 text-wondergreen text-xs px-2 py-0.5">
                {n.type}
              </span>
            )}
          </div>
          {n.description && (
            <p className="text-gray-700 mt-1 line-clamp-2">{n.description}</p>
          )}
          <div className="mt-2 text-xs text-gray-500">{formatWhen(n.time)}</div>
        </div>

        {/* actions */}
        <div className="flex flex-col gap-2 items-end">
          {isUnread && (
            <button
              onClick={onMarkRead}
              disabled={busy === `read:${n.id}`}
              className="text-xs text-wonderleaf hover:underline disabled:opacity-50"
            >
              Mark as read
            </button>
          )}
          <button
            onClick={onDelete}
            aria-label="Delete notification"
            disabled={busy === `del:${n.id}`}
            className="rounded-md p-1.5 text-wondergreen/80 hover:text-wondergreen hover:bg-wonderbg disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {n.link && (
            <Link
              href={n.link}
              className="text-xs font-semibold text-wondergreen hover:underline"
            >
              Open
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  // кликабельная карточка, если есть link
  return n.link ? <Link href={n.link}>{content}</Link> : content;
}

function SkeletonList() {
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
