const jwt = require('jsonwebtoken');
const Employee = require('../model/employee'); // (adjust path based on your structure)

require('dotenv').config();

const isManagerSocket = async (socket, next) => {
  try {
    const token = socket.handshake.headers['x-auth-token'];

    if (!token) {
      const error = new Error('Not authenticated. Token missing.');
      error.statusCode = 401;
      return next(error);
    }

    let verified;
    try {
      verified = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      err.statusCode = 500;
      return next(err);
    }

    if (!verified) {
      const error = new Error('Token verification failed.');
      error.statusCode = 401;
      return next(error);
    }

    const employee = await Employee.findById(verified.id);

    if (!employee) {
      const error = new Error('employee not found.');
      error.statusCode = 404;
      return next(error);
    }

    if (employee.position !== 'manager') {
      const error = new Error('You are not a manager.');
      error.statusCode = 403;
      return next(error);
    }

    // Attach token and employee info to the socket
    socket.token = token;
    socket.employee = { id: verified.id, role: employee.role };

    console.log(`hr manager authenticated: ${socket.employee.id}`);

    next();
  } catch (err) {
    console.error('hr manager socket authentication error:', err.message);
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};

module.exports = isManagerSocket;
