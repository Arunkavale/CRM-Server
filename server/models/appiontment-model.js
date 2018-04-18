var mongoose = require('mongoose');
const validator = require('validator');


var Appointment = mongoose.model('Appointment',{
    name:{
        type:String,
        require:true,
        minlength:1
    },
    phoneNumber:{
        type:Number,
        require:true,
        minlength:10
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
        type: Date,
        required: true,
    },
    address: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    notes: {
        type: String,
        required: true,
        // minlength: 2,
    },
    interactionType: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      appointmentTime: {
        type:Date,
        required:true
    }
});

module.exports={Appointment};