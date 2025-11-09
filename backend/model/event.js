const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema =  new Schema({
    employeeEmail:{
    type:Schema.Types.String,
    ref:'Employee',
    required: true,
    },
    eventType: {
        type: String,
        required: true
    },
    eventTime:{
        type: Date,
        required: true
    },
   

});

const Event =mongoose.model('Event', eventSchema);

module.exports = Event;
