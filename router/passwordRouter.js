const express = require('express');
const passwordController = require('../controller/passwordController');
const router = express.Router();

router.get('/forgotpassword',passwordController.forgotpassword);
router.get('/resetpassword/:uuid',passwordController.resetPassword);
router.put('/updatepassword/:uuid',passwordController.updatePassword);
module.exports = router;