const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Employee = require('./employee');


const manager =  new Schema({
    generateReports: [{
        type: String,
    }],
    supervisedTasks: [{
        type: String,
    }],
    performanceOversight: {
        type: String,
    },
   
   

});

const Manager = Employee.discriminator('manager', manager);


module.exports = Manager;

