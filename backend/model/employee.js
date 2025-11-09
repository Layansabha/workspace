const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const viewAttdendance = require('./viewAttendance');
const {leaveRequestSchema} = require('./leaveRequest');
const feedback = require('./feedback');
const {TaskSchema} = require("./task");


const employeeSchema =  new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        trim:true
    },
   
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
      },
      
    loginCredentials: {
        type: String,
    },
      images: {
        type: String,
    },
    salary:{
        type:Number,
        required: true,
    },
     points: {
type: Number,
default:0
    },
   status: {
type: Number,
default:0
    },

   viewAttdendance:viewAttdendance,
   leaveRequest:leaveRequestSchema,
   feedback:feedback,
   task:[TaskSchema],
   
    role: {
        type: String,
        enum: [ 'employee' , 'manager','hr manager', 'it departement', 'top managment'],
        required: true,
        default:'employee'
    },
    gender: {
        type: String,
        enum: [ 'male','female'], // ✅ لازم تكون صغيرة وبنفس الحروف
        required: true,
    }
}, { discriminatorKey: 'role', collection: 'employee' });

const employee = mongoose.model('Employee', employeeSchema);

module.exports = employee;
