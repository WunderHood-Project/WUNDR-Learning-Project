'use client'

import Profile from '../../components/profile/Profile'
import { Suspense } from "react"

export default function ProfilePage() {
    return (
         <div className="bg-wonderbg min-h-screen">
            <div className="mx-auto w-full max-w-5xl md:max-w-6xl lg:max-w-7xl px-3 sm:px-6 lg:px-8 py-20">
                <Suspense fallback={<>...</>}>
                    <Profile />
                </Suspense>
            </div>
        </div>
    );
}
