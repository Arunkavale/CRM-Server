var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const validator = require('validator');


/**
 * 
 * Sevices Model
 * 
 */ 
var Enquiry = new Schema( {
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
        type:Number,
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
        type:Number,
        required:true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    subscriberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
},{timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }});

mongoose.model('enquiry',Enquiry);
// module.exports = {Enquiry};