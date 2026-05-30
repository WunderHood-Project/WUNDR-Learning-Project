'use client';

import AdminGuard from '@/components/Administration/AdminGuard';
import AdministrationPage from '@/components/Administration/AdministrationPage';
import Users from '@/components/Administration/Users';

export default function UsersPage() {
  return (
    <AdminGuard>
      <AdministrationPage title="Users">
        <Users />
      </AdministrationPage>
    </AdminGuard>
  );
}