import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Footer = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const location = useLocation()

    const handleNavClick = (path) => {
        if (path === '/') {
            if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
                navigate('/')
            }
        } else if (path.startsWith('/#')) {
            const targetId = path.replace('/#', '')
            if (location.pathname === '/') {
                const el = document.getElementById(targetId)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            } else {
                navigate(path)
            }
        } else {
            navigate(path)
        }
    }

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (!email || !email.includes('@')) {
            return toast.error("Please enter a valid email address")
        }
        toast.success("Thank you for subscribing to QuickStay!")
        setEmail('')
    }

    return (
        <div className='bg-[#0F0D09] text-white/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-wrap justify-between gap-12 border-b border-white/20 pb-10'>
                <div className='max-w-80'>
                    <img src={assets.logo} alt="logo" className='h-9 invert opacity-80' />
                    <p className='text-sm mt-4 leading-relaxed'>
                        Discover a world of unparalleled luxury and comfort. From beachside retreats to city-center suites, we offer the finest accommodations for every traveler.
                    </p>
                    <div className='flex items-center gap-3 mt-6'>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer"><img src={assets.instagramIcon} alt="instagram" className='w-6 invert opacity-80 hover:opacity-100 transition-all' /></a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer"><img src={assets.facebookIcon} alt="facebook" className='w-6 invert opacity-80 hover:opacity-100 transition-all' /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer"><img src={assets.twitterIcon} alt="twitter" className='w-6 invert opacity-80 hover:opacity-100 transition-all' /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer"><img src={assets.linkendinIcon} alt="linkedin" className='w-6 invert opacity-80 hover:opacity-100 transition-all' /></a>
                    </div>
                </div>

                <div>
                    <p className='text-white font-medium text-base mb-4'>Company</p>
                    <ul className='flex flex-col gap-2 text-sm'>
                        <li><button onClick={() => handleNavClick('/')} className='hover:text-white transition-all text-left cursor-pointer'>Home</button></li>
                        <li><Link to="/rooms" onClick={() => scrollTo(0, 0)} className='hover:text-white transition-all'>Hotels</Link></li>
                        <li><button onClick={() => handleNavClick('/#experience')} className='hover:text-white transition-all text-left cursor-pointer'>Experience</button></li>
                        <li><button onClick={() => handleNavClick('/#about')} className='hover:text-white transition-all text-left cursor-pointer'>About</button></li>
                    </ul>
                </div>

                <div>
                    <p className='text-white font-medium text-base mb-4'>Support</p>
                    <ul className='flex flex-col gap-2 text-sm'>
                        <li><Link to="/rooms" onClick={() => scrollTo(0, 0)} className='hover:text-white transition-all'>Browse Catalog</Link></li>
                        <li><Link to="/my-bookings" onClick={() => scrollTo(0, 0)} className='hover:text-white transition-all'>My Bookings</Link></li>
                        <li><a href="mailto:support@quickstay.com" className='hover:text-white transition-all'>Contact Us</a></li>
                        <li><span className='hover:text-white transition-all cursor-pointer' onClick={() => toast.success("Free cancellation up to 24 hours before check-in")}>Cancellation Policy</span></li>
                    </ul>
                </div>

                <div className='max-w-80'>
                    <p className='text-white font-medium text-base mb-4'>Stay Updated</p>
                    <p className='text-sm mb-4'>Subscribe to our newsletter for exclusive offers and travel inspiration.</p>
                    <form onSubmit={handleSubscribe} className='flex items-center gap-2'>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className='bg-white/10 border border-white/20 rounded px-3 py-2 text-sm outline-none placeholder:text-white/50 flex-1 text-white' />
                        <button type="submit" className='bg-white text-black px-4 py-2 text-sm rounded font-medium hover:bg-gray-200 transition-all cursor-pointer'>Subscribe</button>
                    </form>
                </div>
            </div>

            <p className='text-center text-sm py-6 text-white/50'>
                © {new Date().getFullYear()} QuickStay. All rights reserved.
            </p>
        </div>
    )
}

export default Footer
