var mongoose = require('mongoose');


var callLogsSchema = new mongoose.Schema({

    customerNumber:{
        type:Number,
        required:[true,'Customer Number is required'],
        validate: {
            validator: function(v) {
              return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
          }
    },
    customerName: {
        type: String,
        required: [true,'Customer Name is required'],
        minlength: 2,
        trim: true
    },
    operatorId: {
        type: Number,
        required: [true,'Operator Id is required'],
        minlength: 1,
        trim: true
    },
    datetime: {
        type: Number,
        required: [true,'Date Time is required'],
        // minlength: 2,
        trim: true
    },
    timeOfCall: {
        type: Number,
        required: [true,'Time of call is Required'],
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
        required: [true,'Call Duration is required'],
        minlength: 2,
        trim: true
    },
    recordingFile: {
        type: String,
        required: [true,'Recording file is required'],
        minlength: 2,
        trim: true
    },
    purpose: {
        type: String,
        minlength: 2,
        enum: ['Enquiry','Appointment','CancelAppointment','Others'],
        trim: true
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      subscriberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
},{timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }});

// var Call_logs = mongoose.model('Call_logs',{
    
// });
mongoose.model('Call_logs', callLogsSchema);
// module.exports={Call_logs};