const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    _id: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    role: { type: String, enum: ["user", "hotelOwner"], default: "user" },
    recentSearchedCities: [{ type: String }]
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model("User", userSchema)

module.exports = User
