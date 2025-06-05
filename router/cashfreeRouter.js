const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController')

router.get('/',paymentController.getPaymentPage);
router.post('/paynow',paymentController.processPayment);
router.get('/payment-status/:paymentSessionId',paymentController.getPaymentStatus);
router.get('/payment-status/:orderId', paymentController.getPaymentStatusid);
router.post('/mark-premium', paymentController.markPremium);
router.get('/leaderboard', paymentController.premiumLeaderboard);

module.exports = router;