const User = require('../models/user');
const bcrypt = require('bcrypt');


const signup = async (req, res) => {
  try {
       const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User is added'
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'user not found'
      });
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      res.status(200).json({
        success: true,
        message: "user login successfull",
        token: await user.getJWT(),
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
      message: err.message
    });
  }
}



module.exports = {
  signup,
  login
};