window.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const loginBtn = document.querySelector('#login-btn');
    const REST_API = "http://13.233.121.238:80/user/login";
    const forgotBtn = document.getElementById('forgotPassword');

    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const user = {
            email: emailInput.value,
            password: passwordInput.value
        };
        try {
            const response = await axios.post(REST_API, user);
            if(response.data.success){         
                emailInput.value='';
                passwordInput.value='';
                localStorage.setItem('token',response.data.token);
                window.location.href = "../expenceAdd/addExpence.html";
   
            }else{
            alert(response.data.message);
            }
        } catch (err) {
            if (err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert('An error occurred');
            }
            console.log(err);
     
        }
    });


    forgotBtn.addEventListener('click',async(e)=>{
        try{
            window.location.href='./forgotPassword.html';
        }
        catch(er){
            console.log(er);
        }
    })
});