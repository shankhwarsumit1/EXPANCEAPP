window.addEventListener('DOMContentLoaded', async (e) => {
    const REST_API = "http://localhost:3000/expense/addExpense";
    const form = document.querySelector('form');
    const expenseList = document.querySelector('ul');
    const token = localStorage.getItem('token');
    const premium = document.getElementById('premium');
    const leaderboardBtn = document.getElementById('leaderboard');
    const premiumMsg = document.createElement('div');
    premiumMsg.id = "premium-msg";
    document.body.insertBefore(premiumMsg, premium);

    let isPremium = false;

    // Always verify from backend if token exists (ensures up-to-date status after payment)
    if (token) {
        const payload = parseJwt(token);
        const userId = payload && (payload.userId || payload.id);
        if (userId) {
            try {
                const res = await fetch(`http://localhost:3000/user/${userId}`);
                const user = await res.json();
                isPremium = user.isPremium;
            } catch (err) {
                console.error("Error fetching user info:", err);
            }
        }
    }

    if (isPremium) {
        premiumMsg.textContent = "Welcome, you are a premium member!";
        showLeaderboard();
    } else {
        premiumMsg.textContent = "";
    }

    premium.addEventListener('click', async (e) => {
        window.location.href = "http://localhost:3000/pay";
    });

    leaderboardBtn.addEventListener('click', showLeaderboard);

    function showLeaderboard() {
        fetch("http://localhost:3000/pay/leaderboard")
            .then(res => res.json())
            .then(leaderboard => {
                if (!Array.isArray(leaderboard)) {
                    alert("Could not load leaderboard.");
                    return;
                }
                let lbDiv = document.getElementById('leaderboard-div');
                if (!lbDiv) {
                    lbDiv = document.createElement('div');
                    lbDiv.id = 'leaderboard-div';
                    document.body.appendChild(lbDiv);
                }
                lbDiv.innerHTML = "<h3>Premium Leaderboard</h3>" +
                    "<ol>" +
                    leaderboard.map(user =>
                        `<li>${user.name} (${user.email}) - Expenses: ${user.expenseCount}</li>`
                    ).join('') +
                    "</ol>";
            });
    }

    function parseJwt(token) {
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    }

    (async () => {
        try {
            const res = await getExpense();
            res.data.expense.forEach((exp) => {
                display(exp);
            })
        }
        catch (err) {
            console.log(err);
        }
    })();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const expense = {
            amount: event.target.expenseAmount.value,
            description: event.target.description.value,
            category: event.target.category.value
        }
        const addedExpense = await postExpense(expense);
        display(addedExpense.data);
        form.reset();
    })

    function display(newExpense) {
        const singleExpense = document.createElement('li');
        singleExpense.innerHTML = `${newExpense.amount} ${newExpense.description} ${newExpense.category} <Button type="click" id="del">DELETE</Button>`
        expenseList.appendChild(singleExpense);
        const delBtn = singleExpense.querySelector('#del');
        delBtn.addEventListener('click', () => {
            deleteExpense(newExpense, singleExpense);
        })
    }

    async function deleteExpense(newExpense, singleExpense) {
        try {
            await axios.delete(`${REST_API}/${newExpense.id}`, {
                headers: { 'Authorization': token }
            });
            singleExpense.remove();
        }
        catch (err) {
            console.log(err);
        }
    }

    async function postExpense(expense) {
        try {
            const res = await axios.post(REST_API, expense, {
                headers: { Authorization: token }
            });
            return res;
        }
        catch (err) {
            console.log(err);
        }
    }

    async function getExpense() {
        try {
            const res = await axios.get(REST_API, {
                headers: { Authorization: token }
            });
            console.log(res);
            return res;
        }
        catch (err) {
            console.log(err);
        }
    }
});