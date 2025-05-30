const express = require('express');
const db = require('./utils/db-connection');
const userRouter = require('./router/userRouter');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

db.sync({force:false}).then(()=>{
    app.listen(3000,()=>{
        console.log('server is running on port 3000');
    })
})

app.use('/user',userRouter);