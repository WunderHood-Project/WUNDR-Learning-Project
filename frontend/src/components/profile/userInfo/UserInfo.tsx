"use client";

import React, { useState } from "react"
import UpdateUserForm from "./UpdateUserForm"
import { e164toUS } from "../../../../utils/formatPhoneNumber";
import { useUser } from "../../../../hooks/useUser";
import UserHeader from './UserHeader';
import InfoCard from './InfoCard';
import ChildrenList from './ChildrenList';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';


const UserInfo = () => {
    const { user, loading, error, refetch } = useUser()
    const [editing, setEditing] = useState(false)

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

    const childrenItems =
    (user?.children ?? []).map((c) => ({
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      subtitle: 'Registered',
    })) as { id: string; name: string; subtitle?: string }[];


    return (
       <div className="space-y-6">
        {/* Heder with name and badges and  Edit */}
        <UserHeader
        name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
        childrenCount={user?.children?.length ?? 0}
        onEdit={() => setEditing((v) => !v)}
        />

        {/* Edit form and exit  */}
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
            {/* email/phone  */}
            <div className="grid sm:grid-cols-2 gap-4">
            <InfoCard
                icon={<FaEnvelope className="text-wondergreen" />}
                label="Email"
                value={user?.email}
                large
            />
            <InfoCard
                icon={<FaPhone className="text-wondergreen" />}
                label="Phone"
                value={e164toUS(user?.phoneNumber ?? '')}
            />
            </div>

            {/* Address */}
            <InfoCard
            icon={<FaMapMarkerAlt className="text-wondergreen" />}
            label="Address"
            value={
                [
                user?.address ?? '',
                [user?.city, user?.state, user?.zipCode].filter(Boolean).join(', ')
                ]
                .filter(Boolean)
                .join('\n') 
            }
            />

            {/* Section Children */}
             <ChildrenList
            items={childrenItems}
            showCTA={true}
            ctaHref="/profile?tab=child&open=add"
          />

        </>
        )}
        {/* <OpenModalButton
            buttonText="DELETE ACCOUNT"
            className="block mx-auto mt-[100px] border rounded-lg py-3 px-5 bg-red-400 hover:bg-red-500 text-white"
            modalComponent={<DeleteUser currUser={user} />}
        /> */}
        </div>
    )
}

export default UserInfo
