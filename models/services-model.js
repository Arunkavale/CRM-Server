var mongoose = require('mongoose'),
Schema = mongoose.Schema;


/**
 * 
 * Sevices Model
 * 
 */ 
var Services = new Schema(  {
  Services:{
    type:Array,
    required:true
  },
  //   categoryName: {
  //   type: String,
  //   // required: true,
  //   minlength: 1,
  //   trim: true
  // },
  // services: {
  //   type:Array,
  //   // required:true
  // },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    unique:true
  }
},{timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }});


mongoose.model('services',Services);


module.exports = {Services};
