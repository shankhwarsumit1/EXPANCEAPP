const cashfree = Cashfree({
    mode: "sandbox",
});

function parseJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

document.getElementById("renderBtn").addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:3000/pay/paynow", {
            method: "POST",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Payment initiation failed');
        }

        const data = await response.json();
        if (!data.paymentSessionId) {
            throw new Error('No payment session ID received');
        }

        const checkoutOptions = {
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_self",
        };

        await cashfree.checkout(checkoutOptions);

        // Check payment status after checkout using the correct URL
        fetch(`http://localhost:3000/payment-status/${data.orderId}`)
            .then(res => res.json())
            .then(async statusData => {
                alert("Payment status: " + statusData.orderStatus);
                if (
                    statusData.orderStatus === "SUCCESS" ||
                    statusData.orderStatus === "PAID" ||
                    statusData.orderStatus === "Success"
                ) {
                    // --- Mark user as premium in MySQL and redirect ---
                    const token = localStorage.getItem('token');
                    const payload = parseJwt(token);
                    const userId = payload && (payload.userId || payload.id);

                    if (userId) {
                        await fetch("http://localhost:3000/pay/mark-premium", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId })
                        });
                    }
                    window.location.href = "/expenceAdd/addExpence.html";
                }
            });

    } catch (err) {
        console.error("Error:", err);
        alert("Payment initiation failed: " + err.message);
    }
});