var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var Walkins = new Schema({
    customerPhoneNumber:{
        type:Number,
        required:true,
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
        required: true,
        // minlength: 2,
    },
    createdDate: {
        type: Number,
        required: true,
        // minlength: 2,
    },
    order: {
        type: Object,
        required: true,
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
mongoose.model('Walkins',Walkins);
// module.exports={Walkins};