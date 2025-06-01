const express = require('express');
const expenseController = require('../controller/expenseController');

router = express.Router();

router.post('/addExpense',expenseController.addExpense);
router.get('/addExpense',expenseController.getExpense);
module.exports=router