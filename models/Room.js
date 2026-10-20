const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true })

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema)

module.exports = Room
