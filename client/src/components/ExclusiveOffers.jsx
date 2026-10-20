import React from 'react'
import { assets, exclusiveOffers } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import Title from './Title'

const ExclusiveOffers = () => {
    const navigate = useNavigate()

    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30'>
            <div className='flex flex-col md:flex-row items-center justify-between w-full'>
                <Title title="Exclusive Offers" subtitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories." allign="left" font="font-playfair" />
                <button onClick={() => { navigate('/rooms'); scrollTo(0, 0) }} className='group flex items-center gap-2 font-medium cursor-pointer mt-6 md:mt-0'>
                    View All Offers
                    <img src={assets.arrowIcon} alt="" className='group-hover:translate-x-1 transition-all' />
                </button>
            </div>

            <div className='flex flex-wrap items-center gap-6 mt-20'>
                {exclusiveOffers.map((offer) => (
                    <div key={offer._id} className='relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 pb-6 rounded-xl text-white overflow-hidden w-72'>
                        <img src={offer.image} alt="" className='absolute inset-0 w-full h-full object-cover' />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent' />
                        <p className='relative bg-primary px-3 py-1 text-xs rounded-full font-medium'>{offer.priceOff}% OFF</p>
                        <div className='relative'>
                            <p className='text-xl font-medium font-playfair'>{offer.title}</p>
                            <p className='text-sm text-white/80 mt-1'>{offer.description}</p>
                        </div>
                        <button onClick={() => { navigate('/rooms'); scrollTo(0, 0) }} className='relative px-4 py-2 text-sm font-medium bg-white text-black rounded hover:bg-gray-100 transition-all mt-2 cursor-pointer'>
                            Book Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ExclusiveOffers
