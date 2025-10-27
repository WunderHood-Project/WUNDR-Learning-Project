'use client'

import { useState, useMemo, useEffect } from "react"
import UserInfo from "./userInfo/UserInfo"
import ChildInfo from "./childInfo/ChildInfo"
import { useRouter, useSearchParams } from "next/navigation";
import Notifications from "./notifications/NotifInfo"
import YourEvents from "./events/yourEvents";
import ProfileSidebar from "./ProfileSidebar"

type TabKey = 'user' | 'child' | 'events' | 'notifications';

const profileTabs = ['User Information', "Child's Information", 'Your Events', 'Notifications'] as const;
const keyToIdx: Record<TabKey, number> = { user: 0, child: 1, events: 2, notifications: 3 };
const idxToKey = (idx: number): TabKey =>
    (['user', 'child', 'events', 'notifications'] as TabKey[])[idx];

const Profile = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialKey = (searchParams.get('tab') ?? 'user') as TabKey;
    const [tabIdx, setTabIdx] = useState<number>(() => keyToIdx[initialKey] ?? 0);

    const tabFromUrl = useMemo(
        () => (searchParams.get('tab') ?? 'user') as TabKey,
        [searchParams]
    );

    useEffect(() => {
        const next = keyToIdx[tabFromUrl] ?? 0;
        setTabIdx(next);
    }, [tabFromUrl]);

    const openTab = (idx: number) => {
        setTabIdx(idx);
        router.replace(`/profile?tab=${idxToKey(idx)}`);
    };

    return (
        <div className="bg-wonderbg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left menu */}
                <aside className="lg:col-span-4">
                    <ProfileSidebar
                    tabs={profileTabs as unknown as string[]}
                    activeIdx={tabIdx}
                    onSelect={openTab}
                    />
                </aside>
                {/* Content */}
                <main className="lg:col-span-8">
                    {tabIdx === 0 && <UserInfo />}
                    {tabIdx === 1 && <ChildInfo />}
                    {tabIdx === 2 && <YourEvents />}
                    {tabIdx === 3 && <Notifications />}
                </main>
            </div>
        </div>
    )
}

export default Profile
