const express = require('express');
const paymentController = require('../controller/paymentController');
const authenticate = require('../middleware/authenticate');
const router = express();

router.post('/pay',authenticate,paymentController.processPayment);
router.get('/payment-status/:orderId',authenticate,paymentController.getPaymentstatus);
module.exports = router;