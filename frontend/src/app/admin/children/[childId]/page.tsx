'use client';

import { useParams } from 'next/navigation';
import AdminGuard from '@/components/Administration/AdminGuard';
import AdministrationPage from '@/components/Administration/AdministrationPage';
import ChildDetails from '@/components/Administration/ChildDetails';

export default function Page() {
  const params = useParams<{ childId: string }>();
  const childId = params?.childId;

  if (!childId) return null;

  return (
    <AdminGuard>
      <AdministrationPage title="Child details">
        <ChildDetails childId={childId} />
      </AdministrationPage>
    </AdminGuard>
  );
}
