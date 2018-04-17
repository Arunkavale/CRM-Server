var mongoose = require('mongoose');

var Walkins = mongoose.model('Walkins',{
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
        type: Date,
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
      }
});

module.exports={Walkins};