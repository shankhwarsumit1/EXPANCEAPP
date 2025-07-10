
const {createOrder,getPaymentStatus} = require('../services/cashfreeService');
const paymentModel = require('../models/paymentModel');

exports.processPayment = async (req,res)=>{
const orderId = "ORDER-"+ Date.now();
const orderAmount = 2000;
const orderCurrency =  "INR";
const customerId = `${req.user._id}`;
const customerPhone = "7355467233";

try{
const paymentSessionId = await createOrder(
    orderId,orderAmount,orderCurrency,customerId,customerPhone
);

if (!paymentSessionId) {
  return res.status(500).json({ message: "Failed to create payment session" });
}

await paymentModel.create({
    orderId,
    paymentSessionId,
    orderAmount,
    orderCurrency,
    paymentStatus:"Pending",
    userId:customerId});

res.status(201).json({paymentSessionId,orderId});
}
catch(err){
console.error("error processing payment",err.message);
res.status(500).json({message:"error processing payment"});
}
};


exports.getPaymentstatus = async(req,res) =>{
    const orderId = req.params.orderId;
    try{
        const order = await paymentModel.findOne({orderId},"orderId userId paymentStatus")
        .populate("userId","isPremium");

        if(!order){
            return res.status(404).json({message:"order not found"});
        }
       const orderStatus = await getPaymentStatus(order.orderId);
       console.log("DEBUG: getPaymentStatus returned:", orderStatus);

       order.paymentStatus = orderStatus;
       await order.save();
       if(orderStatus==='Success'){
         const user = order.userId;
         user.isPremium=true;
         await user.save();
       }
       res.json({orderStatus});
    }
    catch(err){          
       console.error("error fetching payment status:",err);
       res.status(500).json({message:"error fetching status"});
    }
}