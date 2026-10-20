import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import { Route, Routes, useLocation } from "react-router-dom"
import AllRooms from "./pages/AllRooms"
import RoomDetails from "./pages/RoomDetails"
import MyBookings from "./pages/MyBookings"
import OwnerLayout from "./pages/owner/OwnerLayout"
import Dashboard from "./pages/owner/Dashboard"
import AddRoom from "./pages/owner/AddRoom"
import ListRooms from "./pages/owner/ListRooms"

const App = () => {
    const isOwnerPath = useLocation().pathname.includes("owner")

    return (
        <div>
            {!isOwnerPath && <Navbar />}
            <div className='min-h-[70vh]'>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/rooms" element={<AllRooms />} />
                    <Route path="/room/:id" element={<RoomDetails />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/owner" element={<OwnerLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="add-room" element={<AddRoom />} />
                        <Route path="list-rooms" element={<ListRooms />} />
                    </Route>
                </Routes>
            </div>
        </div>
    )
}
export default App
