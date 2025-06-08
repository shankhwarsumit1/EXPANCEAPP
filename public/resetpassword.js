window.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault();
    const resetForm = document.getElementById('resetForm');
    const password = document.getElementById('newpassword');
    resetForm.addEventListener('submit',async(e)=>{
        e.preventDefault();
        try{
        const uuid = window.location.pathname.split('/').pop();
        const obj = {newpassword:password.value};
        const ans = await axios.put(`http://localhost:3000/password/updatepassword/${uuid}`,obj);
        console.log(ans);
        }
        catch(err){
            console.log(err);
        }
    })
})