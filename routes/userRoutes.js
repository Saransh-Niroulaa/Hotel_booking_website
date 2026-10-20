const express = require("express")
const mongoose = require("mongoose")
const { Webhook } = require("svix")
const User = require("../models/User")
const { authMiddleware } = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/clerk", express.raw({ type: "application/json" }), async (req, res) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
    if (!webhookSecret) return res.status(500).json({ error: "Webhook secret not configured" })

    const svixId = req.headers["svix-id"]
    const svixTimestamp = req.headers["svix-timestamp"]
    const svixSignature = req.headers["svix-signature"]

    try {
        const wh = new Webhook(webhookSecret)
        const evt = wh.verify(req.body, { "svix-id": svixId, "svix-timestamp": svixTimestamp, "svix-signature": svixSignature })

        const { id, email_addresses, first_name, last_name, image_url } = evt.data
        const email = email_addresses[0]?.email_address
        const username = `${first_name || ""} ${last_name || ""}`.trim() || email

        if (mongoose.connection.readyState === 1) {
            if (evt.type === "user.created") {
                await User.create({ _id: id, username, email, image: image_url })
            } else if (evt.type === "user.updated") {
                await User.findByIdAndUpdate(id, { username, email, image: image_url })
            } else if (evt.type === "user.deleted") {
                await User.findByIdAndDelete(id)
            }
        }

        res.json({ success: true })
    } catch (error) {
        console.error("Webhook error:", error.message)
        res.status(400).json({ success: false, message: error.message })
    }
})

router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = req.user
        res.json({ success: true, role: user.role, recentSearchedCities: user.recentSearchedCities })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

router.post("/store-recent-search", authMiddleware, async (req, res) => {
    try {
        const { city } = req.body
        const user = req.user
        if (mongoose.connection.readyState === 1 && !user.recentSearchedCities.includes(city)) {
            user.recentSearchedCities.unshift(city)
            if (user.recentSearchedCities.length > 3) user.recentSearchedCities.pop()
            await user.save()
        }
        res.json({ success: true, recentSearchedCities: user.recentSearchedCities || [] })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
})

module.exports = router
