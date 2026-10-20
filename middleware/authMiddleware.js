const { verifyToken } = require("@clerk/backend")
const User = require("../models/User")

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) return res.json({ success: false, message: "Unauthorized: No token provided" })

        const decoded = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY })
        const userId = decoded.sub
        req.userId = userId

        let user = await User.findById(userId)
        if (!user) {
            user = await User.create({
                _id: userId,
                username: "User",
                email: `${userId}@user.com`,
                role: "user"
            })
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

        const decoded = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY })
        const userId = decoded.sub
        req.userId = userId

        let user = await User.findById(userId)
        if (!user) {
            user = await User.create({
                _id: userId,
                username: "User",
                email: `${userId}@user.com`,
                role: "hotelOwner"
            })
        }
        req.user = user
        next()
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

module.exports = { authMiddleware, ownerMiddleware }
