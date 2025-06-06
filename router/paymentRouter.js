const express = require('express');
const paymentController = require('../controller/paymentController');
const router = express();

router.post('/pay',paymentController.processPayment);

module.exports = router;