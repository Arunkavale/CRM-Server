var mongoose = require('mongoose');

/**
 * 
 * Sevices Model
 * 
 */ 
var UnattendedCalls = mongoose.model('unattendedCalls', {
    number: {
        type: Number,
        required: true,
        minlength: 10
    
    },
    missedcalltime: {
        type:Date,
        required:true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdTime:{
        type:Date,
        required:true
    },
    subscriberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
});

module.exports = {UnattendedCalls};
