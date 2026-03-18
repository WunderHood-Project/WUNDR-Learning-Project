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
import Notifications from "./notifications/Notifications";
import EmailNotificationsToggle from "./userInfo/EmailNotificationsToggle";


type TabKey = 'user' | 'child' | 'events' | 'notifications';

export default function Profile() {
    const router = useRouter();
    const search = useSearchParams();
    const { user } = useUser();

    const visibleTabs = useMemo(
        () => DEFAULT_TABS.filter((t) => !(t.key === 'child' && user?.role === 'partner')),
        [user?.role]
    );

    const keyToIdx = useMemo(
        () => Object.fromEntries(visibleTabs.map((t, i) => [t.key, i])) as Record<string, number>,
        [visibleTabs]
    );

    const initial = (search.get('tab') ?? 'user') as TabKey;
    const [tabIdx, setTabIdx] = useState<number>(() => keyToIdx[initial] ?? 0);

    const tabFromUrl = useMemo(() => (search.get('tab') ?? 'user') as TabKey, [search]);
    useEffect(() => setTabIdx(keyToIdx[tabFromUrl] ?? 0), [tabFromUrl, keyToIdx]);

    const openTab = (key: string) => {
        setTabIdx(keyToIdx[key] ?? 0);
        router.replace(`/profile?tab=${key}`);
    };

    const activeKey = visibleTabs[tabIdx]?.key ?? 'user';

    const [notifUnread, setNotifUnread] = useState(0);


    return (
        <div className="w-full pb-0 md:pb-2">
            <ProfileTopTabs
                className="-mt-12 md:-mt-8"
                tabs={visibleTabs}
                activeKey={activeKey}
                onChange={openTab}
                notificationsUnread={notifUnread}
                renderDelete={(closeMenu) => (
                    <>
                    <div className="w-full px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 rounded-xl">
                        <EmailNotificationsToggle />
                    </div>
                    <OpenModalButton
                    buttonText={
                        <span className="flex items-center gap-2">
                        <FaTrash className="h-4 w-4" />
                            Delete Account
                        </span>
                    }
                    className="w-full px-5 py-0 text-sm text-red-600 hover:bg-red-50 rounded-xl mb-4"
                    modalComponent={<DeleteUser currUser={user} />}
                    onButtonClick={() => setTimeout(closeMenu, 0)}
                    />
                    </>

                )}
            />
            <div className="w-full pb-12">
                {activeKey === 'user'          && <UserInfo />}
                {activeKey === 'child'         && <ChildInfo />}
                {activeKey === 'events'        && <YourEvents />}
                {activeKey === 'notifications' && (
                    <Notifications onUnreadChange={setNotifUnread} />
                )}
            </div>
    </div>
    );
}
