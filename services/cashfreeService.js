const { Cashfree, CFEnvironment, PG } = require("cashfree-pg");

const cfConfig = {
  env: CFEnvironment.SANDBOX,
  clientId: process.env.CASHFREE_APIID,
  clientSecret: process.env.CASHFREE_SECRETKEY,
};


exports.createOrder = async (
  orderId,
  orderAmount,
  orderCurrency = "INR",
  customerID,
  customerPhone,
  customerEmail,
  customerName
) => {
  try {
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    const formattedExpiryDate = expiryDate.toISOString();

    const request = {
      order_amount: orderAmount,
      order_currency: orderCurrency,
      order_id: orderId,
      customer_details: {
        customer_id: customerID,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_name: customerName
      },
      order_meta: {
        return_url: "http://localhost:3000/payment-status/" + orderId,
        payment_methods: "cc, upi, nb"
      },
      order_expiry_time: formattedExpiryDate,
    };

    const response = await pg.orders.create(request);
    return response.data.payment_session_id;
  } catch (error) {
    console.error("Error creating order:", error.message, error.response?.data || "");
    throw error;
  }
};

exports.getPaymentStatus = async (orderId) => {
  try {
    const response = await pg.orders.fetch(orderId);
    return response.data.order_status;
  } catch (error) {
    console.error("Error fetching order status:", error.message, error.response?.data || "");
    throw error;
  }
};

