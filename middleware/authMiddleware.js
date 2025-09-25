const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // 1️⃣ Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token

      // 2️⃣ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3️⃣ Attach user to request
      req.user = await User.findById(decoded.id).select('-password');
      next(); // ✅ Authorized
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
