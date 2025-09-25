const User = require("../models/User");
const jwt = require("jsonwebtoken");

const genToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "All fields are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({ success: true, data: { _id: user._id, name: user.name, email: user.email, token: genToken(user._id) } });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({ success: true, data: { _id: user._id, name: user.name, email: user.email, token: genToken(user._id) } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    next(err);
  }
};
