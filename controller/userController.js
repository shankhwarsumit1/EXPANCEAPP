const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const securityKey = 'sumit';

function generateAccessToken(id,name){
  return jwt.sign({userId : id, name:name},securityKey);
}

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.create({
      name,
      email,
      password: hashedPassword
    });
    res.status(201).json({ success: true, message: 'User is added' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'user not found'
      });
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      res.status(200).json({
        success: true,
        message: "user login successfull",
        token: generateAccessToken(user.id,user.name),
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'wrong password'
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'server error'
    });
  }
}



module.exports = {
  signup,
  login
};