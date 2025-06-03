const express = require('express');
const expenseController = require('../controller/expenseController');
const authenticate = require('../middleware/authenticate');

router = express.Router();

router.post('/addExpense',authenticate,expenseController.addExpense);
router.get('/addExpense',authenticate,expenseController.getExpense);
router.delete('/addExpense/:id',authenticate,expenseController.delExpense);
module.exports=router