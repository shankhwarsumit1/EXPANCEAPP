const { createOrder, getPaymentStatus } = require('../services/cashfreeService');
const Payment = require('../models/paymentModel');
const path = require("path");
const User = require('../models/user');
const Expense = require('../models/expenceModel');
const { expenseModel } = require('../models');
const Sequelize = require('sequelize');

exports.getPaymentPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../public/payments/index.html'));
};

exports.processPayment = async (req, res) => {
  try {
    const orderId = "ORDER-" + Date.now();
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const customerId = "1";
    const customerPhone = "9999999990";
    const customerEmail = "test@example.com";
    const customerName = "Test User";

    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerId,
      customerPhone,
      customerEmail,
      customerName
    );

    if (!paymentSessionId) {
      return res.status(500).json({ message: "No payment session ID received" });
    }

    res.json({ paymentSessionId, orderId });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    res.status(500).json({
      message: "Error processing payment",
      error: error.message
    });
  }
};

exports.markPremium = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isPremium = true;
    await user.save();
    res.json({ message: "User upgraded to premium" });
  } catch (error) {
    res.status(500).json({ message: "Error upgrading user" });
  }
};

exports.premiumLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      where: { isPremium: true },
      include: [{
        model: Expense,
        attributes: []
      }],
      attributes: [
        'id', 'name', 'email',
        [require('sequelize').fn('COUNT', require('sequelize').col('expences.id')), 'expenseCount']
      ],
      group: ['user.id'],
      order: [[require('sequelize').literal('expenseCount'), 'DESC']]
    });
    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

exports.getPaymentStatus = async (req, res) => {
  const paymentSessionId = req.params.paymentSessionId;
  try {
    const orderStatus = await getPaymentStatus(paymentSessionId);
    res.json({ orderStatus });
  } catch (error) {
    console.error("Error processing payment:", error.message);
    res.status(500).json({ message: "Error processing payment" });
  }
};

exports.getPaymentStatusid = async (orderId) => {
  try {
    const response = await cashfree.PG.orders.fetch(orderId);
    return response.data.order_status;
  } catch (error) {
    console.error("Error fetching order status:", error.message);
    throw error;
  }
};