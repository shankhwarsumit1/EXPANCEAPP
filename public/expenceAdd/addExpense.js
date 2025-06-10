
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
const rangeSelect = document.getElementById('rangeSelect');
const rangeHeading = document.getElementById('rangeHeading');
const leaderboard = document.querySelector('.leaderboard');
const pagination = document.getElementById('pagination');
const expensesPerPage = document.getElementById('expensesPerPage');
const firstExp=document.getElementById('firstExp');
const rangeSelectHeading = document.getElementById('rangeSelectHeading');

let isExp = false;
let currentRange = 'all';
let page = 1;
let limit = 5;
let paginationData=[];
//checking premium user and giving premium leaderboard button and hidding buypremium button
expensesPerPage.value='5';
(async()=>{
    try{
       const res = await axios.get(`http://localhost:3000/expense/isPremium`,{
        headers:{'Authorization':token}
       });
       if(res.data.isPremium){
        leaderBoardButton.hidden=false;
        Buypremium.hidden = true;
        downloadBtn.hidden = false;
        leaderboard.hidden=false;
        rangeSelectHeading.hidden=false;
        document.getElementById('premiumHeading').hidden = false;
        document.getElementById('rangeSelect').hidden = false;
       }
    }
    catch(err){
          console.log(err);
    }
})();

//shows all expenses on reloading 
async function load(pageNo,range='all',limit='5') {
  try {
    const res = await getExpense(pageNo,range,limit); // This returns all expenses
    paginationData = res.data.data;

    if(paginationData.content.length===0 && page!=1){
      page=page-1;
    if(leaderboardOn){
      leaderBoardButton.click();
    }   
      load(page,range,limit);
    }

    if(paginationData.content.length===0){
      rangeHeading.hidden=true;
      firstExp.hidden=false;
    }

    showExpenses(paginationData.content);
    showPagination(paginationData);
    rangeHeading.textContent = `Showing: ${range.toUpperCase()} Expenses`;
  } catch (err) {
    console.log(err);
  }
};

load(page,currentRange,limit);

//call display for each expense
function showExpenses(expenses) {
  expenseList.innerHTML = ''; // clear existing list
  expenses.forEach(exp => {
    display(exp);
  });
}

rangeSelect.addEventListener('change',(e) => {
  // rangeHeading.textContent = `Showing: ${range.toUpperCase()} Expenses`;
  e.preventDefault();
  currentRange = rangeSelect.value || 'all';
  console.log(currentRange);
  page=1;
  load(page,currentRange,limit);
});

expensesPerPage.addEventListener('change',(e)=>{
  e.preventDefault();
  limit=expensesPerPage.value;
  load(page,currentRange,limit);
})

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


//display leaders on leaderboard button click
leaderBoardButton.addEventListener('click',async(e)=>{
   e.preventDefault();
   try{
     leaderHeading.hidden=false;
      if(leaderboardOn){
      leaderList.innerHTML=''; 
            leaderHeading.hidden=true;

      leaderboardOn=false;
        return;
      }
      else{
      leaderboardOn=true;
      leaderHeading.hidden=false;
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
        category:event.target.category.value,
        note:event.target.note.value
    }
    try{
    const addedExpense = await postExpense(expense);
    console.log(addedExpense);
    console.log(expense);
    display(addedExpense.data);
    load(page,currentRange,limit);
    // form.reset();
     if(leaderboardOn){
      leaderBoardButton.click();
    }
  }
  catch(err){
    console.log(err);
  }
})

//display expenses
function display(newExpense){
  rangeHeading.hidden=false;
  firstExp.hidden=true;
const leaderList = document.getElementById('rangeHeading').hidden=false;
 const singleExpense = document.createElement('li');
 if(newExpense.note!=null){
 singleExpense.innerHTML = `${newExpense.amount}  ${newExpense.description}  ${newExpense.category}  ${newExpense.note} <Button type="click" id="del">DELETE</Button>`
 }
 else{
   singleExpense.innerHTML = `${newExpense.amount}  ${newExpense.description}  ${newExpense.category} <Button type="click" id="del">DELETE</Button>`
 }
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
    if(leaderboardOn){
      leaderBoardButton.click();
    }
    singleExpense.remove();
    load(page,currentRange,limit); 
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

async function getExpense(pageNo,range='all',limit='5') {
    try{
           const res = await axios.get(`http://localhost:3000/expense/addExpense?page=${pageNo}&range=${range}&limit=${limit}`,{
            headers:{'Authorization':token}
           });
           return res;
    }
    catch(err){
        console.log(err);
    }
}

async function showPagination({hasNextPage,hasPreviousPage}){
  try{
    pagination.innerHTML='';
    if(hasPreviousPage){
      const btn= document.createElement('button');
      btn.innerHTML = page-1;
      btn.addEventListener('click',()=>{
                 rangeHeading.textContent = `Showing: ${currentRange.toUpperCase()} Expenses`;

              page=page-1;
              load(page,currentRange,limit);
      } )

      pagination.appendChild(btn);
    }

    const currentBtn = document.createElement('button');
    currentBtn.innerHTML=page;
    currentBtn.classList.add('active');
    pagination.appendChild(currentBtn);

    if(hasNextPage){
      const btn3 = document.createElement('button');
      btn3.innerHTML=page+1;
      btn3.addEventListener('click',()=>{
          rangeHeading.textContent = `Showing: ${currentRange.toUpperCase()} Expenses`;
              page=page+1;
              load(page,currentRange,limit);
      })
    pagination.appendChild(btn3);
    }
    }
  catch(err){
    console.log(err);
  }
}

});