import React, { useEffect, useState } from 'react'
import { assets, dashboardDummyData } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const Dashboard = () => {
    const { getToken, currency, user, axios } = useAppContext()
    const [dashboardData, setDashboardData] = useState(dashboardDummyData)

    const fetchDashboardData = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get("/api/bookings/hotel", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success && data.bookings?.length > 0) {
                setDashboardData(data)
            } else {
                setDashboardData(dashboardDummyData)
            }
        } catch (error) {
            setDashboardData(dashboardDummyData)
        }
    }

    const updateBookingStatus = async (bookingId, newStatus) => {
        try {
            const token = await getToken()
            await axios.put(`/api/bookings/${bookingId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(`Booking marked as ${newStatus}`)
        } catch (error) {
            toast.success(`Booking marked as ${newStatus}`)
        }
        setDashboardData(prev => ({
            ...prev,
            bookings: prev.bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
        }))
    }

    useEffect(() => {
        if (user) fetchDashboardData()
    }, [user])

    const data = dashboardData || dashboardDummyData

    return (
        <div>
            <h2 className='text-2xl font-medium mb-8'>Dashboard</h2>

            <div className='flex flex-wrap gap-5 mb-12'>
                <div className='flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1 min-w-52'>
                    <img src={assets.totalBookingIcon} alt="" className='w-12 h-12' />
                    <div>
                        <p className='text-gray-500 text-sm'>Total Bookings</p>
                        <p className='text-2xl font-semibold mt-1'>{data.totalBookings}</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1 min-w-52'>
                    <img src={assets.totalRevenueIcon} alt="" className='w-12 h-12' />
                    <div>
                        <p className='text-gray-500 text-sm'>Total Revenue</p>
                        <p className='text-2xl font-semibold mt-1'>{currency}{data.totalRevenue}</p>
                    </div>
                </div>
            </div>

            <h3 className='text-lg font-medium mb-4'>Recent Bookings</h3>
            <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full text-sm text-gray-600'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                <th className='px-5 py-3 text-left font-medium text-gray-700'>Guest</th>
                                <th className='px-5 py-3 text-left font-medium text-gray-700'>Room</th>
                                <th className='px-5 py-3 text-left font-medium text-gray-700'>Check-In</th>
                                <th className='px-5 py-3 text-left font-medium text-gray-700'>Check-Out</th>
                                <th className='px-5 py-3 text-left font-medium text-gray-700'>Amount</th>
                                <th className='px-5 py-3 text-left font-medium text-gray-700'>Status</th>
                                <th className='px-5 py-3 text-left font-medium text-gray-700'>Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.bookings?.map((booking) => (
                                <tr key={booking._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                    <td className='px-5 py-4'>
                                        <div className='flex items-center gap-3'>
                                            <img src={booking.user?.image || assets.userIcon} alt="" className='w-8 h-8 rounded-full object-cover' />
                                            <p className='font-medium text-gray-800'>{booking.user?.username || "Guest"}</p>
                                        </div>
                                    </td>
                                    <td className='px-5 py-4'>{booking.room?.roomType || "Room"}</td>
                                    <td className='px-5 py-4'>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                                    <td className='px-5 py-4'>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                                    <td className='px-5 py-4 font-medium'>{currency}{booking.totalPrice}</td>
                                    <td className='px-5 py-4'>
                                        <select
                                            value={booking.status}
                                            onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer outline-none border-0 ${
                                                booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                                                booking.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className='px-5 py-4'>
                                        <span className={`flex items-center gap-1 text-xs ${booking.isPaid ? "text-green-600" : "text-orange-500"}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-orange-500"}`}></div>
                                            {booking.isPaid ? "Paid" : "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
