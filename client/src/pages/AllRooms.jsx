import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { assets, roomsDummyData } from '../assets/assets'
import Hotelcard from '../components/Hotelcard'
import Footer from '../components/Footer'

const checkboxFilters = [
    { label: "1 Star", type: "rating", value: 1 },
    { label: "2 Stars", type: "rating", value: 2 },
    { label: "3 Stars", type: "rating", value: 3 },
    { label: "4 Stars", type: "rating", value: 4 },
    { label: "5 Stars", type: "rating", value: 5 },
]

const roomTypeFilters = [
    { label: "Single Bed" },
    { label: "Double Bed" },
    { label: "Luxury Room" },
    { label: "Family Suite" },
]

const AllRooms = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const destinationQuery = searchParams.get('destination') || ''

    const { rooms, searchedCities } = useAppContext()
    const [filteredRooms, setFilteredRooms] = useState([])
    const [selectedFilters, setSelectedFilters] = useState({ rating: [], roomType: [], priceRange: 5000 })
    const [sortBy, setSortBy] = useState('relevance')
    const [openFilter, setOpenFilter] = useState(false)

    const handleRatingChange = (value) => {
        setSelectedFilters(prev => ({
            ...prev,
            rating: prev.rating.includes(value) ? prev.rating.filter(r => r !== value) : [...prev.rating, value]
        }))
    }

    const handleRoomTypeChange = (value) => {
        setSelectedFilters(prev => ({
            ...prev,
            roomType: prev.roomType.includes(value) ? prev.roomType.filter(r => r !== value) : [...prev.roomType, value]
        }))
    }

    useEffect(() => {
        const sourceRooms = rooms.length > 0 ? rooms : roomsDummyData
        let result = [...sourceRooms]

        if (destinationQuery) {
            const query = destinationQuery.toLowerCase()
            result = result.filter(room =>
                room.hotel?.city?.toLowerCase().includes(query) ||
                room.hotel?.address?.toLowerCase().includes(query) ||
                room.hotel?.name?.toLowerCase().includes(query)
            )
        }

        if (selectedFilters.rating.length > 0) {
            result = result.filter(room => selectedFilters.rating.includes(Math.floor(room.rating || 4)))
        }

        if (selectedFilters.roomType.length > 0) {
            result = result.filter(room => selectedFilters.roomType.includes(room.roomType))
        }

        result = result.filter(room => room.pricePerNight <= selectedFilters.priceRange)

        if (sortBy === 'price-asc') {
            result.sort((a, b) => a.pricePerNight - b.pricePerNight)
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => b.pricePerNight - a.pricePerNight)
        }

        setFilteredRooms(result)
    }, [rooms, selectedFilters, destinationQuery, sortBy])

    return (
        <>
            <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 gap-8'>

                {/* Filter Section */}
                <div className={`bg-white w-80 border border-gray-300 text-gray-600 max-lg:w-full`}>
                    <div onClick={() => setOpenFilter(!openFilter)} className='flex items-center justify-between p-4 border-b border-gray-300 cursor-pointer lg:cursor-default'>
                        <p className='text-base font-medium text-gray-800'>Filters</p>
                        <img src={assets.arrowIcon} alt="arrow" className={`lg:hidden transition-all ${openFilter ? "rotate-90" : "-rotate-90"}`} />
                    </div>
                    <div className={`${openFilter ? "block" : "hidden"} lg:block`}>
                        <div className='p-4 border-b border-gray-300'>
                            <p className='font-medium text-gray-800 pb-2'>Popular Filters</p>
                            {checkboxFilters.map((filter, i) => (
                                <label key={i} className='flex items-center gap-2 py-1 cursor-pointer text-sm'>
                                    <input type="checkbox" checked={selectedFilters.rating.includes(filter.value)} onChange={() => handleRatingChange(filter.value)} className='accent-black' />
                                    {filter.label}
                                </label>
                            ))}
                        </div>

                        <div className='p-4 border-b border-gray-300'>
                            <p className='font-medium text-gray-800 pb-2'>Room Type</p>
                            {roomTypeFilters.map((filter, i) => (
                                <label key={i} className='flex items-center gap-2 py-1 cursor-pointer text-sm'>
                                    <input type="checkbox" checked={selectedFilters.roomType.includes(filter.label)} onChange={() => handleRoomTypeChange(filter.label)} className='accent-black' />
                                    {filter.label}
                                </label>
                            ))}
                        </div>

                        <div className='p-4'>
                            <p className='font-medium text-gray-800 pb-2'>Price Range</p>
                            <input type="range" min={0} max={5000} value={selectedFilters.priceRange} onChange={e => setSelectedFilters(prev => ({ ...prev, priceRange: Number(e.target.value) }))} className='w-full accent-black' />
                            <div className='flex items-center justify-between text-sm mt-1'>
                                <span>$0</span>
                                <span>${selectedFilters.priceRange}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rooms Grid */}
                <div className='flex-1 w-full'>
                    {/* Recent Searches / Active Search */}
                    {(searchedCities?.length > 0 || destinationQuery || searchParams.get('offer') || searchParams.get('checkIn')) && (
                        <div className='flex items-center gap-2 flex-wrap mb-4 pb-2 border-b border-gray-100'>
                            {destinationQuery && (
                                <span className='inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary font-medium px-3 py-1 rounded-full'>
                                    <span>Location: "{destinationQuery}"</span>
                                    <button onClick={() => {
                                        const next = new URLSearchParams(searchParams);
                                        next.delete('destination');
                                        setSearchParams(next);
                                    }} className='text-primary hover:text-black font-bold cursor-pointer'>×</button>
                                </span>
                            )}
                            {searchParams.get('offer') && (
                                <span className='inline-flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-700 font-medium px-3 py-1 rounded-full'>
                                    <span>Package: {searchParams.get('offer')}</span>
                                    <button onClick={() => {
                                        const next = new URLSearchParams(searchParams);
                                        next.delete('offer');
                                        setSearchParams(next);
                                    }} className='text-amber-700 hover:text-black font-bold cursor-pointer'>×</button>
                                </span>
                            )}
                            {searchParams.get('checkIn') && (
                                <span className='inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full'>
                                    <span>{searchParams.get('checkIn')} → {searchParams.get('checkOut') || 'Flexible'} ({searchParams.get('guests') || 1} {Number(searchParams.get('guests')) > 1 ? 'guests' : 'guest'})</span>
                                </span>
                            )}
                            {searchedCities?.map((city, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSearchParams({ destination: city })}
                                    className={`text-xs px-3 py-1 rounded-full transition-all cursor-pointer ${destinationQuery.toLowerCase() === city.toLowerCase() ? "bg-black text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className='flex items-center justify-between mb-8'>
                        <h1 className='text-2xl md:text-3xl font-medium'>
                            Hotels List
                            <span className='text-base text-gray-500 font-normal ml-3'>({filteredRooms.length} hotels)</span>
                        </h1>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className='border border-gray-300 rounded px-3 py-2 text-sm outline-none cursor-pointer'>
                            <option value="relevance">Sort by Relevance</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {filteredRooms.map((room, index) => (
                            <Hotelcard key={room._id} room={room} index={index} />
                        ))}
                    </div>

                    {filteredRooms.length === 0 && (
                        <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
                            <p className='text-lg'>No rooms found matching your filters.</p>
                            <button onClick={() => setSelectedFilters({ rating: [], roomType: [], priceRange: 5000 })} className='mt-4 text-sm underline text-black cursor-pointer'>Clear all filters</button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AllRooms
