const User = require('../models/User');
const jwt = require('jsonwebtoken');

const genToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User exists' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: genToken(user._id) });
  } catch (err) { next(err); }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({ _id: user._id, name: user.name, email: user.email, token: genToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) { next(err); }
};
