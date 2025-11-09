const Employee = require('../model/employee');
const {Task} = require("../model/task");


exports.getTasks= async (req, res, next) => {
    try{
        let manager = await Employee.findById(req.user);
        let tasks = await Task.find({ManagerId : manager._id, status:null});
        return res.json(tasks);
    }
     catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
};