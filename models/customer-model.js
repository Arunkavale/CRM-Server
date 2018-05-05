var mongoose = require('mongoose'),
Schema = mongoose.Schema;
const validator = require('validator');



/**
 * 
 * Custmer Model
 * 
 */ 
var Customer =  new Schema({
    customerNumber: {
        type: Number,
        required: true,
        minlength: 10,
        trim: true
    },
    customerName: {
        type:String,
        required:true
    },
    address: {
        type:String,
        // required:true
    },
    email: {
        type: String,
        // required: true,
        trim: true,
        minlength: 5,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid Email address'
        }
    },
    dob: {
        type:Date
        // required:true
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},{timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }});

mongoose.model('Customer', Customer);
// module.exports = {Customer};