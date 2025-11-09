const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedback =  new Schema({
    feedbackType: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
   
    status: {
        type: String,
        required: true
    },
   

});

module.exports = feedback;
