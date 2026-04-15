'use client';

import AdminGuard from '@/components/Administration/AdminGuard';
import AdministrationPage from '@/components/Administration/AdministrationPage';
import PartnerPrograms from '@/components/Administration/PartnerPrograms';

export default function Page() {
  return (
    <AdminGuard>
      <AdministrationPage title="Partner Program Submissions">
        <PartnerPrograms />
      </AdministrationPage>
    </AdminGuard>
  );
}
