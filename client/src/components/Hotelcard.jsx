import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

export const Hotelcard = ({ room, index }) => {
    const { currency } = useAppContext()

    return (
        <Link to={`/room/` + room._id} onClick={() => scrollTo(0, 0)} className='relative block max-w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all'>
            <img src={room.images[0]} alt="" className='w-full h-48 object-cover' />
            {index % 2 === 0 && (
                <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full shadow-sm'>
                    Best Seller
                </p>
            )}
            <div className='p-4 pt-5'>
                <div className='flex items-center justify-between'>
                    <p className='font-playfair text-xl font-medium text-gray-800'>
                        {room.hotel?.name}
                    </p>
                    <div className='flex items-center gap-1 text-sm'>
                        <img src={assets.starIconFilled} alt="" className='w-4 h-4' /> {room.rating || 4.5}
                    </div>
                </div>
                <div className='flex items-center gap-1 mt-1 text-sm text-gray-500'>
                    <img src={assets.locationIcon} alt="" className='w-4 h-4' />
                    <span>{room.hotel?.address}</span>
                </div>
                <div className='flex items-center justify-between mt-4'>
                    <p><span className='text-xl text-gray-800 font-medium'>{currency || "$"}</span>{room.pricePerNight}<span className='text-gray-500 text-sm'>/night</span></p>
                    <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer'>Book Now</button>
                </div>
            </div>
        </Link>
    )
}
export default Hotelcard