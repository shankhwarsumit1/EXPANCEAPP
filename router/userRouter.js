const express = require('express');
const userController = require('../controller/userController');
const router = express.Router();
const User = require('../models/user');

router.post('/signup',userController.signup);
router.post('/login',userController.login);

// Add this route:
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user" });
    }
});

module.exports = router;