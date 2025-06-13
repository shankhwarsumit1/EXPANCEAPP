window.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault();
    form = document.getElementById('forgotform');
    const emailInput = document.getElementById('forgot-email');
    const message = document.getElementById('message');

    form.addEventListener('submit',async(e)=>{
        try{ e.preventDefault();
           message.innerText = "Wait for few seconds";
           message.style.display = "block";
           const obj = {email:emailInput.value};
           const res = await axios.get(`http://13.233.121.238:80/password/forgotpassword`,{
            headers:{"Usermail":obj.email}
           });
           message.innerText = "Check your email";
           console.log(res.data.code);
           form.reset();
        }
        catch(err){
            console.log(err);
        }
    });
})