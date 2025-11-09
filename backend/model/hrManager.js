const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Employee = require('./employee');
const hrManager =  new Schema({
    manageEmployee: [{
        type: Employee,
    }],
    recruitmentOrganized: {
        type: String,
    },
   
   
});

const HrManager = Employee.discriminator('hr manager', hrManager);


module.exports = HrManager;
