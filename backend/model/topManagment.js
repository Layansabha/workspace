const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Employee = require('./employee');


const topManagment =  new Schema({
    strategicDecisions: {
        type: String,
    },
    

});

const TopManagment = Employee.discriminator('top managment', topManagment);


module.exports = TopManagment;

