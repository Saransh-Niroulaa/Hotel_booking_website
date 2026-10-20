require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const hotelRoutes = require("./routes/hotelRoutes")
const bookingRoutes = require("./routes/bookingRoutes")

const app = express()

connectDB()

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || !process.env.FRONTEND_URL || origin === process.env.FRONTEND_URL || origin.endsWith(".vercel.app") || origin.includes("localhost")) {
            callback(null, true)
        } else {
            callback(null, true)
        }
    },
    credentials: true
}))

app.use("/api/user/clerk", express.raw({ type: "application/json" }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const path = require("path")

app.use(express.static(path.join(__dirname, "client", "dist")))

app.use("/api/user", userRoutes)
app.use("/api/rooms", hotelRoutes)
app.use("/api/bookings", bookingRoutes)

app.use((req, res) => {
    const indexPath = path.join(__dirname, "client", "dist", "index.html")
    res.sendFile(indexPath, (err) => {
        if (err) res.send("QuickStay Hotel Booking")
    })
})

const PORT = process.env.PORT || 3000
if (!process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

module.exports = app
