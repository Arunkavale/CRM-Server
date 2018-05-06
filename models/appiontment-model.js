var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const validator = require('validator');


var Appointment = new Schema({
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
        type: Number,
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
        type:Number,
        required:true
    },
    subscriberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
},{timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }});

mongoose.model('Appointment',Appointment);
// module.exports={Appointment};