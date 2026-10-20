import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='bg-[#0F0D09] text-white/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-wrap justify-between gap-12 border-b border-white/20 pb-10'>
                <div className='max-w-80'>
                    <img src={assets.logo} alt="logo" className='h-9 invert opacity-80' />
                    <p className='text-sm mt-4 leading-relaxed'>
                        Discover a world of unparalleled luxury and comfort. From beachside retreats to city-center suites, we offer the finest accommodations for every traveler.
                    </p>
                    <div className='flex items-center gap-3 mt-6'>
                        <a href="#"><img src={assets.instagramIcon} alt="instagram" className='w-6 invert opacity-80 hover:opacity-100 transition-all' /></a>
                        <a href="#"><img src={assets.facebookIcon} alt="facebook" className='w-6 invert opacity-80 hover:opacity-100 transition-all' /></a>
                        <a href="#"><img src={assets.twitterIcon} alt="twitter" className='w-6 invert opacity-80 hover:opacity-100 transition-all' /></a>
                        <a href="#"><img src={assets.linkendinIcon} alt="linkedin" className='w-6 invert opacity-80 hover:opacity-100 transition-all' /></a>
                    </div>
                </div>

                <div>
                    <p className='text-white font-medium text-base mb-4'>Company</p>
                    <ul className='flex flex-col gap-2 text-sm'>
                        <li><Link to="/" className='hover:text-white transition-all'>Home</Link></li>
                        <li><Link to="/rooms" className='hover:text-white transition-all'>Hotels</Link></li>
                        <li><a href="#" className='hover:text-white transition-all'>Experience</a></li>
                        <li><a href="#" className='hover:text-white transition-all'>About</a></li>
                    </ul>
                </div>

                <div>
                    <p className='text-white font-medium text-base mb-4'>Support</p>
                    <ul className='flex flex-col gap-2 text-sm'>
                        <li><a href="#" className='hover:text-white transition-all'>Help Center</a></li>
                        <li><a href="#" className='hover:text-white transition-all'>Cancellation Policy</a></li>
                        <li><a href="#" className='hover:text-white transition-all'>Safety Information</a></li>
                        <li><a href="#" className='hover:text-white transition-all'>Contact Us</a></li>
                    </ul>
                </div>

                <div className='max-w-80'>
                    <p className='text-white font-medium text-base mb-4'>Stay Updated</p>
                    <p className='text-sm mb-4'>Subscribe to our newsletter for exclusive offers and travel inspiration.</p>
                    <div className='flex items-center gap-2'>
                        <input type="email" placeholder="Enter your email" className='bg-white/10 border border-white/20 rounded px-3 py-2 text-sm outline-none placeholder:text-white/50 flex-1' />
                        <button className='bg-white text-black px-4 py-2 text-sm rounded font-medium hover:bg-gray-200 transition-all cursor-pointer'>Subscribe</button>
                    </div>
                </div>
            </div>

            <p className='text-center text-sm py-6 text-white/50'>
                © {new Date().getFullYear()} QuickStay. All rights reserved.
            </p>
        </div>
    )
}

export default Footer
