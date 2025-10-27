"use client";

import React, { useState } from "react"
import { FaPen } from "react-icons/fa"
import UpdateUserForm from "./UpdateUserForm"
import OpenModalButton from "@/context/openModalButton"
import DeleteUser from "./DeleteUser"
import { e164toUS } from "../../../../utils/formatPhoneNumber";
import { useUser } from "../../../../hooks/useUser";
import UserHeader from './UserHeader';
import InfoCard from './InfoCard';
import ChildrenList from './ChildrenList';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';



const UserInfo = () => {
    const { user, loading, error, refetch } = useUser()
    const [editing, setEditing] = useState(false)
    // console.log('user info', user)

    if (loading) return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>
    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-red-500">
                Error: {error}
                <button onClick={refetch} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
                    Retry
                </button>
            </div>
        </div>
    )

    return (
       <div className="space-y-6">
        {/* 1) Шапка с именем, бейджами и Edit */}
        <UserHeader
        
        name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || '—'}
        // subtitle="testing"
        childrenCount={user?.children?.length ?? 0}
        onEdit={() => setEditing((v) => !v)}
        />

        {/* 2) Если режим редактирования — показываем форму и выходим */}
        {editing ? (
        <UpdateUserForm
            currUser={user}
            onSaved={() => {
            refetch();
            setEditing(false);
            }}
            onCancel={() => setEditing(false)}
        />
        ) : (
        <>
            {/* 3) Карточки email/phone в два столбца */}
            <div className="grid sm:grid-cols-2 gap-4">
            <InfoCard
                icon={<FaEnvelope className="text-wondergreen" />}
                label="Email"
                value={user?.email}
            />
            <InfoCard
                icon={<FaPhone className="text-wondergreen" />}
                label="Phone"
                value={e164toUS(user?.phoneNumber ?? '')}
            />
            </div>

            {/* 4) Адрес на всю ширину */}
            <InfoCard
            icon={<FaMapMarkerAlt className="text-wondergreen" />}
            label="Address"
            value={
                [user?.address, [user?.city, user?.state, user?.zipCode].filter(Boolean).join(', ') ]
                .filter(Boolean)
                .join(', ')
            }
            />

            {/* 5) Секция Children */}
            <ChildrenList
            items={
                (user?.children ?? []).map((c) => ({
                id: c.id,
                name: `${c.firstName} ${c.lastName}`,
                // пример подзаголовка — если есть возраст/статус, можно подставить здесь
                subtitle: 'Registered',
                })) as { id: string; name: string; subtitle?: string }[]
            }
            />
        </>
        )}

            <OpenModalButton
                buttonText="DELETE ACCOUNT"
                className="block mx-auto mt-[100px] border rounded-lg py-3 px-5 bg-red-400 hover:bg-red-500 text-white"
                modalComponent={<DeleteUser currUser={user} />}
            />
        </div>
    )
}

export default UserInfo
