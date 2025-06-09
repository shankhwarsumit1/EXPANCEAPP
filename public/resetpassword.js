window.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault();
    const resetForm = document.getElementById('resetForm');
    const password = document.getElementById('newpassword');
    const message = document.getElementById('message');

    resetForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        try{
        const uuid = window.location.pathname.split('/').pop();
        const obj = {newpassword:password.value};
        const ans = await axios.put(`http://localhost:3000/password/updatepassword/${uuid}`,obj);
        message.textContent = "Password reset successful! Redirecting to login page...";
        message.style.display = "block";

        setTimeout(() => {
                window.location.href = "/login/login.html";
            }, 3000);
        console.log(ans);
        }
        catch(err){
            console.log(err);
            message.textContent = "Error resetting password.";
            message.style.color = "red";
            message.style.display = "block";
        }
    })
})