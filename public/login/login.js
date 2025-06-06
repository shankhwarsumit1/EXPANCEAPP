window.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const loginBtn = document.querySelector('#login-btn');
    const REST_API = "http://localhost:3000/user/login";

    // Forgot password elements
    const forgotBtn = document.getElementById('forgot-btn');
    const forgotForm = document.getElementById('forgot-form');
    const forgotEmail = document.getElementById('forgot-email');

    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const user = {
            email: emailInput.value,
            password: passwordInput.value
        };
        try {
            const response = await axios.post(REST_API, user);
            if(response.data.success){
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

    // Show forgot password form
    forgotBtn.addEventListener('click', () => {
        forgotForm.style.display = 'block';
    });

    // Handle forgot password form submit
    forgotForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:3000/password/forgotpassword', {
                email: forgotEmail.value
            });
            alert('If this email exists, a reset link has been sent.');
            forgotForm.style.display = 'none';
            forgotEmail.value = '';
        } catch (err) {
            alert('Error sending reset link.');
            console.log(err);
        }
    });
});