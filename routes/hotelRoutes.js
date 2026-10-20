const express = require("express")
const Hotel = require("../models/Hotel")
const Room = require("../models/Room")
const { authMiddleware, ownerMiddleware } = require("../middleware/authMiddleware")
const { upload, uploadToCloudinary } = require("../config/cloudinary")

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: "hotel",
            populate: { path: "owner", select: "username email image" }
        })
        res.json({ success: true, rooms })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.get("/owner", ownerMiddleware, async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.userId })
        if (!hotel) return res.json({ success: true, rooms: [] })

        const rooms = await Room.find({ hotel: hotel._id })
        res.json({ success: true, rooms })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.post("/", ownerMiddleware, upload.array("images", 4), async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body
        const parsedAmenities = typeof amenities === "string" ? JSON.parse(amenities) : amenities

        let hotel = await Hotel.findOne({ owner: req.userId })
        if (!hotel) {
            hotel = await Hotel.create({
                name: `${req.user.username}'s Hotel`,
                address: "To be updated",
                contact: "To be updated",
                owner: req.userId,
                city: "To be updated"
            })
        }

        const imageUrls = await Promise.all(
            req.files.map(file => uploadToCloudinary(file.buffer, "hotel-rooms"))
        )

        const room = await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: Number(pricePerNight),
            amenities: parsedAmenities,
            images: imageUrls
        })

        res.json({ success: true, room })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.post("/toggle-availability", ownerMiddleware, async (req, res) => {
    try {
        const { roomId } = req.body
        const room = await Room.findById(roomId)
        if (!room) return res.json({ success: false, message: "Room not found" })

        room.isAvailable = !room.isAvailable
        await room.save()
        res.json({ success: true, isAvailable: room.isAvailable })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

module.exports = router
