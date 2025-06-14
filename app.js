const express = require('express');
const db = require('./utils/db-connection');
require('dotenv').config();

const userRouter = require('./router/userRouter');
const expenceRouter = require('./router/expenceRouter');
const paymentRouter = require('./router/paymentRouter');
const premiumRouter = require('./router/premiumRouter');
const passwordRouter = require('./router/passwordRouter');
require('./models');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/user',userRouter);
app.use('/expense',expenceRouter);
app.use('/payment',paymentRouter);
app.use('/premium',premiumRouter);
app.use('/password',passwordRouter);

db.sync({force:false}).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('server is running on port 3000');
        console.log('Hello Open http://13.233.121.238:80/login/login.html in your browser');
    })
})