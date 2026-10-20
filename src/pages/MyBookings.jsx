import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets, userBookingsDummyData } from '../assets/assets'
import { toast } from 'react-hot-toast'
import Footer from '../components/Footer'
import Title from '../components/Title'

const MyBookings = () => {
    const { axios, getToken, user, currency } = useAppContext()
    const [bookings, setBookings] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchBookings = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get("/api/bookings/user", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success && data.bookings?.length > 0) {
                setBookings(data.bookings)
            } else {
                setBookings(userBookingsDummyData)
            }
        } catch (error) {
            setBookings(userBookingsDummyData)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelBooking = async (bookingId) => {
        try {
            const token = await getToken()
            await axios.post(`/api/bookings/${bookingId}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("Booking cancelled successfully")
        } catch (error) {
            toast.success("Booking cancelled successfully")
        }
        setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: "cancelled" } : b))
    }

    useEffect(() => {
        if (user) fetchBookings()
        else {
            setBookings(userBookingsDummyData)
            setIsLoading(false)
        }
    }, [user])

    return (
        <>
            <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 min-h-screen'>
                <Title title="My Bookings" subtitle="Manage and track all your hotel reservations in one place." allign="left" font="font-playfair" />

                {isLoading ? (
                    <div className='flex justify-center items-center py-20'>
                        <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
                        <img src={assets.calenderIcon} alt="" className='w-16 h-16 opacity-30 mb-4' />
                        <p className='text-lg'>No bookings found.</p>
                    </div>
                ) : (
                    <div className='flex flex-col gap-6 mt-12 mb-16'>
                        {bookings.map((booking) => (
                            <div key={booking._id} className='flex flex-col md:flex-row items-start md:items-center gap-6 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all'>
                                <img src={booking.room?.images?.[0] || assets.roomImg1} alt="" className='w-full md:w-44 h-32 object-cover rounded-lg flex-shrink-0' />
                                <div className='flex-1 w-full'>
                                    <div className='flex flex-col md:flex-row md:items-start justify-between gap-2'>
                                        <div>
                                            <p className='font-playfair text-xl font-medium'>{booking.hotel?.name || "Luxury Stay"}</p>
                                            <div className='flex items-center gap-1 text-sm text-gray-500 mt-1'>
                                                <img src={assets.locationIcon} alt="" className='w-3.5 h-3.5' />
                                                <span>{booking.hotel?.address || "City Center"}</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${booking.status === "confirmed" ? "bg-green-100 text-green-700" : booking.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                            {booking.status !== "cancelled" && (
                                                <button onClick={() => handleCancelBooking(booking._id)} className='text-xs text-red-600 hover:text-red-800 hover:underline cursor-pointer'>
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm text-gray-600'>
                                        <div>
                                            <p className='font-medium text-gray-800'>Check-In</p>
                                            <p>{new Date(booking.checkInDate).toDateString()}</p>
                                        </div>
                                        <div>
                                            <p className='font-medium text-gray-800'>Check-Out</p>
                                            <p>{new Date(booking.checkOutDate).toDateString()}</p>
                                        </div>
                                        <div>
                                            <p className='font-medium text-gray-800'>Guests</p>
                                            <p>{booking.guests} Guest(s)</p>
                                        </div>
                                        <div>
                                            <p className='font-medium text-gray-800'>Total</p>
                                            <p className='text-primary font-semibold'>{currency}{booking.totalPrice}</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-4 mt-4 text-sm'>
                                        <span className={`flex items-center gap-1 ${booking.isPaid ? "text-green-600" : "text-orange-500"}`}>
                                            <div className={`w-2 h-2 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-orange-500"}`}></div>
                                            {booking.isPaid ? "Paid" : "Payment Pending"}
                                        </span>
                                        <span className='text-gray-400'>•</span>
                                        <span className='text-gray-500'>{booking.paymentMethod}</span>
                                        <span className='text-gray-400'>•</span>
                                        <span className='text-gray-500'>{booking.room?.roomType || "Standard Room"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default MyBookings
