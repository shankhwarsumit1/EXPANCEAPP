
const {createOrder,getPaymentstatus} = require('../services/cashfreeService');
const paymentModel = require('../models/paymentModel');

exports.processPayment = async (req,res)=>{
const orderId = "ORDER-"+ Date.now();
const orderAmount = 2000;
const orderCurrency =  "INR";
const customerId = "1";
const customerPhone = "7355467233";
try{
const paymentSessionId = await createOrder(
    orderId,orderAmount,orderCurrency,customerId,customerPhone,
);

if (!paymentSessionId) {
  return res.status(500).json({ message: "Failed to create payment session" });
}

await paymentModel.create({
    orderId,
    paymentSessionId,
    orderAmount,
    orderCurrency,
    paymentStatus:"Pending",});

res.status(201).json({paymentSessionId,orderId});
}
catch(err){
console.error("error processing payment",err.message);
res.status(500).json({message:"error processing payment"});
}
};


exports.getPaymentstatus = async(req,res) =>{
    const paymentSessionId = req.params.paymentSessionId;
    try{
        const orderStatus = await getPaymentstatus(paymentSessionId);
        const order = await paymentModel.findOne({where:{paymentSessionId}});
        
        if(!order){
            return res.status(404).json({message:"order not found"});
        }

        order.paymentStatus = orderStatus;
        await order.save();

        res.json({orderStatus});
    }
    catch(err){          
       console.error("error fetching payment status:",err);
       res.status(500).json({message:"error fetching status"});
    }
}