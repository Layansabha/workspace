const jwt = require('jsonwebtoken');
const User = require('../model/employee');
require('dotenv').config();

const isHrManager = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization'); // ← هذا بدل x-auth-token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authenticated (missing token)' });
    }

    const token = authHeader.split(' ')[1];
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(verified.id);
    if (!user || user.role !== 'hr manager') {
      return res.status(403).json({ message: 'Access denied: not HR manager' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = isHrManager;
