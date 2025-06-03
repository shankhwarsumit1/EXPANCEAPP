const express = require('express');
const db = require('./utils/db-connection');
const userRouter = require('./router/userRouter');
const expenceRouter = require('./router/expenceRouter');
require('./models');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());



app.use('/user',userRouter);
app.use('/expense',expenceRouter);

db.sync({force:false}).then(()=>{
    app.listen(3000,()=>{
        console.log('server is running on port 3000');
    })
})