const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'why no name'],
        minLength:2,
        maxLength:50,
        trim:true
    },
    email:{
        type:String,
        required:[true,'why no email'],
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('invalid email try again'+value)
            }
        }
    },
    password:{
        type:String,
        required:[true,'why no password'],
    },
    isPremium:{
        type:Boolean,
        default:false
    },
    totalExpense:{
        type:Number,
        default:0
    }
},{
    timestamps:true,
})

userSchema.methods.getJWT=async function(){
    const token = await jwt.sign({_id:this._id},process.env.SECURITY_KEY);
    return token;
}

userSchema.methods.validatePassword = async function(userInputPassword){
    const user = this;
    const passwordHash = user.password;
    const isPasswodValid = await bcrypt.compare(userInputPassword,passwordHash);
    return isPasswodValid;
}

const User = mongoose.model('Users',userSchema);

module.exports = User;