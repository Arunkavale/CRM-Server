var mongoose = require('mongoose');


var callLogsSchema = new mongoose.Schema({

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
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    datetime: {
        type: Date,
        required: true,
        // minlength: 2,
        trim: true
    },
    timeOfCall: {
        type: Date,
        required: true,
        // minlength: 2,
      
    },
    callType: {
        type: String,
        required: true,
        minlength: 2,
        enum :['Incoming','Missed','Outgoing'],
        trim: true
    },
    callDuration: {
        type: Number,
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
        enum: ['Enquiry','Appointment','CancelAppointment','Others'],
        trim: true
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
});

// var Call_logs = mongoose.model('Call_logs',{
    
// });
mongoose.model('Call_logs', callLogsSchema);
// module.exports={Call_logs};