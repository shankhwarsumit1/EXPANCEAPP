const express = require('express');
const dbconnect = require('./utils/db-connection');
require('dotenv').config();

const userRouter = require('./router/userRouter');
const expenceRouter = require('./router/expenceRouter');
const paymentRouter = require('./router/paymentRouter');
const premiumRouter = require('./router/premiumRouter');
const passwordRouter = require('./router/passwordRouter');
const cors = require('cors');
const app = express();
app.use(cors()); //cross origin resourse sharing
app.use(express.json());
app.use(express.static('public'));

app.use('/user',userRouter);
app.use('/expense',expenceRouter);
app.use('/payment',paymentRouter);
app.use('/premium',premiumRouter);
app.use('/password',passwordRouter);

dbconnect().then(()=>{
    console.log(`database connection established`);
    app.listen(3000,()=>{
        console.log('server is running');
    })
})
.catch((err)=>{
    console.log('db not connected',err.message);
})
