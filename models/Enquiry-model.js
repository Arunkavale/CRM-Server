var mongoose = require('mongoose');
const validator = require('validator');


/**
 * 
 * Sevices Model
 * 
 */ 
var Enquiry = mongoose.model('enquiry', {
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    number: {
        type:Number,
        required:true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid Email address'
        }
    },
    dob: {
        type:Date,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    notes: {
        type:String,
        required:true
    },
    interactionType: {
        type:String,
        required:true
    },
    enquiryTime: {
        type:Date,
        required:true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {Enquiry};