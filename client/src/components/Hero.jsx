import React, { useState } from 'react';
import { assets, cities } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Hero = () => {
    const navigate = useNavigate();
    const { user, getToken, axios, setSearchedCities } = useAppContext();
    const [destination, setDestination] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (user && destination) {
            try {
                const token = await getToken();
                await axios.post('/api/user/store-recent-search', { city: destination }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSearchedCities(prev => prev.includes(destination) ? prev : [destination, ...prev]);
            } catch (error) {
                console.error(error);
            }
        }
        navigate(`/rooms?destination=${encodeURIComponent(destination)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    };

    return (
        <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
            <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20 text-sm font-medium'>
                The Ultimate Hotel Experience
            </p>
            <h1 className='font-playfair text-3xl md:text-5xl lg:text-[56px] lg:leading-[60px] font-bold max-w-xl mt-4'>
                Discover Your Perfect Getaway Destination
            </h1>
            <p className='max-w-xl mt-2 text-sm md:text-base text-white/90'>
                Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.
            </p>

            <form onSubmit={handleSearch} className='bg-white text-gray-500 rounded-xl px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:w-full shadow-lg'>
                <div className='flex-1 max-md:w-full'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.locationIcon} alt="" className='h-4' />
                        <label htmlFor="destinationInput" className='text-xs font-medium text-gray-600'>Destination</label>
                    </div>
                    <input list='destinations' id="destinationInput" type="text" value={destination} onChange={e => setDestination(e.target.value)} className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-gray-800" placeholder="Type here" required />
                    <datalist id='destinations'>
                        {cities.map((city, index) => (
                            <option key={index} value={city} />
                        ))}
                    </datalist>
                </div>

                <div className='max-md:w-full'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkIn" className='text-xs font-medium text-gray-600'>Check in</label>
                    </div>
                    <input id="checkIn" type="date" value={checkIn} min={new Date().toISOString().split("T")[0]} onChange={e => setCheckIn(e.target.value)} className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-gray-800" />
                </div>

                <div className='max-md:w-full'>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkOut" className='text-xs font-medium text-gray-600'>Check out</label>
                    </div>
                    <input id="checkOut" type="date" value={checkOut} min={checkIn || new Date().toISOString().split("T")[0]} onChange={e => setCheckOut(e.target.value)} className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-gray-800" />
                </div>

                <div className='flex md:flex-col max-md:gap-2 max-md:items-center max-md:w-full'>
                    <label htmlFor="guests" className='text-xs font-medium text-gray-600'>Guests</label>
                    <input min={1} max={4} id="guests" type="number" value={guests} onChange={e => setGuests(Number(e.target.value))} className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none text-gray-800 max-w-16 max-md:flex-1" />
                </div>

                <button type="submit" className='flex items-center justify-center gap-2 rounded-lg bg-black py-3 px-6 text-white my-auto cursor-pointer max-md:w-full hover:bg-gray-800 transition-all font-medium text-sm'>
                    <img src={assets.searchIcon} alt="search" className='h-4 invert' />
                    <span>Search</span>
                </button>
            </form>
        </div>
    );
};
export default Hero;