'use client';
import { useState, useRef, useEffect } from 'react';
import NotificationDropdown from './NotificationDropdown';
import { useUnreadNotifications } from '../../../hooks/useUnreadNotifications';
import { useAuth } from '@/context/auth';


export default function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { unread, refresh } = useUnreadNotifications();
  const { token } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setShowDropdown((prev) => {
      const next = !prev;
      if (next) void refresh();
      return next;
    })
  }

  const handleClose = () => {
    setShowDropdown(false);
    void refresh();
  }

  useEffect(() => {
    if (!token) return;   
    void refresh();
  }, [token, refresh]);


  return (
    <div className="relative" ref={containerRef}>
      {/* Bell btn */}
      <button
        type="button"
        onClick={handleToggle}
        className="
          relative rounded-full transition-all duration-300
          text-wondergreen hover:text-wonderleaf hover:bg-wondergreen/5
          p-2 lg:p-1.5 xl:p-2
          hover:scale-110 lg:hover:scale-105 xl:hover:scale-110
        "
        aria-expanded={showDropdown}
        aria-label="Notifications"
      >
        {/* Bell icon */}
        <svg
        className="w-6 h-6 lg:w-6 lg:h-6 xl:w-7 xl:h-7"
         fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {/* Badge */}
        {unread > 0 && (
          <div className="
            absolute -top-1 -right-1 flex items-center justify-center font-bold
            bg-red-500 text-white rounded-full
            h-5 w-5 text-xs
            lg:h-4 lg:w-4 lg:text-[10px]
            xl:h-5 xl:w-5 xl:text-xs
          ">
            {unread > 9 ? '9+' : unread}
          </div>
        )}
      </button>

      {/* Dropdown */}
      <div className={showDropdown ? '' : 'hidden'}>
        <NotificationDropdown onClose={handleClose} />
      </div>

    </div>
  );
}
