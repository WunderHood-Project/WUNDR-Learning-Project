'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdministrationPage from '@/components/Administration/AdministrationPage';

export default function AdministrationRoute() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('user');
      const rawTok  = localStorage.getItem('token');
      const u = rawUser ? JSON.parse(rawUser) : null;
      if (!u || u.role !== 'admin' || !rawTok) { router.replace('/'); return; }
      setReady(true);
    } catch { router.replace('/'); }
  }, [router]);

  if (!ready) return null;
  return <AdministrationPage />;
}
