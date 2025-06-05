const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController')

router.get('/',paymentController.getPaymentPage);
router.post('/paynow',paymentController.processPayment);
router.get('/payment-status/:paymentSessionId',paymentController.getPaymentStatus);

module.exports = router;