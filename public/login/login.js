window.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const loginBtn = document.querySelector('#login-btn');
    const REST_API = "http://localhost:3000/user/login";
    
    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const user = {
            email: emailInput.value,
            password: passwordInput.value
        };
        try {
            const response = await axios.post(REST_API, user);
            if(response.data.success){
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
});