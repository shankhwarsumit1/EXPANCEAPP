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
app.use(cors()); //cross origin resourse sharing
app.use(express.json());
app.use(express.static('public'));

app.use('/user',userRouter);
app.use('/expense',expenceRouter);
app.use('/payment',paymentRouter);
app.use('/premium',premiumRouter);
app.use('/password',passwordRouter);

db.sync({force:false}).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Hello Open ${process.env.API_BASE}/login/login.html in your browser`);
    })
});