
window.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault()
const REST_API = "http://localhost:3000/expense/addExpense";
const form = document.querySelector('form');
const expenseList = document.querySelector('ul');
const token = localStorage.getItem('token');
const premium = document.querySelector('#premium');

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

premium.addEventListener('click',(e)=>{
    e.preventDefault();
    window.location.href='../payment/paymentlanding.html';
})

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
})

function display(newExpense){
 const singleExpense = document.createElement('ul');
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