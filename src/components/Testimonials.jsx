import React from 'react'
import { assets, testimonials } from '../assets/assets'
import Title from './Title'

const Testimonials = () => {
    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 py-20 bg-slate-50'>
            <Title title="What Our Guests Say" subtitle="Discover why discerning travelers consistently choose QuickStay for their luxury accommodations around the world." allign="center" font="font-playfair" />

            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className='bg-white p-6 rounded-xl shadow-[0px_4px_4px_rgba(0,0,0,0.05)] max-w-72 md:max-w-80'>
                        <div className='flex items-center gap-3'>
                            <img src={testimonial.image} alt={testimonial.name} className='w-12 h-12 rounded-full object-cover' />
                            <div>
                                <p className='font-playfair text-xl'>{testimonial.name}</p>
                                <p className='text-gray-500 text-sm'>{testimonial.address}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-1 mt-4'>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <img key={i} src={i < testimonial.rating ? assets.starIconFilled : assets.starIconOutlined} alt="" className='w-4 h-4' />
                            ))}
                        </div>
                        <p className='text-gray-500 mt-4 text-sm leading-relaxed'>{testimonial.review}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonials
