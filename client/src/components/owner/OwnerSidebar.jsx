import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const OwnerSidebar = () => {
    const { setIsOwner } = useAppContext()

    const sidebarLinks = [
        { label: "Dashboard", path: "/owner", icon: assets.dashboardIcon },
        { label: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
        { label: "List Rooms", path: "/owner/list-rooms", icon: assets.listIcon },
    ]

    return (
        <div className='flex flex-col items-start gap-2 pt-28 md:pt-35 min-h-screen border-r border-gray-300 text-sm w-16 md:w-64 transition-all'>
            {sidebarLinks.map((link) => (
                <NavLink key={link.path} to={link.path} end={link.path === "/owner"}
                    className={({ isActive }) => `flex items-center gap-3 w-full px-4 py-3 font-medium transition-all ${isActive ? "bg-primary/10 text-primary border-r-4 border-primary" : "text-gray-600 hover:bg-gray-50"}`}
                >
                    <img src={link.icon} alt={link.label} className='w-5 h-5 min-w-5' />
                    <span className='hidden md:block'>{link.label}</span>
                </NavLink>
            ))}
        </div>
    )
}

export default OwnerSidebar
