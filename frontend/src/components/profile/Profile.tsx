import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../../../hooks/useUser";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_TABS, ProfileTopTabs } from "./ProfileTopTabs";
import OpenModalButton from "@/context/openModalButton";
import { FaTrash } from "react-icons/fa";
import DeleteUser from "./userInfo/DeleteUser";
import UserInfo from "./userInfo/UserInfo";
import ChildInfo from "./children/childInfo/ChildInfo";
import YourEvents from "./events/yourEvents/YourEvents";
import Notifications from "./notifications/NotificationsPage";


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
