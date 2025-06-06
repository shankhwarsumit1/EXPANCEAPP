window.addEventListener('DOMContentLoaded', async () => {
  const REST_API = "http://localhost:3000/expense";
  const form = document.querySelector('form');
  const expenseList = document.getElementById('expense-list');
  const token = localStorage.getItem('token');
  const premium = document.getElementById('premium');
  const leaderboardBtn = document.getElementById('leaderboard');
  const downloadBtn = document.getElementById('download-btn');
  const pageInfo = document.getElementById('page-info');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');

  let isPremium = false;
  let currentPage = 1;
  const limit = 10;
  let totalPages = 1;

  function parseJwt(token) {
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  if (token) {
    const payload = parseJwt(token);
    const userId = payload?.userId || payload?.id;
    if (userId) {
      try {
        const res = await fetch(`http://localhost:3000/user/${userId}`);
        const user = await res.json();
        isPremium = user.isPremium;

        if (isPremium) {
          document.getElementById('premium-msg').textContent = "Welcome, Premium User!";
          downloadBtn.disabled = false;
          showLeaderboard();
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    }
  }

  premium.addEventListener('click', () => {
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

        lbDiv.innerHTML = "<h3>Leaderboard</h3><ol>" + leaderboard.map(user =>
          `<li>${user.name} (${user.email}) - ₹${user.totalExpense.toFixed(2)}</li>`).join('') + "</ol>";
      });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const expense = {
      amount: event.target.expenseAmount.value,
      description: event.target.description.value,
      category: event.target.category.value
    };

    try {
      await axios.post(`${REST_API}/addExpense`, expense, {
        headers: { Authorization: token }
      });
      loadExpenses(currentPage); // reload current page
      form.reset();
    } catch (err) {
      console.log(err);
    }
  });

  async function loadExpenses(page) {
    try {
      const res = await axios.get(`${REST_API}?page=${page}&limit=${limit}`, {
        headers: { Authorization: token }
      });
      const expenses = res.data.expense;
      totalPages = Math.ceil(res.data.totalCount / limit);

      expenseList.innerHTML = '';
      expenses.forEach(display);

      pageInfo.textContent = `Page ${page} of ${totalPages}`;
      prevPageBtn.disabled = page <= 1;
      nextPageBtn.disabled = page >= totalPages;
    } catch (err) {
      console.log(err);
    }
  }

  function display(expense) {
    const li = document.createElement('li');
    li.innerHTML = `${expense.amount} ${expense.description} ${expense.category}
      <button class="delete-btn">DELETE</button>`;
    expenseList.appendChild(li);

    li.querySelector('.delete-btn').addEventListener('click', async () => {
      try {
        await axios.delete(`${REST_API}/addExpense/${expense.id}`, {
          headers: { Authorization: token }
        });
        loadExpenses(currentPage); // reload current page
      } catch (err) {
        console.log(err);
      }
    });
  }

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadExpenses(currentPage);
    }
  });

  nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadExpenses(currentPage);
    }
  });

  downloadBtn.addEventListener('click', async () => {
    try {
      const res = await axios.get(`${REST_API}/download`, {
        headers: { Authorization: token },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expenses.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  });

  // Initial load
  loadExpenses(currentPage);
});
