var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');
    
var Walkins = new Schema({
    customerPhoneNumber:{
        type:Number,
        required:[true,'Customer phone number is required'],
        minlength:10,
        validate: {
            validator: function(v) {
              return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
          }
    },
    customerName: {
        type: String,
        required: [true,'Customer Name is Required'],
        minlength: 2,
        trim: true
    },
    address: {
        type: String,
        required: [true,'address is required'],
        minlength: 2,
        trim: true
    },
    notes: {
        type: String,
        required: [true,'notes is required'],
        // minlength: 2,
        trim: true
    },
    dob: {
        type: Number,
        required: [true,'Date of birth is required'],
        // minlength: 2,
    },
    createdDate: {
        type: Number,
        required: [true,'Created date is required'],
        // minlength: 2,
    },
    order: {
        type: Object,
        required: [true,'Order is required'],
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
    // grandTotal: {
    //     type: Number,
    //     required: true,
    //     minlength: 2,
    //     trim: true
    // },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      subscriberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
},{timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }});
Walkins.plugin(uniqueValidator/* ,{: 'Error, expected {PATH} to be unique.' } */);

mongoose.model('Walkins',Walkins);
// module.exports={Walkins};