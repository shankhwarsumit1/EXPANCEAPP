require('dotenv').config();
const express = require('express');
const db = require('./utils/db-connection');
const userRouter = require('./router/userRouter');
const expenceRouter = require('./router/expenceRouter');
const cashfreeRouter = require('./router/cashfreeRouter')
const path = require('path');
require('./models');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/user',userRouter);
app.use('/expense',expenceRouter);
app.use('/pay',cashfreeRouter);
console.log(process.env.CASHFREE_APIID, process.env.CASHFREE_SECRETKEY);
db.sync({force:false}).then(()=>{
    app.listen(3000,()=>{
        console.log('server is running on port 3000');
    })
})

