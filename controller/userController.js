const userModel = require('../models/user');

const signup = async(req,res)=>{
    try{
      const user = await userModel.create({...req.body});
      res.status(201).send('user is added');
    }
    catch(err){
        console.log(err.message);
        res.status(500).send(err.message);
    }
}


module.exports = {signup};