const cashfree = Cashfree({
    mode: "sandbox",
});

document.getElementById("renderBtn").addEventListener("click", async () => {
  try {
    // Fetch payment session ID from backend
    const response = await fetch("http://localhost:3000/pay/paynow", {
      method: "POST",
    });

    const data = await response.json();
    const paymentSessionId = data.paymentSessionId;

    // Initialize checkout options
    let checkoutOptions = {
        paymentSessionId: paymentSessionId,
      
      //? New page payment options
        redirectTarget: "_self", // (default)
    };

    // Start the checkout process
    await cashfree.checkout(checkoutOptions);


  } catch (err) {
    console.error("Error:", err);
  }
});