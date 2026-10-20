import { createContext, useContext, useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/react"
import axios from "axios"
import { toast } from "react-hot-toast"

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || "$"
    const { user } = useUser()
    const { getToken } = useAuth()

    const [isOwner, setIsOwner] = useState(false)
    const [rooms, setRooms] = useState([])
    const [searchedCities, setSearchedCities] = useState([])

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get("/api/rooms")
            if (data.success) {
                setRooms(data.rooms)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUser = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get("/api/user", {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setIsOwner(data.role === "hotelOwner")
                setSearchedCities(data.recentSearchedCities || [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchRooms()
    }, [])

    useEffect(() => {
        if (user) {
            fetchUser()
        }
    }, [user])

    const value = {
        currency,
        isOwner,
        setIsOwner,
        rooms,
        fetchRooms,
        searchedCities,
        setSearchedCities,
        getToken,
        user,
        axios
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
