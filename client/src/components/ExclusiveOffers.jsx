import React from 'react'
import { assets, exclusiveOffers } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Title from './Title'

const ExclusiveOffers = () => {
    const navigate = useNavigate()

    const handleOfferBooking = (offer) => {
        toast.success(`Package "${offer.title}" selected! (${offer.priceOff}% discount applied)`)
        navigate(`/rooms?offer=${encodeURIComponent(offer.title)}`)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <section id="experience" className='flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-24'>
            <div className='flex flex-col md:flex-row items-center justify-between w-full'>
                <Title 
                    title="Exclusive Experiences & Offers" 
                    subtitle="Take advantage of our curated packages and limited-time savings designed to elevate your stay." 
                    allign="left" 
                    font="font-playfair" 
                />
                <button onClick={() => { navigate('/rooms'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className='group flex items-center gap-2 font-medium cursor-pointer mt-6 md:mt-0 text-sm'>
                    View All Experiences
                    <img src={assets.arrowIcon} alt="" className='group-hover:translate-x-1 transition-all' />
                </button>
            </div>

            <div className='flex flex-wrap items-center justify-center gap-6 mt-16 w-full'>
                {exclusiveOffers.map((offer) => (
                    <div key={offer._id} className='relative flex flex-col items-start justify-between gap-1 pt-16 px-5 pb-6 rounded-2xl text-white overflow-hidden w-full sm:w-80 shadow-md group hover:shadow-xl transition-all'>
                        <img src={offer.image} alt="" className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent' />
                        <p className='relative bg-primary px-3 py-1 text-xs rounded-full font-semibold shadow-sm'>{offer.priceOff}% OFF</p>
                        <div className='relative mt-12'>
                            <p className='text-xl font-medium font-playfair'>{offer.title}</p>
                            <p className='text-xs text-white/85 mt-1.5 leading-relaxed'>{offer.description}</p>
                            <p className='text-[11px] text-white/60 mt-2'>Valid until {offer.expiryDate}</p>
                        </div>
                        <button onClick={() => handleOfferBooking(offer)} className='relative px-4 py-2 text-xs font-semibold bg-white text-black rounded-lg hover:bg-gray-100 transition-all mt-4 cursor-pointer shadow-sm'>
                            Book Experience
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ExclusiveOffers

