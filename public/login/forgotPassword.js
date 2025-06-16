window.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault();
    form = document.getElementById('forgotform');
    const emailInput = document.getElementById('forgot-email');
    const message = document.getElementById('message');
    const REST_API = process.env.API_BASE;
    form.addEventListener('submit',async(e)=>{
        try{ e.preventDefault();
           message.innerText = "Wait for few seconds";
           message.style.display = "block";
           const obj = {email:emailInput.value};
           const res = await axios.get(`${REST_API}/password/forgotpassword`,{
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