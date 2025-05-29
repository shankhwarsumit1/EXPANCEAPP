const userModel = require('../models/user');
const bcrypt = require('bcrypt');




const signup = async(req,res)=>{
    try{
      const hashedPassword = await bcrypt.hash(req.body.password,10);
      const user = await userModel.create({...req.body,
        password:hashedPassword
      });
      res.status(201).send('user is added');
    }
    catch(err){
        console.log(err.message);
        res.status(500).send(err.message);
    }
}

const login = async(req,res)=>{
  try{
       const {email,password} = req.body;
       const user = await userModel.findOne({where:{email:email}});
       if(!user){
        res.status(404).json({success:false,message:'user not found'});
       }
       const isMatch = await bcrypt.compare(password,user.password);
       if(isMatch){
        res.status(200).json({success:true,message:"user login successfull"});
       }
       else{
        res.status(401).json({success:false,message:'user not authorized'});
       }
  }
  catch(err){
console.log(err);
res.status(500).json({success:false,message:'server error'});
  }
}



module.exports = {signup,login};