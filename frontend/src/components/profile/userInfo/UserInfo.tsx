"use client";

import React, { useEffect, useState } from "react"
import { FaPen } from "react-icons/fa"
import UpdateUserForm from "./UpdateUserForm"
import OpenModalButton from "@/context/openModalButton"
import DeleteUser from "./DeleteUser"
import { e164toUS } from "../../../../utils/formatPhoneNumber";
import { useUser } from "../../../../hooks/useUser";


const UserInfo = () => {
    const { user, loading, error, refetch } = useUser()
    const [editing, setEditing] = useState(false)

    //stops the multiple renders
    useEffect(() => { user }, [user])

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
        <div>
            <div className="text-center mb-[35px]">
                <h1 className="text-4xl font-bold text-wondergreen mb-4">Your Account Information</h1>
                <div className="flex flex-row gap-2 max-w-2xl justify-center mx-auto">
                    <h2 className="text-lg text-wondergreen">Manage your profile</h2>
                    <FaPen onClick={() => setEditing(v => !v)}/>
                </div>
            </div>

            {editing ? (
                <UpdateUserForm
                    currUser={user}
                    onSaved={() => {
                        refetch()
                        setEditing(false)
                    }}
                    onCancel={() => setEditing(false)}
                />
            ) : (
                <div className="bg-white shadow rounded-lg max-w-md mx-auto p-10">
                    <div className="space-y-2">
                        <div className="flex flex-row justify-around">
                            <div className="flex flex-col text-center">
                                <div className="mb-2">{user?.firstName} {user?.lastName}</div>
                                <div className="mb-2">{user?.email}</div>
                                <div className="mb-2">{e164toUS(user?.phoneNumber ?? "")}</div>
                                <div>{user?.address}</div>
                                <div>{user?.city}, {user?.state} {user?.zipCode}</div>
                                <div>Children</div>
                                {user?.children?.length ? (
                                    <ul className="list-disc pl-5">
                                        {user.children.map(child => (
                                            <li key={child.id}>{child.firstName} {child.lastName}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No children yet.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
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
