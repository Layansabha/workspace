const express = require('express');
const authController = require('../controller/auth');

    authRt = express.Router();

    authRt.post("/login", authController.login);

    authRt.post("/hr-account", authController.createHrAccount);

    module.exports =  authRt;
