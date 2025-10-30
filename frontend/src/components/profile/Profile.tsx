// 'use client';

// import { useState, useMemo, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import UserInfo from './userInfo/UserInfo';
// import ChildInfo from './childInfo/ChildInfo';
// import Notifications from './notifications/NotifInfo';
// import YourEvents from './events/yourEvents/YourEvents';
// import ProfileSidebar from './ProfileSidebar';
// import MobileMenuDrawer from './MobileMenuDrawer';
// import TabletMenuDropdown from './TabletMenuDropdown';

// type TabKey = 'user' | 'child' | 'events' | 'notifications';

// const TABS = ['User Information', "Child's Information", 'Your Events', 'Notifications'] as const;
// const keyToIdx: Record<TabKey, number> = { user: 0, child: 1, events: 2, notifications: 3 };
// const idxToKey = (i: number) => (['user', 'child', 'events', 'notifications'] as TabKey[])[i];

// export default function Profile() {
//     const router = useRouter();
//     const search = useSearchParams();

//     // initial tab from URL (?tab=...), default 'user'
//     const initial = (search.get('tab') ?? 'user') as TabKey;
//     const [tabIdx, setTabIdx] = useState<number>(() => keyToIdx[initial] ?? 0);

//     // keep tab in sync with URL changes
//     const tabFromUrl = useMemo(() => (search.get('tab') ?? 'user') as TabKey, [search]);

//     useEffect(() => {
//         setTabIdx(keyToIdx[tabFromUrl] ?? 0);
//     }, [tabFromUrl]);

//     // change active tab + update URL (shallow)
//     const openTab = (idx: number) => {
//         setTabIdx(idx);
//         router.replace(`/profile?tab=${idxToKey(idx)}`);
//     };

//     return (
//         <div className="bg-wonderbg">

//             {/* TOP controls: mobile + tablet */}
//             <div className="-mx-2 px-2 sm:mx-0 sm:px-6 pt-0 md:pt-0 lg:pt-0 mb-0 flex gap-3">
//                 {/* Mobile ONLY (<768) */}
//                 <div className="block md:hidden -mt-14 mb-2">
//                     <MobileMenuDrawer
//                     className="md:hidden" 
//                     tabs={TABS as unknown as string[]}
//                     activeIdx={tabIdx}
//                     onSelect={openTab}
//                     />
//                 </div>

//                 {/* Tablet ONLY (768–1023) */}
            
//                     <TabletMenuDropdown
//                     className="hidden md:block lg:hidden -mt-12 mb-2"
//                     tabs={TABS as unknown as string[]}
//                     activeIdx={tabIdx}
//                     onSelect={openTab}
//                     />

//             </div>

//             {/* Desktop grid */}
//             <div
//             className="
//             max-w-none lg:max-w-7xl mx-auto px-2 sm:px-6 pt-0 pb-8
//             grid grid-cols-1 gap-2
//             lg:[grid-template-columns:240px_1fr]
//             xl:[grid-template-columns:260px_1fr]
//             "
//             >
//                 {/* Sidebar ONLY (>=1024) */}
//                 <aside className="hidden lg:block lg:-ml-6 xl:-ml-10">
//                     <ProfileSidebar
//                     tabs={TABS as unknown as string[]}
//                     activeIdx={tabIdx}
//                     onSelect={openTab}
//                     />
//                 </aside>

//                 <main className="-mx-2 sm:mx-0 lg:pl-6 xl:pl-12">
//                     {tabIdx === 0 && <UserInfo />}
//                     {tabIdx === 1 && <ChildInfo />}
//                     {tabIdx === 2 && <YourEvents />}
//                     {tabIdx === 3 && <Notifications />}
//                 </main>
//             </div>
//         </div>
//     );
// }
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UserInfo from './userInfo/UserInfo';
import ChildInfo from './childInfo/ChildInfo';
import Notifications from './notifications/NotifInfo';
import YourEvents from './events/yourEvents/YourEvents';
import OpenModalButton from '@/context/openModalButton';
import DeleteUser from './userInfo/DeleteUser';
import { useUser } from '../../../hooks/useUser';
import { ProfileTopTabs, DEFAULT_TABS } from './ProfileTopTabs';
import { FaTrash } from 'react-icons/fa';

type TabKey = 'user' | 'child' | 'events' | 'notifications';
const idxToKey = (i: number): TabKey => (['user','child','events','notifications'] as TabKey[])[i];
const keyToIdx: Record<TabKey, number> = { user:0, child:1, events:2, notifications:3 };

export default function Profile() {
  const router = useRouter();
  const search = useSearchParams();
  const { user } = useUser();

  const initial = (search.get('tab') ?? 'user') as TabKey;
  const [tabIdx, setTabIdx] = useState<number>(() => keyToIdx[initial] ?? 0);

  const tabFromUrl = useMemo(() => (search.get('tab') ?? 'user') as TabKey, [search]);
  useEffect(() => setTabIdx(keyToIdx[tabFromUrl] ?? 0), [tabFromUrl]);

  const openTab = (idx: number) => {
    setTabIdx(idx);
    router.replace(`/profile?tab=${idxToKey(idx)}`);
  };

  const activeKey = idxToKey(tabIdx);

  return (
    <div className="bg-wonderbg min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3">
        <ProfileTopTabs
          className="-mt-16 md:-mt-8"
          tabs={DEFAULT_TABS}
          activeKey={activeKey}
          onChange={(key) => openTab(keyToIdx[key as TabKey])}
          renderDelete={(closeMenu) => (
            <OpenModalButton
              buttonText={
                <span className="flex items-center gap-2">
                  <FaTrash className="h-4 w-4" />
                  Delete Account
                </span>
              }
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl"
              modalComponent={<DeleteUser currUser={user} />}
              onButtonClick={closeMenu}
            />
          )}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pb-12 pt-4">
        {tabIdx === 0 && <UserInfo />}
        {tabIdx === 1 && <ChildInfo />}
        {tabIdx === 2 && <YourEvents />}
        {tabIdx === 3 && <Notifications />}
      </div>
    </div>
  );
}
