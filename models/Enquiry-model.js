var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const validator = require('validator');
var uniqueValidator = require('mongoose-unique-validator');


/**
 * 
 * Sevices Model
 * 
 */ 
var Enquiry = new Schema( {
    name: {
        type: String,
        required: [true,' Name is required'],
        minlength: 1,
        trim: true
    },
    number: {
        type:Number,
        required:[true,'Customer number is required'],
        validate: {
            validator: function(v) {
              return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
          }
    },
    email: {
        type: String,
        required: [true,'Email Address is required'],
        trim: true,
        minlength: 5,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid Email address'
        }
    },
    dob: {
        type:Number,
        required:[true,'Date of birth is required']
    },
    address: {
        type:String,
        required:[true,'Address is required']
    },
    notes: {
        type:String,
        required:[true,'Notes is required']
    },
    interactionType: {
        type:String,
        required:[true,'Interaction Type is required']
    },
    enquiryTime: {
        type:Number,
        required:[true,'Enquiry time is required']
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
Enquiry.plugin(uniqueValidator/* ,{: 'Error, expected {PATH} to be unique.' } */);

// module.exports = {Enquiry};