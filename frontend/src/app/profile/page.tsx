'use client'

import Profile from '../../components/profile/Profile'
import { Suspense } from "react"

export default function ProfilePage() {
    return (
        <div className="px-2 md:px-6 lg:px-6 py-20 max-w-5xl md:max-w-7xl mx-auto bg-wonderbg min-h-screen">
            <Suspense fallback={<>...</>}>
                <Profile />
            </Suspense>
        </div>
    );
}
