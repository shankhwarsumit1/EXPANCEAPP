window.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault();
    form = document.getElementById('forgotform');
    const emailInput = document.getElementById('forgot-email');
    const submitBtn = document.getElementById('submitBtn');
    form.addEventListener('submit',async(e)=>{
        try{ e.preventDefault();
           const obj = {email:emailInput.value};
           const res = await axios.get(`http://localhost:3000/password/forgotpassword`,{
            headers:{"Usermail":obj.email}
           });
           console.log(res.data.code);
        }
        catch(err){
            console.log(err);
        }
    });
})