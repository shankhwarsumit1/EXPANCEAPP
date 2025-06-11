
const {createOrder,getPaymentStatus} = require('../services/cashfreeService');
const paymentModel = require('../models/paymentModel');
const userModel = require('../models/user');

exports.processPayment = async (req,res)=>{
const orderId = "ORDER-"+ Date.now();
const orderAmount = 2000;
const orderCurrency =  "INR";
const customerId = `${req.user.id}`;
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
    paymentStatus:"Pending",
    customerId});

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
        const order = await paymentModel.findOne({where:{orderId}});
        console.log(order);
        if(!order){
            return res.status(404).json({message:"order not found"});
        }
       const orderStatus = await getPaymentStatus(order.orderId);
       order.paymentStatus = orderStatus;
       order.userId = req.user.id;
       await order.save();
       if(orderStatus==='Success'){
         await userModel.update(     // making user premium
            {isPremium:true},
           {where:{id:req.user.id}}
         )
       }
       res.json({orderStatus});
    }
    catch(err){          
       console.error("error fetching payment status:",err);
       res.status(500).json({message:"error fetching status"});
    }
}