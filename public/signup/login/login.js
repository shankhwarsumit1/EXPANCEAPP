window.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const loginBtn = document.querySelector('#login-btn');
    const REST_API= "http://localhost:3000/user/login"
    
    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const user = {
            email: emailInput.value,
            password: passwordInput.value
        };
        try {
            const exists = await authenticateUser(user);
            if (exists) {
                alert('logged in successfully')
            } else {
                alert('user not exits')
            }
        } catch (err) {
            console.log(err);
        }
    });


    async function authenticateUser(user){
        try{
          const response = await axios.post(REST_API,user);
          return response.data/success;
        }
        catch(err){
          console.log(err);
          return false;
        }
    }

})