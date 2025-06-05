const {createOrder,getPaymentStatus} = require('../services/cashfreeService');
const Payment = require('../models/paymentModel');
const path = require("path");

exports.getPaymentPage = (req,res)=>{
    res.sendFile(path.join(__dirname,'../public/payments/index.html'));
};

exports.processPayment = async (req, res) => {
    const orderId = "ORDER-" + Date.now();
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const customerId = "1";
    const customerPhone = "9999999990";
    const customerEmail = "test@example.com"; 
    const customerName = "Test User";        
    try {
        const paymentSessionId = await createOrder(
            orderId,
            orderAmount,
            orderCurrency,
            customerId,
            customerPhone,
            customerEmail,
            customerName
        );
        res.json({ paymentSessionId, orderId });
    } catch (error) {
        // Log the full error response for debugging
        console.error("Error processing payment:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Error processing payment" });
    }
};

exports.getPaymentStatus = async (req,res) =>{
    const paymentSessionId = req.params.paymentSessionId;
    try{
     const orderStatus = await getPaymentStatus(paymentSessionId);

     const order = await Payment.findOne({paymentSessionId});

     order.status = orderStatus;
     await order.save();
     res.json({orderStatus});
    }
    catch(error){
        console.error("Error processing payment:", error.message);
    res.status(500).json({ message: "Error processing payment" });
    }
}