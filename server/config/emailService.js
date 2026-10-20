const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendBookingConfirmation = async ({ to, username, roomType, hotelName, checkIn, checkOut, guests, totalPrice }) => {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your_gmail@gmail.com" || !process.env.EMAIL_PASS) {
        return console.log("Email service not configured, skipping confirmation email")
    }

    const checkInFormatted = new Date(checkIn).toDateString()
    const checkOutFormatted = new Date(checkOut).toDateString()
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))

    const mailOptions = {
        from: `"QuickStay Bookings" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Booking Confirmed – ${hotelName}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: 'Outfit', Arial, sans-serif; background: #f9fafb; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { background: #1E3A8A; padding: 32px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 700; }
            .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
            .body { padding: 32px; }
            .greeting { font-size: 18px; color: #1f2937; font-weight: 600; margin-bottom: 8px; }
            .subtitle { color: #6b7280; font-size: 14px; margin-bottom: 28px; }
            .card { background: #f3f4f6; border-radius: 12px; padding: 24px; }
            .card-title { font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 16px; }
            .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .row:last-child { border-bottom: none; }
            .label { color: #6b7280; font-size: 13px; }
            .value { color: #111827; font-size: 13px; font-weight: 600; }
            .total { background: #1E3A8A; border-radius: 8px; padding: 16px 20px; margin-top: 16px; display: flex; justify-content: space-between; }
            .total-label { color: rgba(255,255,255,0.8); font-size: 14px; }
            .total-value { color: white; font-size: 18px; font-weight: 700; }
            .footer { text-align: center; padding: 24px; background: #f9fafb; color: #9ca3af; font-size: 12px; }
            .btn { display: inline-block; background: #1E3A8A; color: white; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Booking Confirmed!</h1>
              <p>Your reservation is all set. We can't wait to welcome you.</p>
            </div>
            <div class="body">
              <p class="greeting">Hi ${username},</p>
              <p class="subtitle">Thank you for choosing QuickStay. Here's a summary of your booking at <strong>${hotelName}</strong>.</p>
              <div class="card">
                <p class="card-title">📋 Booking Details</p>
                <div class="row"><span class="label">Hotel</span><span class="value">${hotelName}</span></div>
                <div class="row"><span class="label">Room Type</span><span class="value">${roomType}</span></div>
                <div class="row"><span class="label">Check-In</span><span class="value">${checkInFormatted}</span></div>
                <div class="row"><span class="label">Check-Out</span><span class="value">${checkOutFormatted}</span></div>
                <div class="row"><span class="label">Duration</span><span class="value">${nights} Night${nights > 1 ? "s" : ""}</span></div>
                <div class="row"><span class="label">Guests</span><span class="value">${guests}</span></div>
                <div class="total">
                  <span class="total-label">Total Amount</span>
                  <span class="total-value">$${totalPrice}</span>
                </div>
              </div>
              <p style="color:#6b7280;font-size:13px;margin-top:20px;">If you have any questions, please contact us at support@quickstay.com</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} QuickStay. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
        `
    }

    await transporter.sendMail(mailOptions)
}

module.exports = { sendBookingConfirmation }
