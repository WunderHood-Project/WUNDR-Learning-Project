'use client';

import AdminGuard from '@/components/Administration/AdminGuard';
import AdministrationPage from '@/components/Administration/AdministrationPage';
import Children from '@/components/Administration/Children';

export default function Page() {
  return (
    <AdminGuard>
      <AdministrationPage title="Children">
        <Children />
      </AdministrationPage>
    </AdminGuard>
  );
}
