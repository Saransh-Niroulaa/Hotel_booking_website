import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData, roomsDummyData } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'
import Footer from '../components/Footer'

const RoomDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { rooms, currency, getToken, user, axios } = useAppContext()
    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const [checkInDate, setCheckInDate] = useState("")
    const [checkOutDate, setCheckOutDate] = useState("")
    const [guests, setGuests] = useState(1)
    const [isAvailable, setIsAvailable] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const found = rooms.find(r => r._id === id) || roomsDummyData.find(r => r._id === id)
        if (found) {
            setRoom(found)
            setMainImage(found.images[0])
        }
    }, [id, rooms])

    const checkAvailability = async () => {
        if (!checkInDate || !checkOutDate) {
            return toast.error("Please select check-in and check-out dates")
        }
        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            return toast.error("Check-out must be after check-in")
        }
        setIsLoading(true)
        try {
            const { data } = await axios.post("/api/bookings/check-availability", {
                room: id,
                checkInDate,
                checkOutDate
            })
            if (data.success) {
                if (data.isAvailable) {
                    setIsAvailable(true)
                    toast.success("Room is available!")
                } else {
                    setIsAvailable(false)
                    toast.error("Room is not available for selected dates")
                }
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleBooking = async () => {
        if (!user) return toast.error("Please login to book a room")
        if (!isAvailable) return toast.error("Please check availability first")
        setIsLoading(true)
        try {
            const token = await getToken()
            const totalNights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
            const totalPrice = totalNights * room.pricePerNight
            const { data } = await axios.post("/api/bookings", {
                room: id,
                hotel: room.hotel?._id || "default_hotel",
                checkInDate,
                checkOutDate,
                totalPrice,
                guests,
                paymentMethod: "Pay At Hotel"
            }, { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                toast.success("Booking confirmed!")
                setIsAvailable(false)
                setCheckInDate("")
                setCheckOutDate("")
                setGuests(1)
                setTimeout(() => navigate('/my-bookings'), 1200)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (!room) return null

    const totalNights = checkInDate && checkOutDate ? Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)) : 0

    return (
        <>
            <div className='pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
                {/* Room Header */}
                <div className='flex flex-col md:flex-row md:items-center justify-between gap-2'>
                    <div>
                        <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name} <span className='font-inter text-sm text-gray-500 border border-gray-300 px-3 py-1 rounded-full ml-2'>{room.roomType}</span></h1>
                        <div className='flex items-center gap-2 mt-2 text-sm text-gray-500'>
                            <img src={assets.locationIcon} alt="" />
                            <span>{room.hotel.address}</span>
                        </div>
                    </div>
                    <div className='text-right'>
                        <p className='text-2xl font-medium'>{currency}{room.pricePerNight} <span className='text-sm font-normal text-gray-500'>/night</span></p>
                        <div className='flex items-center gap-1 justify-end mt-1'>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <img key={i} src={i < 4 ? assets.starIconFilled : assets.starIconOutlined} alt="" className='w-4 h-4' />
                            ))}
                            <span className='text-sm text-gray-500 ml-1'>(128 reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className='flex flex-col lg:flex-row gap-4 mt-8'>
                    <div className='lg:w-1/2'>
                        <img src={mainImage} alt="" className='w-full h-80 lg:h-96 object-cover rounded-xl' />
                    </div>
                    <div className='lg:w-1/2 grid grid-cols-2 gap-4'>
                        {room.images.map((img, i) => (
                            <img key={i} src={img} alt="" onClick={() => setMainImage(img)} className={`w-full h-36 lg:h-44 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-all ${mainImage === img ? "outline-2 outline-primary" : ""}`} />
                        ))}
                    </div>
                </div>

                {/* Details + Booking */}
                <div className='flex flex-col lg:flex-row gap-12 mt-12 mb-16'>
                    <div className='lg:w-2/3'>
                        <div className='flex flex-wrap gap-4 mt-3'>
                            {room.amenities.map((amenity, i) => (
                                <div key={i} className='flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium'>
                                    <img src={facilityIcons[amenity]} alt={amenity} className='w-5 h-5' />
                                    {amenity}
                                </div>
                            ))}
                        </div>

                        <p className='text-gray-500 mt-8 leading-relaxed text-sm'>
                            Experience the finest in luxury accommodation at {room.hotel.name}. This stunning {room.roomType} offers breathtaking views and premium amenities to make your stay truly unforgettable. Perfect for both business and leisure travelers seeking an exceptional experience in the heart of the city.
                        </p>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>
                            {roomCommonData.map((item, i) => (
                                <div key={i} className='flex items-start gap-3 p-4 border border-gray-200 rounded-xl'>
                                    <img src={item.icon} alt={item.title} className='w-6 h-6 mt-0.5' />
                                    <div>
                                        <p className='font-medium text-gray-800 text-sm'>{item.title}</p>
                                        <p className='text-gray-500 text-xs mt-1'>{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className='lg:w-1/3'>
                        <div className='border border-gray-300 rounded-2xl p-6 shadow-sm sticky top-28'>
                            <p className='text-2xl font-medium'>{currency}{room.pricePerNight} <span className='text-sm font-normal text-gray-500'>/night</span></p>

                            <div className='flex flex-col gap-4 mt-6'>
                                <div>
                                    <label className='text-sm text-gray-600'>Check-In</label>
                                    <input type="date" value={checkInDate} min={new Date().toISOString().split("T")[0]} onChange={e => { setCheckInDate(e.target.value); setIsAvailable(false) }} className='w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm outline-none' />
                                </div>
                                <div>
                                    <label className='text-sm text-gray-600'>Check-Out</label>
                                    <input type="date" value={checkOutDate} min={checkInDate || new Date().toISOString().split("T")[0]} onChange={e => { setCheckOutDate(e.target.value); setIsAvailable(false) }} className='w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm outline-none' />
                                </div>
                                <div>
                                    <label className='text-sm text-gray-600'>Guests</label>
                                    <input type="number" min={1} max={4} value={guests} onChange={e => setGuests(Number(e.target.value))} className='w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 text-sm outline-none' />
                                </div>
                            </div>

                            {totalNights > 0 && (
                                <div className='border-t border-gray-200 mt-6 pt-4 text-sm text-gray-600'>
                                    <div className='flex justify-between'>
                                        <span>{currency}{room.pricePerNight} × {totalNights} nights</span>
                                        <span>{currency}{room.pricePerNight * totalNights}</span>
                                    </div>
                                    <div className='flex justify-between mt-2 font-medium text-gray-800'>
                                        <span>Total</span>
                                        <span>{currency}{room.pricePerNight * totalNights}</span>
                                    </div>
                                </div>
                            )}

                            {!isAvailable ? (
                                <button onClick={checkAvailability} disabled={isLoading} className='w-full bg-black text-white py-3 rounded-xl mt-6 font-medium hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-60'>
                                    {isLoading ? "Checking..." : "Check Availability"}
                                </button>
                            ) : (
                                <button onClick={handleBooking} disabled={isLoading} className='w-full bg-primary text-white py-3 rounded-xl mt-6 font-medium hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-60'>
                                    {isLoading ? "Booking..." : "Book Now"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default RoomDetails
