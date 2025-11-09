const jwt = require('jsonwebtoken');

require('dotenv').config();

const isAuth = async (req, res, next) => {
  const token = req.header('x-auth-token');

  // Check if token is provided
  if (!token) {
    const error = new Error('Not authenticated. Token missing.');
    error.statusCode = 401;
    return next(error);
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      const error = new Error('Token verification failed.');
      error.statusCode = 401;
      return next(error);
    }

    // Attach the token and user ID to the request object
    req.token = token;
    req.user = verified.id;
    console.log(`Authenticated user ID: ${req.user}`);

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Error in authentication:', err.message);
    err.statusCode = err.statusCode || 500;
    next(err); // Pass the error to the error-handling middleware
  }
};

module.exports = isAuth;
