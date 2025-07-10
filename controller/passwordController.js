const nodemailer = require("nodemailer");
const forgotPasswordRequestsModel = require('../models/forgotPasswordRequestModel');
const userModel = require('../models/user');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const forgotpassword = async (req, res) => {
    try {
        const usermail = req.header('Usermail');
        
        const user = await userModel.findOne({email:usermail});
        
        if(!user){
            return res.status(404).json({'error':"invalid email"});
        }

      const result=  await forgotPasswordRequestsModel.create({
            userId:user._id,
            isactive:true
        })
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure:false,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_SMTP_KEY,

            },
        });


        const info = await transporter.sendMail({
            from: {
              name: 'SUMIT',
              address: `<shankhwarsumit117@gmail.com>`

            },
            to: `${usermail}`,
            subject: "forgot password",
            text: `${process.env.API_BASE}/password/resetpassword/${result._id}`,
            html: `${process.env.API_BASE}/password/resetpassword/${result._id}`,

  });

        console.log("Message sent: ", info.messageId);

        res.status(200).json({
            info
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            'error': err.message
        });
    }
};


const resetPassword = async(req,res)=>{
    try{ const reqId = req.params.uuid;
         const request = await forgotPasswordRequestsModel.findById(reqId);
         if(!request){
            return res.status(404).json({'error':"invalid request id"})
         }
         if(!request.isactive){
            return res.status(404).json({'error':"request link expired"});
         }
         
         res.status(200).sendFile(path.join(__dirname,'../public/resetpassword.html'));
    }catch(err){
        console.log(err);
        res.status(500).json({'error':err.message});
    }
}

const updatePassword=async(req,res)=>{
        const session = await mongoose.startSession();
        session.startTransaction();
    try{ 
         const uuid = req.params.uuid;
         const newpassword = req.body.newpassword;
         const hashedPassword = await bcrypt.hash(newpassword,10);
         const resetRequest = await forgotPasswordRequestsModel.findById(uuid).session(session);

         if (!resetRequest || !resetRequest.isactive) {
            await session.abortTransaction();
         return res.status(400).json({ error: "Invalid or expired reset link" });
         }

         const {userId} = resetRequest;

         const user = await userModel.findById(userId).session(session);
         if (!user) {
         resetRequest.isactive = false;
         await resetRequest.save({ session });
         await session.commitTransaction();
         return res.status(404).json({ error: "User not found" });
         }
         resetRequest.isactive=false;
         await resetRequest.save({session});
         user.password = hashedPassword;
         await user.save({session});
         await session.commitTransaction();
         return res.status(200).send('working');

    }catch(err){
        console.log(err);
        await session.abortTransaction();
        res.status(500).json({'error':err.message});
    }finally{
         session.endSession();
    }
}

module.exports = {
    forgotpassword,resetPassword,updatePassword
};