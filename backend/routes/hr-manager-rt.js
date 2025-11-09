const { body } = require('express-validator');
const express = require('express');
const hrManagerAuth = require('../middleware/is-hrManager');
const hrManagerController = require('../controller/hr-manager-cn');
const isEmployee = require("../middleware/is-auth");
    hrMang = express.Router();

    hrMang.post('/add-employee',[
            body('email')
              .isEmail()
              .withMessage('Please enter a valid email.')
              .normalizeEmail(),
              body('password')
              .trim()
              .isLength({ min: 8 })
              .withMessage('Password must be at least 8 characters long.')
              .matches(/[A-Z]/)
              .withMessage('Password must contain at least one uppercase letter.')
              .matches(/[a-z]/)
              .withMessage('Password must contain at least one lowercase letter.')
              .matches(/[0-9]/)
              .withMessage('Password must contain at least one number.')
              .matches(/[@$!%*?&]/)
              .withMessage('Password must contain at least one special character (@, $, !, %, *, ?, &).'),
            body('name')
              .trim()
              .not()
              .isEmpty()
          ],hrManagerAuth, hrManagerController.addEmployee
        );

          hrMang.put('/modify-employee', hrManagerAuth,hrManagerController.updateEmployee);

          hrMang.get('/get-employees', hrManagerAuth,hrManagerController.getEmployees);

          hrMang.delete('/delete-employee', hrManagerAuth , hrManagerController.deleteEmployees);

          hrMang.get('/get-request',hrManagerAuth,hrManagerController.getReq);

          hrMang.post('/modify-request', hrManagerAuth,hrManagerController.statusOfReq);

          hrMang.post('/add-event', hrManagerAuth,hrManagerController.addEvent);

          hrMang.get('/get-events', hrManagerAuth,hrManagerController.getEvent);

          hrMang.get('/get-request', hrManagerAuth,hrManagerController.getReq);


          hrMang.post('/manage-department', hrManagerAuth,hrManagerController.manageDepartment); 

            hrMang.post('/change-to-employee', hrManagerAuth , hrManagerController.changeIntoEmployee);

        hrMang.get('/get-workeing-hours-employess',hrManagerAuth,hrManagerController.getTodayWorkingEmployees);
        module.exports =  hrMang;
