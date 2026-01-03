'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode; // Whatever UI you want to protect (admin-only pages/components).
};

export default function AdminGuard({ children }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('user');  //Read cached user data (stored after login).
      const token = localStorage.getItem('token');  //Read auth token (required for API + auth).
      const u = rawUser ? JSON.parse(rawUser) : null; //Parse JSON safely into a user object.

      // If missing user, not admin, or missing token → redirect away (no access).
      if (!u || u.role !== 'admin' || !token) {
        router.replace('/'); //Replace prevents "Back" returning to the protected page.
        return;
      }

      setReady(true); //Access approved → allow children to render.
    } catch {
      router.replace('/'); //If JSON is corrupted / parsing fails → treat as unauthorized.
    }
  }, [router]);

  if (!ready) return null; //Avoids flicker of protected content before redirect/approval.
  return <>{children}</>; //Render protected content only when admin check passed.
}
