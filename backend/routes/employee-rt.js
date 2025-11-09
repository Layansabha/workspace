const express = require('express');
const employeeController = require('../controller/employee-cn');
const isEmployee = require('../middleware/is-auth');
const taskFile = require("../middleware/task");
const image  = require("../middleware/employee-image");
    employeeRoute = express.Router();

    employeeRoute.get('/top-five-employee/:department', isEmployee , employeeController.topFiveEmployee);
    
    employeeRoute.post('/working-hours', isEmployee , employeeController.workingHours);

    employeeRoute.post('/add-task',taskFile.single('result'), isEmployee , employeeController.addTask);

    employeeRoute.get('/get-task', isEmployee , employeeController.getTasks);


    employeeRoute.post('/add-image',image.single('images'), isEmployee , employeeController.addEmployeeImage);

  module.exports =  employeeRoute;

