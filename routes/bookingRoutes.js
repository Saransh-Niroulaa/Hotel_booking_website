const express = require("express")
const mongoose = require("mongoose")
const Booking = require("../models/Booking")
const Room = require("../models/Room")
const Hotel = require("../models/Hotel")
const User = require("../models/User")
const { authMiddleware, ownerMiddleware } = require("../middleware/authMiddleware")
const { sendBookingConfirmation } = require("../config/emailService")

const router = express.Router()

router.post("/check-availability", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: true, isAvailable: true })
        }
        const { room, checkInDate, checkOutDate } = req.body
        const existingBooking = await Booking.findOne({
            room,
            status: { $ne: "cancelled" },
            $or: [
                { checkInDate: { $lt: new Date(checkOutDate), $gte: new Date(checkInDate) } },
                { checkOutDate: { $gt: new Date(checkInDate), $lte: new Date(checkOutDate) } },
                { checkInDate: { $lte: new Date(checkInDate) }, checkOutDate: { $gte: new Date(checkOutDate) } }
            ]
        })
        res.json({ success: true, isAvailable: !existingBooking })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { room: roomId, hotel: hotelId, checkInDate, checkOutDate, totalPrice, guests, paymentMethod } = req.body

        const room = await Room.findById(roomId).populate("hotel")
        if (!room) return res.json({ success: false, message: "Room not found" })

        const existingBooking = await Booking.findOne({
            room: roomId,
            status: { $ne: "cancelled" },
            $or: [
                { checkInDate: { $lt: new Date(checkOutDate), $gte: new Date(checkInDate) } },
                { checkOutDate: { $gt: new Date(checkInDate), $lte: new Date(checkOutDate) } },
                { checkInDate: { $lte: new Date(checkInDate) }, checkOutDate: { $gte: new Date(checkOutDate) } }
            ]
        })
        if (existingBooking) return res.json({ success: false, message: "Room not available for selected dates" })

        const booking = await Booking.create({
            user: req.userId,
            room: roomId,
            hotel: hotelId,
            checkInDate,
            checkOutDate,
            totalPrice,
            guests,
            paymentMethod,
            isPaid: paymentMethod === "Stripe"
        })

        const user = req.user
        try {
            await sendBookingConfirmation({
                to: user.email,
                username: user.username,
                roomType: room.roomType,
                hotelName: room.hotel.name,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                guests,
                totalPrice
            })
        } catch (emailError) {
            console.error("Email error:", emailError.message)
        }

        res.json({ success: true, booking })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.get("/user", authMiddleware, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: true, bookings: [] })
        }
        const bookings = await Booking.find({ user: req.userId })
            .populate({ path: "room", populate: { path: "hotel" } })
            .populate("hotel")
            .sort({ createdAt: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.get("/hotel", ownerMiddleware, async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ success: true, totalBookings: 0, totalRevenue: 0, bookings: [] })
        }
        const hotel = await Hotel.findOne({ owner: req.userId })
        if (!hotel) return res.json({ success: true, totalBookings: 0, totalRevenue: 0, bookings: [] })

        const bookings = await Booking.find({ hotel: hotel._id })
            .populate({ path: "room", select: "roomType images" })
            .populate({ path: "user", select: "username email image" })
            .sort({ createdAt: -1 })

        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0)
        res.json({ success: true, totalBookings: bookings.length, totalRevenue, bookings })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.put("/:id/status", ownerMiddleware, async (req, res) => {
    try {
        const { status } = req.body
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
        if (!booking) return res.json({ success: false, message: "Booking not found" })
        res.json({ success: true, booking })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

module.exports = router
