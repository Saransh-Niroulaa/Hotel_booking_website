import React from 'react'
import { Outlet } from 'react-router-dom'
import OwnerSidebar from '../../components/owner/OwnerSidebar'
import Navbar from '../../components/Navbar'
import { useClerk, useUser } from '@clerk/react'

const OwnerLayout = () => {
    const { user, isLoaded } = useUser()
    const { openSignIn } = useClerk()

    if (isLoaded && !user) {
        return (
            <div>
                <Navbar />
                <div className='flex flex-col items-center justify-center min-h-[70vh] px-4 text-center'>
                    <h2 className='text-2xl font-medium mb-3'>Owner Dashboard</h2>
                    <p className='text-gray-500 mb-6 max-w-md text-sm'>Please sign in with your account to access the hotel owner dashboard, manage rooms, and view reservations.</p>
                    <button onClick={() => openSignIn()} className='bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all cursor-pointer'>
                        Sign In to Continue
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar />
            <div className='flex'>
                <OwnerSidebar />
                <div className='flex-1 p-6 md:p-10 overflow-y-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default OwnerLayout
