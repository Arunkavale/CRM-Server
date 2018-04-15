var mongoose = require('mongoose');

var Call_logs = mongoose.model('Call_logs',{
    customer_number:{
        type:Number,
        require:true,
        minlength:10
    },
    customer_name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    operator_id: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    datetime: {
        type: Date,
        required: true,
        // minlength: 2,
        trim: true
    },
    Call_type: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    call_duration: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    recording_file: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    Purpose: {
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