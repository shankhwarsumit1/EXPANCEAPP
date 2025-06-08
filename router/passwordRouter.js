const express = require('express');
const passwordController = require('../controller/passwordController');
const router = express.Router();

router.get('/forgotpassword',passwordController.forgotpassword);
module.exports = router;