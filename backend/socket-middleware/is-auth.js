const jwt = require('jsonwebtoken');
require('dotenv').config();

const authSocket = (socket, next) => {
  try {
    const token = socket.handshake.headers['x-auth-token'];

    if (!token) {
      const error = new Error('Not authenticated. Token missing.');
      error.statusCode = 401;
      return next(error);
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      const error = new Error('Token verification failed.');
      error.statusCode = 401;
      return next(error);
    }

    // Attach the token and employee ID to the socket object
    socket.token = token;
    socket.employee = { id: verified.id }; // (wrap in object for future extensibility)

    console.log(`Socket authenticated employee ID: ${socket.employee.id}`);

    next(); // Allow the socket to connect
  } catch (err) {
    console.error('Socket authentication error:', err.message);
    err.statusCode = err.statusCode || 500;
    next(err); // Pass the error to socket.io error handler
  }
};

module.exports = authSocket;
