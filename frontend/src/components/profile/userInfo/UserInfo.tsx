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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wondergreen mx-auto mb-4"></div>
                    <p className="text-wondergreen font-semibold">Loading...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="text-center px-4">
                    <p className="text-red-500 font-semibold mb-4">Error: {error}</p>
                    <button 
                        onClick={refetch} 
                        className="bg-wondergreen hover:bg-wonderleaf text-white px-6 py-2.5 rounded-lg font-semibold transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    const childrenItems =
        (user?.children ?? []).map((c) => ({
            id: c.id,
            name: `${c.firstName} ${c.lastName}`,
            subtitle: 'Registered',
        })) as { id: string; name: string; subtitle?: string }[];

    return (
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Header with name and badges */}
            <UserHeader
                name={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()}
                childrenCount={user?.children?.length ?? 0}
                onEdit={() => setEditing((v) => !v)}
            />

            {/* Edit form OR Content */}
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
                    {/* Contact Info Cards - Stacked on mobile, 2 cols on md+ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-4">
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

                    {/* Address Card */}
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

                    {/* Children Section */}
                    <ChildrenList
                        items={childrenItems}
                        showCTA={true}
                        ctaHref="/profile?tab=child&open=add"
                    />
                </>
            )}
        </div>
    )
}

export default UserInfo