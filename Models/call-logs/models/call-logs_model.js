var mongoose = require('mongoose');

var Call_logs = mongoose.model('Call_logs',{
    customerNumber:{
        type:Number,
        require:true,
        minlength:10
    },
    customerName: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    operatorId: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    // datetime: {
    //     type: Date,
    //     required: true,
    //     // minlength: 2,
    //     trim: true
    // },
    timeOfCall: {
        type: Date,
        required: true,
        // minlength: 2,
      
    },
    callType: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    callDuration: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    recordingFile: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    purpose: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
});

module.exports={Call_logs};