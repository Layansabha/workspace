const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveRequestSchema =  new Schema({
    employeeId:{
        type:Schema.Types.ObjectId,
        ref:'Employee',
        required: true
  
    },
    employeeName:{
      type:Schema.Types.String,
      ref:'Employee',
      required: true

  },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date,
    },
    reason: {
        type: String,
        required: true
    },
    explainReason: {
        type: String,
    },
    status: {
        type: Boolean,
        default: null

    },
   

});

const leaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

module.exports = {leaveRequest, leaveRequestSchema};
