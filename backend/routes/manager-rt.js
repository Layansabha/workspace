const express = require('express');
const managerController = require('../controller/manager');
const isManager = require('../middleware/is-manager');

    managerRoute = express.Router();

    managerRoute.get("get-manager-tasks", isManager,managerController.getTasks);

  module.exports =  managerRoute;

