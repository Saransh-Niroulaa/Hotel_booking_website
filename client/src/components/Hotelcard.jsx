import React from 'react'

export const Hotelcard = ({room,index}) => {
    return (
        <Link to={`/room/`+room._id} onClick={()=> scrollTo(0,0)} key={room._id}>
            <img src={room.images[0]} alt="" className='relative max-w-full rounded-x1 overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]'/>
            {index%2 ===0 && (
                <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-grey-800 font-medium rounded-full' >
                    best Seller
                </p>
            )}
            <div className='p-4 pt-5'>
                <div className='flex items-center justify-between'>
                    <p  className='font-playfair text-xl font-medium text-grey-800'>
                        {room.hotel.name}
                    </p>
                    <div className='flex items-center gap-1'>
                        <img src={assets.starIcon} alt=""/> 4.5
                    </div>
                </div>
                <div>
                    <img src={assets.locationIcon} alt="" />
                    <span>{room.hotel.address}</span>
                </div>
                <div className='flex items-center justify-between mt-4'>
                    <p><span className='text-xl text-grey-800'>$</span>{room.pricePerNight}<span className='text-gray-500'>/night</span></p>
                    <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer'>Book Now</button>
                </div>
            </div>
        </Link>
    )
}
export default Hotelcard