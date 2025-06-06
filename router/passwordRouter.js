const bcrypt = require('bcrypt');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const path = require('path');
const User = require('../models/user');
const ForgotPasswordRequest = require('../models/forgotPasswordRequest');
// const sendMail = require('../utils/sendMail'); // implement if you want to send real emails

router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Always respond the same for security
            return res.status(200).json({ message: "If this email exists, a reset link has been sent." });
        }

        // Create forgot password request
        const request = await ForgotPasswordRequest.create({
            id: uuidv4(),
            userId: user.id,
            isActive: true
        });

        // Build reset link
        const resetLink = `http://localhost:3000/password/resetpassword/${request.id}`;

        // TODO: Send email with resetLink here (for now, just log it)
        console.log(`Reset link for ${email}: ${resetLink}`);

        res.status(200).json({ message: "If this email exists, a reset link has been sent." });
    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get('/resetpassword/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const request = await ForgotPasswordRequest.findOne({ where: { id, isActive: true } });
        if (!request) {
            return res.status(400).send('Invalid or expired reset link.');
        }
        // Serve a simple HTML form for new password
        res.sendFile(path.join(__dirname, '../public/resetPassword.html'));
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});



router.post('/updatepassword/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    try {
        const request = await ForgotPasswordRequest.findOne({ where: { id, isActive: true } });
        if (!request) {
            return res.status(400).json({ message: "Invalid or expired reset link." });
        }
        const user = await User.findByPk(request.userId);
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }
        // Encrypt and update password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        // Mark request as inactive
        request.isActive = false;
        await request.save();

        res.json({ message: "Password updated successfully." });
    } catch (err) {
        console.error("Update password error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
module.exports = router;