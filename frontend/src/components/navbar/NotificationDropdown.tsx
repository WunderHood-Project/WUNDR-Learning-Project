'use client'

import Link from 'next/link';
import { API, makeApiRequest } from '../../../utils/api';
import { useState, useCallback, useEffect } from 'react';
import { Notification, NotificationsResponse } from '@/types/notification';
import { formatNotificationTime } from '../../../utils/formatDate';

interface Props {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: Props) {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadErrors, setLoadErrors] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Fetch the notifications here:
  const fetchNotifications = useCallback(async () => {
    setLoading(true)

    try {
      const response: NotificationsResponse = await makeApiRequest(`${API}/notifications/`)
      setNotifications(response?.Notifications)
      setLoadErrors(null)
    } catch (e) {
      if (e instanceof Error) {
        setLoadErrors(e.message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchNotifications()
  }, [fetchNotifications])

  // const hasUnread = notifications?.some((n) => !n.isRead) ?? false;

  // const recent = [...(notifications ?? [])]
  // .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  // .slice(0, 4);

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-wonderleaf/20 rounded-xl shadow-xl z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-wonderleaf/10 flex justify-between items-center">
        <h3 className="font-semibold text-wondergreen">Notifications</h3>
        {/* <button className="text-xs text-wonderleaf hover:underline">
          Mark all as read
        </button> */}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : loadErrors? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-3xl mb-2">✨</div>
            <div className="font-medium mb-1">You&aposre all caught up!</div>
            <div className="text-sm">No new notifications right now.</div>
          </div>
        ) : (
          notifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`px-4 py-3 border-b border-gray-100 hover:bg-wondergreen/5 cursor-pointer transition-colors ${!notification.isRead ? 'bg-wondergreen/5 border-l-2 border-l-wondergreen' : ''
                }`}
            >
              <div className="flex gap-3">
                {/* <div className="text-lg">{notification.icon}</div> */}
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-900">{notification?.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{notification?.description}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatNotificationTime(notification?.time)}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      < div className="px-4 py-3 border-t border-wonderleaf/10 text-center" >
        <Link
          href="/profile?tab=notifications"
          onClick={onClose}
          className="text-sm text-wondergreen hover:text-wonderleaf font-medium"
        >
          View all notifications
        </Link>
      </div >
    </div >
  );
}
