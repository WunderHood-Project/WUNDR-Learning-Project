'use client';

import AdminGuard from '@/components/Administration/AdminGuard';
import AdministrationPage from '@/components/Administration/AdministrationPage';
import PartnerEvents from '@/components/Administration/PartnerEvents';

export default function Page() {
  return (
    <AdminGuard>
      <AdministrationPage title="Partner Event Submissions">
        <PartnerEvents />
      </AdministrationPage>
    </AdminGuard>
  );
}
