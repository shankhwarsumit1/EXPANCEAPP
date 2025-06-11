const jwt = require('jsonwebtoken');
const User = require('../models/user');


const authenticate = async(req,res,next) => {
   
    try{
        const token = req.header('Authorization');
        if(!token){
            return res.status(401).json({success:false,
                message:'Token not provided'
            });
        }
        console.log(token);
        const decoded = jwt.verify(token,process.env.SECURITY_KEY);
        console.log(decoded);
        const user = await User.findByPk(decoded.userId);
        if(!user){
            res.status(401).json({success:false,message:'User not found'});
        }
        console.log(user);
        req.user = user;
        next(); 
       
    }
    catch(err){
       console.log(err);
       return res.status(401).json({success: false,message:'invalid token'});
    }
}

module.exports = authenticate;