const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("<username>")) {
            console.log("MongoDB URI contains placeholder or is not configured. Running in offline/fallback mode.")
            return
        }
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected")
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
    }
}

module.exports = connectDB
