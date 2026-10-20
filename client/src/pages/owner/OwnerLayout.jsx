import React from 'react'
import { Outlet } from 'react-router-dom'
import OwnerSidebar from '../../components/owner/OwnerSidebar'
import Navbar from '../../components/Navbar'

const OwnerLayout = () => {
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
