require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const hotelRoutes = require("./routes/hotelRoutes")
const bookingRoutes = require("./routes/bookingRoutes")

const app = express()

connectDB()

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))

app.use("/api/user/clerk", express.raw({ type: "application/json" }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/user", userRoutes)
app.use("/api/rooms", hotelRoutes)
app.use("/api/bookings", bookingRoutes)

app.get("/", (req, res) => res.send("QuickStay API is running"))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
