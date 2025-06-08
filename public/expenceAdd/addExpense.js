
window.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault()
let leaderboardOn = false;
const REST_API = "http://localhost:3000/expense/addExpense";
const form = document.querySelector('form');
const expenseList = document.querySelector('#expense-list');
const token = localStorage.getItem('token');
const Buypremium = document.querySelector('#premium');
const leaderBoardButton = document.getElementById('leaders');
const leaderList = document.getElementById('leaderList');
const leaderHeading = document.getElementById('leaderHeading');
const downloadBtn = document.getElementById('download');
//checking premium user and giving premium leaderboard button and hidding buypremium button
(async()=>{
    try{
       const res = await axios.get(`http://localhost:3000/expense/isPremium`,{
        headers:{'Authorization':token}
       });
       if(res.data.isPremium){
        document.getElementById('premiumHeading').hidden=false;
        leaderBoardButton.hidden=false;
        Buypremium.hidden = true;
        downloadBtn.hidden = false;
       }
    }
    catch(err){
          console.log(err);
    }
})();

downloadBtn.addEventListener('click',async(e)=>{
try{
   const res = await axios.get('http://localhost:3000/expense/download',{
    headers:{'Authorization':token},
    responseType:'blob'
   })
//responseType: 'blob' makes Axios treat the server response as a file (not JSON or text).
// So, res.data becomes a Blob object, which holds binary data (e.g., CSV content).
   const blob = new Blob([res.data],{type:'text/csv'});
   const url = window.URL.createObjectURL(blob);
//It creates a temporary downloadable link from your file (blob).
   const a = document.createElement('a');
   a.href = url;
// You attach that temporary shelf link to the anchor.
   a.download='expenses.csv';
//You tell the browser:
//“When the user clicks this anchor, don’t open it — download it as a file with this name.”
   a.click();
//You simulate a user clicking that anchor, triggering the download.
//<a href="..." download="expenses.csv">Click Me</a>
   window.URL.revokeObjectURL(url);
//Finally, clean up that temporary file link from memory.
}
catch(err){
    console.log(err);
}
});

//displaying expenses on reloading
(async ()=>{
   try{  
         const res = await getExpense();
         res.data.expense.forEach((exp)=>{
            display(exp);
         })
   }
   catch(err){
    console.log(err);
   }
})();

//display leaders on leaderboard button click
leaderBoardButton.addEventListener('click',async(e)=>{
   e.preventDefault();
   try{leaderHeading.hidden=false;
      if(leaderboardOn){
        return;
      }
      else{
      leaderboardOn=true;
       const res = await axios.get('http://localhost:3000/premium/showLeaderBoard');
       res.data.forEach((lead)=>{
        displayLeaderboard(lead);
       });}
   }
   catch(err){
    console.log(err);
   }
})

//leaderboard display function
function displayLeaderboard(lead){
 const singleLeader = document.createElement('li');
 singleLeader.innerHTML = `Name - ${lead.name} TotalExpense - ${lead.totalExpense}`;
 leaderList.appendChild(singleLeader);
}

Buypremium.addEventListener('click',(e)=>{
    e.preventDefault();
    window.location.href='../payment/paymentlanding.html';
})

//add expenses
form.addEventListener('submit',async (event)=>{
    event.preventDefault();
    const expense = {
        amount:event.target.expenseAmount.value,
        description:event.target.description.value,
        category:event.target.category.value
    }
    const addedExpense = await postExpense(expense);
    display(addedExpense.data);
    form.reset();
    window.location.reload();
})

//display expenses
function display(newExpense){
 const singleExpense = document.createElement('li');
 singleExpense.innerHTML = `${newExpense.amount} ${newExpense.description} ${newExpense.category} <Button type="click" id="del">DELETE</Button>`
 expenseList.appendChild(singleExpense);
 const delBtn = singleExpense.querySelector('#del');
 delBtn.addEventListener('click',()=>{
    deleteExpense(newExpense,singleExpense);
 })
}

async function deleteExpense(newExpense,singleExpense){
    try{
    await axios.delete(`${REST_API}/${newExpense.id}`,{
        headers:{'Authorization':token}
    });
    singleExpense.remove();
    window.location.reload();
    }
    catch(err){
       console.log(err);
    }
}

async function postExpense(expense){
try{
      const res = await axios.post(REST_API,expense,{
        headers:{Authorization:token}
      });
      return res;
}
catch(err){
    console.log(err);
}}

async function getExpense() {
    try{
           const res = axios.get(REST_API,{
            headers:{Authorization:token}
           });
           console.log(res);
           return res;
    }
    catch(err){
        console.log(err);
    }
}
















})