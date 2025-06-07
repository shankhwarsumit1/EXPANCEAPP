const express = require('express');
const paymentController = require('../controller/paymentController');
const router = express();

router.post('/pay',paymentController.processPayment);
router.get('/payment-status/:orderId',paymentController.getPaymentstatus);
module.exports = router;