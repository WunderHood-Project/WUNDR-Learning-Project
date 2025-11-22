'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { API, makeApiRequest } from '../../../../utils/api';
import { useAuth } from '@/context/auth';
import type { Notification, NotificationsResponse } from '@/types/notification';
import { Header } from './Header';
import { Tabs } from './Tabs';
import { List } from './List';

type TabKey = 'all' | 'unread' | 'read';

// Single helper to choose which date to display/sort by.
// Keeping logic in one place makes code easier to reason about.
const displayTime = (n: Notification) =>
  n.createdAt ?? n.eventDate ?? new Date().toISOString();

export default function Notifications({onUnreadChange}: { onUnreadChange?: (count: number) => void }) {
  const { token, authReady } = useAuth();

  const t = token || undefined;

  // Local state
  const [items, setItems] = useState<Notification[]>([]);
  const [tab, setTab] = useState<TabKey>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [busy, setBusy]     = useState<string | null>(null);
  const didFetchForToken = useRef<string | null>(null);

  // Fetch user's notifications
  const load = useCallback(async () => {
    if (!t) { 
      setItems([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res: NotificationsResponse =
        await makeApiRequest(`${API}/notifications/`, { token: t });

      const raw: Notification[] = res?.Notifications ?? [];

      // Normalize and sort newest first.
      // No service fields, no `any`.
      const normalized: Notification[] = raw
        .map((n) => ({ ...n, isRead: Boolean(n.isRead) }))
        .sort(
          (a, b) =>
            new Date(displayTime(b)).getTime() - new Date(displayTime(a)).getTime()
        );

      setItems(normalized);
    } catch (e) {
      setItems([]);
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Load when auth is ready or token changes
  useEffect(() => {
    if (!authReady) return;
    if (didFetchForToken.current !== (token ?? null)) {
      didFetchForToken.current = token ?? null;
      void load();
    }
  }, [authReady, token, load]);

  // Derived counts for tabs and buttons
  const unreadCount = useMemo(
    () => items.filter(i => !i.isRead).length,
    [items]
  );

  useEffect(() => {
    if (onUnreadChange) onUnreadChange(unreadCount);
  }, [unreadCount, onUnreadChange]);

  
  const readCount = useMemo(
    () => items.filter(i => i.isRead).length,
    [items]
  );

  // Filtered view by active tab
  const filtered = useMemo(() => {
    if (tab === 'unread') return items.filter(i => !i.isRead);
    if (tab === 'read')   return items.filter(i =>  i.isRead);
    return items;
  }, [items, tab]);

  // --- Actions ---

  // Mark single notification as read (optimistic UI)
  const markAsRead = async (id: string) => {
    setError(null);
    try {
      setBusy(`read:${id}`);
      await makeApiRequest(`${API}/notifications/${id}/read`, {
        method: 'PATCH',
        token: t,
      });
      setItems(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setBusy(null);
    }
  };

  // Mark all as read
  const markAllRead = async () => {
    if (!unreadCount) return;
    setError(null);
    try {
      setBusy('read:all');
      await makeApiRequest(`${API}/notifications/mark-all-read`, {
        method: 'POST',
        token: t,
      });
      setItems(prev => prev.map(i => ({ ...i, isRead: true })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setBusy(null);
    }
  };

  // Delete single notification
  const deleteOne = async (id: string) => {
    setError(null);
    try {
      setBusy(`del:${id}`);
      await makeApiRequest(`${API}/notifications/${id}`, {
        method: 'DELETE',
        token: t,
      });
      setItems(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setBusy(null);
    }
  };

  // Delete all read notifications
  const deleteAllRead = async () => {
    setError(null);
    try {
      setBusy('del:read');
      await makeApiRequest(`${API}/notifications/read`, {
        method: 'DELETE',
        token: t,
      });
      setItems(prev => prev.filter(n => !n.isRead));
      setTab('all'); // UX: reset to "All" after clearing
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="w-full">
      <div className="bg-white rounded-2xl shadow-lg border border-wondergreen/10 overflow-hidden">
        {/* brand top bar */}
        <div className="h-1.5 bg-gradient-to-r from-wondersun via-wonderleaf to-wondergreen" />

        {/* Header: title + actions */}
        <Header
          hasAnyRead={items.some(i => i.isRead)}
          unreadCount={unreadCount}
          loading={loading}
          busy={busy}
          onMarkAllRead={markAllRead}
          onClearRead={deleteAllRead}
        />

        {/* Tabs: All / Unread / Read */}
        <Tabs
          tab={tab}
          setTab={setTab}
          unreadCount={unreadCount}
          readCount={readCount}
        />

        {/* Content */}
        <div className="p-2 sm:p-4">
          {loading ? (
            <List.Skeleton />
          ) : error ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-white p-6 text-center text-red-600 text-sm"
            >
              {error}
              <div className="mt-3">
                <button
                  onClick={load}
                  className="px-3 py-1.5 rounded-lg border text-red-700 border-red-300 hover:bg-red-50"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <List
              items={filtered}
              busy={busy}
              onMarkRead={markAsRead}
              onDelete={deleteOne}
            />
          )}
        </div>
      </div>
    </section>
  );
}
