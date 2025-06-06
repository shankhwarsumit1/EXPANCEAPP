const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(200).json({ message: "If this email exists, a reset link has been sent." });
        }
        res.status(200).json({ message: "If this email exists, a reset link has been sent." });
    } catch (err) {
        console.error("Forgot password error:", err); // <-- Add this line
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;