var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

/**
 * 
 * Sevices Model
 * 
 */ 
var UnattendedCalls =  new mongoose.Schema({
    number: {
        type: Number,
        required: [true,'Customer number is required'],
        minlength: 10,
        validate: {
            validator: function(v) {
              return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
          }
    },
    missedcalltime: {
        type:Number,
        required:[true,'Missed call time is required']
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdTime:{
        type:Number,
        required:true
    },
    subscriberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
});
mongoose.model('unattendedCalls',UnattendedCalls);

UnattendedCalls.plugin(uniqueValidator/* ,{: 'Error, expected {PATH} to be unique.' } */);

module.exports = {UnattendedCalls};
