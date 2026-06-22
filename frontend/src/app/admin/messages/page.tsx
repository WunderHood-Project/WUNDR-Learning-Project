import AdminGuard from '@/components/Administration/AdminGuard';
import AdministrationPage from '@/components/Administration/AdministrationPage';
import PrivateAdminMessages from '@/components/Administration/PrivateAdminMessages';

export default function Page() {
    return (
        <AdminGuard>
            <AdministrationPage title='Messages'>
                <PrivateAdminMessages />
            </AdministrationPage>
        </AdminGuard>
    )
}
