import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"]
const amenitiesList = ["Free WiFi", "Free Breakfast", "Room Service", "Mountain View", "Pool Access"]

const AddRoom = () => {
    const navigate = useNavigate()
    const { getToken, axios, fetchRooms } = useAppContext()
    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [roomType, setRoomType] = useState("Single Bed")
    const [pricePerNight, setPricePerNight] = useState(100)
    const [amenities, setAmenities] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleImageChange = (e, key) => {
        const file = e.target.files[0]
        if (file) setImages(prev => ({ ...prev, [key]: file }))
    }

    const toggleAmenity = (amenity) => {
        setAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const imageFiles = Object.values(images).filter(Boolean)
        if (imageFiles.length === 0) return toast.error("Please upload at least one image")
        if (amenities.length === 0) return toast.error("Please select at least one amenity")

        setIsLoading(true)
        try {
            const token = await getToken()
            const formData = new FormData()
            imageFiles.forEach(file => formData.append("images", file))
            formData.append("roomType", roomType)
            formData.append("pricePerNight", pricePerNight)
            formData.append("amenities", JSON.stringify(amenities))

            const { data } = await axios.post("/api/rooms", formData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                toast.success("Room added successfully!")
                setImages({ 1: null, 2: null, 3: null, 4: null })
                setRoomType("Single Bed")
                setPricePerNight(100)
                setAmenities([])
                if (fetchRooms) fetchRooms()
                setTimeout(() => navigate('/owner/list-rooms'), 1200)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <h2 className='text-2xl font-medium mb-8'>Add New Room</h2>

            <form onSubmit={handleSubmit} className='flex flex-col gap-8 max-w-2xl'>
                <div>
                    <p className='text-sm font-medium text-gray-700 mb-3'>Upload Images</p>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {[1, 2, 3, 4].map((key) => (
                            <label key={key} htmlFor={`image${key}`} className='flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-28 cursor-pointer hover:border-primary transition-all relative overflow-hidden'>
                                {images[key] ? (
                                    <img src={URL.createObjectURL(images[key])} alt="" className='absolute inset-0 w-full h-full object-cover' />
                                ) : (
                                    <>
                                        <img src={assets.uploadArea} alt="" className='w-8 h-8 opacity-50' />
                                        <p className='text-xs text-gray-400 mt-2'>Image {key}</p>
                                    </>
                                )}
                                <input id={`image${key}`} type="file" accept="image/*" hidden onChange={(e) => handleImageChange(e, key)} />
                            </label>
                        ))}
                    </div>
                </div>

                <div className='flex flex-col md:flex-row gap-6'>
                    <div className='flex-1'>
                        <label className='text-sm font-medium text-gray-700'>Room Type</label>
                        <select value={roomType} onChange={e => setRoomType(e.target.value)} className='w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 text-sm outline-none'>
                            {roomTypes.map(type => <option key={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className='flex-1'>
                        <label className='text-sm font-medium text-gray-700'>Price Per Night ($)</label>
                        <input type="number" min={0} value={pricePerNight} onChange={e => setPricePerNight(e.target.value)} className='w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 text-sm outline-none' />
                    </div>
                </div>

                <div>
                    <p className='text-sm font-medium text-gray-700 mb-3'>Amenities</p>
                    <div className='flex flex-wrap gap-3'>
                        {amenitiesList.map(amenity => (
                            <label key={amenity} className='flex items-center gap-2 cursor-pointer text-sm'>
                                <input type="checkbox" checked={amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} className='accent-primary w-4 h-4' />
                                {amenity}
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className='bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-60 self-start'>
                    {isLoading ? "Adding..." : "Add Room"}
                </button>
            </form>
        </div>
    )
}

export default AddRoom
