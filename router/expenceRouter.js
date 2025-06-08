const express = require('express');
const expenseController = require('../controller/expenseController');
const authenticate = require('../middleware/authenticate');

router = express.Router();

router.post('/addExpense',authenticate,expenseController.addExpense);
router.get('/addExpense',authenticate,expenseController.getExpense);
router.get('/isPremium',authenticate,expenseController.isPremium);
router.delete('/addExpense/:id',authenticate,expenseController.delExpense);
router.get('/download',authenticate,expenseController.downloadExpense);
module.exports=router;