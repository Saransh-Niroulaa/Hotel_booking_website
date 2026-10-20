const mongoose = require("mongoose")

let isConnected = false

const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        return
    }
    try {
        if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("<username>") || process.env.MONGODB_URI.includes("your_")) {
            console.log("MongoDB URI contains placeholder or is not configured. Running in offline/fallback mode.")
            return
        }
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        })
        isConnected = true
        console.log("MongoDB connected")
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
    }
}

module.exports = connectDB
