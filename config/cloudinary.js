const cloudinary = require("cloudinary").v2
const multer = require("multer")

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = multer.memoryStorage()
const upload = multer({ storage })

const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === "your_cloudinary_cloud_name") {
            return resolve("https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800")
        }
        const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error) reject(error)
            else resolve(result.secure_url)
        })
        stream.end(buffer)
    })
}

module.exports = { upload, uploadToCloudinary }
