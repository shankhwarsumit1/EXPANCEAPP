

window.addEventListener('DOMContentLoaded',(e)=>{
    e.preventDefault()
const REST_API = "http://localhost:3000/expense/addExpense";
const form = document.querySelector('form');
const expenseList = document.querySelector('ul');

(async ()=>{
   try{
         const res = await getExpense(REST_API);
         res.data.forEach((exp)=>{
            display(exp);
         })
   }
   catch(err){
    console.log(err);
   }
})();


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
}

async function postExpense(expense){
try{
      const res = await axios.post(REST_API,expense);
      return res;
}
catch(err){
    console.log(err);
}}

async function getExpense() {
    try{
           const res = axios.get(REST_API);
           console.log(res);
           return res;
    }
    catch(err){
        console.log(err);
    }
}
















})