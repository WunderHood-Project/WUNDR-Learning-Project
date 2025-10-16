'use client';

import { useCallback, useEffect, useState } from 'react';
import { API, makeApiRequest } from '../utils/api';
import type { Notification, NotificationsResponse } from '@/types/notification';

export function useUnreadNotifications(pollMs?: number) {
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res: NotificationsResponse = await makeApiRequest(`${API}/notifications/`);
      const items: Notification[] = res?.Notifications ?? [];
      setUnread(items.filter(n => !n.isRead).length);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  // timer-polling
  useEffect(() => {
    if (!pollMs) return;
    const id = setInterval(() => { void refresh(); }, pollMs);
    return () => clearInterval(id);
  }, [pollMs, refresh]);

  return { unread, loading, refresh };
}
