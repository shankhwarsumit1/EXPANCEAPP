const nodemailer = require("nodemailer");


const forgotpassword = async(req,res)=>{
try{
    const usermail = req.header('Usermail');
    let testAccount = await nodemailer.createTestAccount();
    //connect with the smtp
    const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'grayson.wintheiser@ethereal.email',
        pass: 'ttnCCkGaMhTAZN5aSN'
    }
    });
      
  
        const info = await transporter.sendMail({
            from:`"sumit shankhwar" <shankhwarsumit117@gmail.com>`,
            to:`${usermail}`,
            subject:"hello user",
            text:"hello forgotten password",
            html:"<b>hel</b>",
        });
      
        console.log("Message sent: ",info.messageId); 

    res.status(200).json({info});
}
catch(err){
    console.log(err);
    res.status(500).json({'error':err.message});
}
};

module.exports = {forgotpassword};