const { Cashfree, CFEnvironment } = require('cashfree-pg');

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX, // or CFEnvironment.PRODUCTION
    process.env.CASHFREE_APIID,
    process.env.CASHFREE_SECRETKEY
);

exports.createOrder = async (
    orderId,
    orderAmount,
    orderCurrency = "INR",
    customerId,
    customerPhone,
    customerEmail,
    customerName
) => {
    try {
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
        const formattedExpiryDate = expiryDate.toISOString();

        const request = {
            order_amount: orderAmount,
            order_currency: orderCurrency,
            order_id: orderId,
            customer_details: {
                customer_id: customerId,
                customer_phone: customerPhone,
                customer_email: customerEmail,
                customer_name: customerName
            },
            order_meta: {
                return_url: `http://localhost:3000/payment-status/${orderId}`,
                payment_methods: "cc, upi, nb"
            },
            order_expiry_time: formattedExpiryDate,
        };

        const response = await cashfree.PGCreateOrder(request);
        return response.data.payment_session_id;
    } catch (error) {
        // Log the full error response for debugging
        console.error("Error creating order:", error.response ? error.response.data : error.message);
        throw error;
    }
};

exports.getPaymentStatus = async (orderId) => {
      try {
        console.log(orderId)
        const response = await cashfree.PGOrderFetchPayments("2023-08-01", orderId);

        let getOrderResponse = response.data;
        let orderStatus;

        if (
          getOrderResponse.filter(
            (transaction) => transaction.payment_status === "SUCCESS"
          ).length > 0
        ) {
          orderStatus = "Success"; 
        } else if (
          getOrderResponse.filter(
            (transaction) => transaction.payment_status === "PENDING"
          ).length > 0
        ) {
          orderStatus = "Pending"; 
        } else {
          orderStatus = "Failure";
        }

        return orderStatus;
        
      } catch (error) {
        console.error("Error fetching order status:", error.message);
      }
    };

const cashfree = Cashfree({
    mode: "sandbox",
});

document.getElementById("renderBtn").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3000/pay/paynow", {
      method: "POST",
    });

    const data = await response.json();
    const paymentSessionId = data.paymentSessionId;

    if (!paymentSessionId) {
      alert("Payment session could not be created. Please try again.");
      return;
    }

    let checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self",
    };

    await cashfree.checkout(checkoutOptions);

  } catch (err) {
    console.error("Error:", err);
  }
});

