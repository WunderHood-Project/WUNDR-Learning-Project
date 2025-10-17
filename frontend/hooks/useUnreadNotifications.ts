'use client';

import { useCallback, useEffect, useState } from 'react';
import { API, makeApiRequest } from '../utils/api';
import type { Notification, NotificationsResponse } from '@/types/notification';
import { useAuth } from '@/context/auth';
import { useUser } from './useUser';

export function useUnreadNotifications(pollMs?: number) {
  const { token } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      setUnread(0);
      return;
    }

    setLoading(true);
    try {
        const res = await makeApiRequest<NotificationsResponse>(`${API}/notifications/`, {token});
        const list = res?.Notifications ?? [];
        setItems(list);
        setUnread(list.filter(n => !n.isRead).length);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/API Error (401|403)/i.test(msg)) {
        setItems([]);
        setUnread(0);
        return;
      }
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { items, unread, loading, refresh };
}

//   useEffect(() => { void refresh(); }, [refresh]);

//   // timer-polling
//   useEffect(() => {
//     if (!pollMs) return;
//     const id = setInterval(() => { void refresh(); }, pollMs);
//     return () => clearInterval(id);
//   }, [pollMs, refresh]);

//   return { unread, loading, refresh };
// }
