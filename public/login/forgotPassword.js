window.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault();
    form = document.getElementById('forgotform');
    const emailInput = document.getElementById('forgot-email');
    const submitBtn = document.getElementById('submitBtn');
    form.addEventListener('submit',async(e)=>{
        try{ e.preventDefault();
           const obj = {email:emailInput.value};
        }
        catch(err){
            console.log(err);
        }
    });
})