var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const validator = require('validator');
var uniqueValidator = require('mongoose-unique-validator');


var Appointment = new Schema({
    name:{
        type:String,
        required:[true,'Customer name is required'],
        minlength:1
    },
    phoneNumber:{
        type:Number,
        required:[true,'Customer phone number is reuired'],
        // minlength:10
        validate: {
            validator: function(v) {
              return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
          }
    },
    email: {
        type: String,
        required: [true,'Email address is required'],
        trim: true,
        minlength: 5,
        validate: {
          validator: validator.isEmail,
          message: '{VALUE} is not a valid Email address Ex :- abc@xyz.com'
        }
      },
    dob: {
        type: Number,
        required: [true,'Date of birth is required'],
    },
    address: {
        type: String,
        required: [true,'Address is required'],
        minlength: 2,
        trim: true
    },
    notes: {
        type: String,
        required: [true,'Notes is required'],
        // minlength: 2,
    },
    interactionType: {
        type: String,
        required: [true,'Interaction Type is required'],
        minlength: 2,
        trim: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      appointmentTime: {
        type:Number,
        require:true,
        required:'Appointment Time is required'
    },
    subscriberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
},{timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }});

Appointment.plugin(uniqueValidator/* ,{: 'Error, expected {PATH} to be unique.' } */);


mongoose.model('Appointment',Appointment);
// module.exports={Appointment};