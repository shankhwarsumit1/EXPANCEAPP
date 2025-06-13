const nodemailer = require("nodemailer");
const forgotPasswordRequestsModel = require('../models/forgotPasswordRequestModel');
const userModel = require('../models/user');
const {v4:uuidv4} = require('uuid');
const path = require('path');
const bcrypt = require('bcrypt');
const sequelize = require("../utils/db-connection");

const forgotpassword = async (req, res) => {
    try {
        const usermail = req.header('Usermail');
        
        const user = await userModel.findOne({where:{email:usermail}});
        
        if(!user){
            return res.status(404).json({'error':"invalid email"});
        }
        let testAccount = await nodemailer.createTestAccount();
        //connect with the smtp

        const newUUID = uuidv4();
        await forgotPasswordRequestsModel.create({
            id:newUUID ,
            userId:user.id,
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
            text: `http://13.233.121.238:80/password/resetpassword/${newUUID}`,
            html: `<a href="http://13.233.121.238:80/password/resetpassword/${newUUID}>reset</a>`
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
         const request = await forgotPasswordRequestsModel.findByPk(reqId);
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
    try{ const transaction = await sequelize.transaction();
         const uuid = req.params.uuid;
         const newpassword = req.body.newpassword;
         const hashedPassword = await bcrypt.hash(newpassword,10);
         const resetRequest = await forgotPasswordRequestsModel.findByPk(uuid);

         if (!resetRequest || !resetRequest.isactive) {
         return res.status(400).json({ error: "Invalid or expired reset link" });
         }

         const {userId} = resetRequest;
         resetRequest.isactive=false;
         await resetRequest.save({transaction})
         const user = await userModel.findByPk(userId);

         if (!user) {
         return res.status(404).json({ error: "User not found" });
         }
         
         user.password = hashedPassword;
         await user.save({transaction});
         await transaction.commit();
         return res.status(200).send('working');

    }catch(err){
        console.log(err);
        await transaction.rollback();
        res.status(500).json({'error':err.message});
    }
}

module.exports = {
    forgotpassword,resetPassword,updatePassword
};