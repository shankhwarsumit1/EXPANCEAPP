
        const cashfree = Cashfree({
            Mode:"sandbox",
        });

        document.getElementById('renderBtn').addEventListener("click",async(e)=>{
            e.preventDefault();
            try{
                const response = await fetch("http://localhost:3000/payment/pay",{
                method:"post",
            });
            const data = await response.json();
            const paymentSessionId = data.paymentSessionId;
            const orderId = data.orderId;

            let checkOptions = {
                paymentSessionId: paymentSessionId,
                redirect:"_self",
                mode:"sandbox"
            };

            const result = await cashfree.checkout(checkOptions);

            if(result.error){
              console.log("User has closed the popup or there is some payment error, Check for Payment Status");
              console.log(result.error);
            }

            if(result.redirect){
             console.log("Payment will be redirected");
              }

            if(result.paymentDetails){
            console.log("Payment has been completed, Check for Payment Status");
            console.log(result.paymentDetails.paymentMessage);
            
            const response = await fetch(`http://localhost:3000/payment/payment-status/${orderId}}`,{
                method:"GET",
            })
            
            const data = await response.json();
            console.log(data);

            if (data.orderStatus === "Success") {
                // Redirect to addExpense.html
                console.log(data);
                window.location.href = "/addExpense.html";
            } else {
                alert("Your payment is " + data.orderStatus);
            }
            }
            
             }
            catch(err){
             console.log(err);
            }
            
        });
