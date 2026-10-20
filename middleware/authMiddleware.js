const mongoose = require("mongoose")
const { verifyToken } = require("@clerk/backend")
const User = require("../models/User")

const decodeTokenPayload = (token) => {
    try {
        const parts = token.split(".")
        if (parts.length >= 2) {
            const payload = Buffer.from(parts[1], "base64").toString("utf8")
            return JSON.parse(payload)
        }
    } catch (e) {
        return null
    }
    return null
}

const getUserIdFromToken = async (token) => {
    const secretKey = process.env.CLERK_SECRET_KEY
    if (secretKey && secretKey.startsWith("sk_")) {
        try {
            const decoded = await verifyToken(token, { secretKey })
            if (decoded?.sub) return decoded.sub
        } catch (error) {
            console.error("Clerk token verification error:", error.message)
        }
    }

    const payload = decodeTokenPayload(token)
    return payload?.sub || payload?.userId || null
}

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) return res.json({ success: false, message: "Unauthorized: No token provided" })

        const userId = await getUserIdFromToken(token)
        if (!userId) return res.json({ success: false, message: "Unauthorized: Invalid token" })

        req.userId = userId

        let user = null
        if (mongoose.connection.readyState === 1) {
            user = await User.findById(userId)
            if (!user) {
                user = await User.create({
                    _id: userId,
                    username: "Guest User",
                    email: `${userId}@user.com`,
                    role: "user"
                })
            }
        } else {
            user = { _id: userId, username: "Guest User", email: `${userId}@user.com`, role: "user", recentSearchedCities: [] }
        }

        req.user = user
        next()
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const ownerMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) return res.json({ success: false, message: "Unauthorized: No token provided" })

        const userId = await getUserIdFromToken(token)
        if (!userId) return res.json({ success: false, message: "Unauthorized: Invalid token" })

        req.userId = userId

        let user = null
        if (mongoose.connection.readyState === 1) {
            user = await User.findById(userId)
            if (!user) {
                user = await User.create({
                    _id: userId,
                    username: "Guest Owner",
                    email: `${userId}@user.com`,
                    role: "hotelOwner"
                })
            }
        } else {
            user = { _id: userId, username: "Guest Owner", email: `${userId}@user.com`, role: "hotelOwner", recentSearchedCities: [] }
        }

        req.user = user
        next()
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

module.exports = { authMiddleware, ownerMiddleware }
