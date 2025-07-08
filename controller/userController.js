const User = require('../models/user');
const bcrypt = require('bcrypt');
const User = require('../models/user');


const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name,
      email,
      password: hashedPassword})
    await user.save();

    res.status(201).json({ success: true, message: 'User is added' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'user not found'
      });
    }
    const isPasswodValid = await User.validatePassword(password);
    if (isPasswodValid) {
      res.status(200).json({
        success: true,
        message: "user login successfull",
        token: await User.getJWT(),
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