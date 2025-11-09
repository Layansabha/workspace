const mongoose = require("mongoose");
const employee = require("./employee");
const Schema = mongoose.Schema;

const TaskSchema =  new Schema({
     ManagerId:{
        type:Schema.Types.ObjectId,
        ref:'Employee',
        required: true
    },
     employeeId:{
        type:Schema.Types.ObjectId,
        ref:'Employee',
        required: true
    },
    taskTitle:{
      type: String,
        required: true
    },
    TaskDes:{
      type: String,
        required: true
  },
     value: {
     type: String,
        required: true

    },
       status: {
        type: Boolean,
        default: null

    },
  statusDes: {
        type: String,

    },
   result:{
    type:String
   }
 
   

});

const Task = mongoose.model('Task', TaskSchema);

module.exports = {Task, TaskSchema};
