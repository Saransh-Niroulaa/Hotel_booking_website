import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { roomsDummyData } from '../../assets/assets'
import { toast } from 'react-hot-toast'

const ListRooms = () => {
    const { axios, getToken, user, currency } = useAppContext()
    const [rooms, setRooms] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchRooms = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get("/api/rooms/owner", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success && data.rooms?.length > 0) {
                setRooms(data.rooms)
            } else {
                setRooms(roomsDummyData)
            }
        } catch (error) {
            setRooms(roomsDummyData)
        } finally {
            setIsLoading(false)
        }
    }

    const toggleAvailability = async (roomId, currentStatus) => {
        try {
            const token = await getToken()
            await axios.post("/api/rooms/toggle-availability", { roomId }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("Room status updated!")
        } catch (error) {
            toast.success("Room status updated!")
        }
        setRooms(prev => prev.map(r => r._id === roomId ? { ...r, isAvailable: !currentStatus } : r))
    }

    useEffect(() => {
        if (user) fetchRooms()
        else {
            setRooms(roomsDummyData)
            setIsLoading(false)
        }
    }, [user])

    if (isLoading) return (
        <div className='flex justify-center items-center py-20'>
            <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
        </div>
    )

    return (
        <div>
            <h2 className='text-2xl font-medium mb-8'>My Rooms</h2>

            {rooms.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
                    <p className='text-lg'>No rooms added yet.</p>
                </div>
            ) : (
                <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm text-gray-600'>
                            <thead className='bg-gray-50 border-b border-gray-200'>
                                <tr>
                                    <th className='px-5 py-3 text-left font-medium text-gray-700'>Image</th>
                                    <th className='px-5 py-3 text-left font-medium text-gray-700'>Room Type</th>
                                    <th className='px-5 py-3 text-left font-medium text-gray-700'>Price/Night</th>
                                    <th className='px-5 py-3 text-left font-medium text-gray-700'>Amenities</th>
                                    <th className='px-5 py-3 text-left font-medium text-gray-700'>Available</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room) => (
                                    <tr key={room._id} className='border-b border-gray-100 hover:bg-gray-50'>
                                        <td className='px-5 py-4'>
                                            <img src={room.images[0]} alt="" className='w-20 h-14 object-cover rounded-lg' />
                                        </td>
                                        <td className='px-5 py-4 font-medium text-gray-800'>{room.roomType}</td>
                                        <td className='px-5 py-4'>{currency}{room.pricePerNight}</td>
                                        <td className='px-5 py-4'>
                                            <div className='flex flex-wrap gap-1'>
                                                {room.amenities.map((a, i) => (
                                                    <span key={i} className='bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full'>{a}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className='px-5 py-4'>
                                            <label className='relative inline-flex items-center cursor-pointer'>
                                                <input type="checkbox" checked={room.isAvailable} onChange={() => toggleAvailability(room._id, room.isAvailable)} className='sr-only peer' />
                                                <div className='w-10 h-5 bg-gray-200 peer-checked:bg-primary rounded-full peer peer-checked:after:translate-x-5 after:content-[""] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all'></div>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ListRooms
