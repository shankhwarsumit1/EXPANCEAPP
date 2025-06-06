require('dotenv').config();
const express = require('express');
const db = require('./utils/db-connection');
const userRouter = require('./router/userRouter');
const expenceRouter = require('./router/expenceRouter');
const cashfreeRouter = require('./router/cashfreeRouter')
const passwordRouter = require('./router/passwordRouter');
const path = require('path');
require('./models');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Validate Cashfree credentials
if (!process.env.CASHFREE_APIID || !process.env.CASHFREE_SECRETKEY) {
    console.error('ERROR: Cashfree credentials are missing in .env file');
    console.error('Please add CASHFREE_APIID and CASHFREE_SECRETKEY to your .env file');
    process.exit(1);
}

// Log credentials for debugging (remove in production)
console.log('Cashfree credentials loaded:', {
    apiId: process.env.CASHFREE_APIID?.substring(0, 4) + '...',
    secretKey: process.env.CASHFREE_SECRETKEY?.substring(0, 4) + '...'
});


app.use('/user',userRouter);
app.use('/expense',expenceRouter);
app.use('/pay',cashfreeRouter);
app.use('/password', passwordRouter);
const paymentController = require('./controller/paymentController');
app.get('/payment-status/:orderId', paymentController.getPaymentStatusid);
console.log(process.env.CASHFREE_APIID, process.env.CASHFREE_SECRETKEY);
db.sync({force:false}).then(()=>{
    app.listen(3000,()=>{
        console.log('server is running on port 3000');
    })
})

