import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const About = () => {
    const navigate = useNavigate()

    const features = [
        {
            icon: assets.badgeIcon,
            title: "Handpicked Luxury",
            description: "Every suite and hotel in our catalog is vetted against rigorous quality, design, and cleanliness standards."
        },
        {
            icon: assets.heartIcon,
            title: "Best Rate Guarantee",
            description: "Direct partnerships with top hoteliers ensure you always receive exclusive packages and the best available rates."
        },
        {
            icon: assets.userIcon,
            title: "24/7 Concierge Service",
            description: "Our dedicated guest experience team is available round-the-clock to assist with personalized itineraries and special requests."
        },
        {
            icon: assets.locationFilledIcon,
            title: "Prime Prime Locations",
            description: "Stay in the heart of iconic cities and serene natural escapes, perfectly situated for discovery and relaxation."
        }
    ]

    const stats = [
        { value: "1,200+", label: "Verified Rooms" },
        { value: "45+", label: "Destinations" },
        { value: "50K+", label: "Happy Guests" },
        { value: "4.9/5", label: "Guest Satisfaction" }
    ]

    return (
        <section id="about" className='px-6 md:px-16 lg:px-24 xl:px-32 py-20 bg-white'>
            <Title 
                title="About QuickStay" 
                subtitle="Redefining luxury travel with handpicked accommodations, curated comfort, and seamless hospitality worldwide." 
                allign="center" 
                font="font-playfair" 
            />

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16'>
                {features.map((feature, index) => (
                    <div key={index} className='border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all flex flex-col justify-between bg-slate-50/50'>
                        <div>
                            <div className='w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center mb-4'>
                                <img src={feature.icon} alt="" className='w-6 h-6' />
                            </div>
                            <h3 className='font-playfair text-xl font-medium text-gray-800 mb-2'>{feature.title}</h3>
                            <p className='text-gray-500 text-sm leading-relaxed'>{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='bg-[#0F0D09] text-white rounded-2xl p-8 md:p-12 mt-16 flex flex-wrap items-center justify-between gap-8'>
                <div className='max-w-md'>
                    <p className='text-primary text-xs tracking-wider uppercase font-medium'>Our Mission</p>
                    <h3 className='font-playfair text-2xl md:text-3xl font-semibold mt-2'>Crafting Unforgettable Journeys</h3>
                    <p className='text-white/70 text-sm mt-3 leading-relaxed'>
                        Founded to bring transparency, elegance, and effortless booking to modern travelers. Whether for a peaceful weekend retreat or an international journey, QuickStay connects you to the world’s most remarkable stays.
                    </p>
                    <div className='flex items-center gap-4 mt-6'>
                        <button onClick={() => { navigate('/rooms'); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className='bg-white text-black px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all cursor-pointer'>
                            Explore Hotels
                        </button>
                        <a href="mailto:support@quickstay.com" className='border border-white/30 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-all'>
                            Contact Support
                        </a>
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-6 md:gap-10 border-t md:border-t-0 md:border-l border-white/15 pt-6 md:pt-0 md:pl-10'>
                    {stats.map((stat, i) => (
                        <div key={i}>
                            <p className='font-playfair text-3xl md:text-4xl font-bold text-white'>{stat.value}</p>
                            <p className='text-xs md:text-sm text-white/60 mt-1'>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default About
