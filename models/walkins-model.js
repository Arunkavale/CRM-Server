var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var Walkins = new Schema({
    customerPhoneNumber:{
        type:Number,
        require:true,
        minlength:10
    },
    customerName: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
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
        trim: true
    },
    timeStamp: {
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