var mongoose = require('mongoose'),
Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


/**
 * 
 * Sevices Model
 * 
 */ 
var Services = new mongoose.Schema(  {
  Services:{
    type:Array,
    required:[true,'Services is required']
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
 /*  subscriberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  } */
},{timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' }});

Services.plugin(uniqueValidator/* ,{: 'Error, expected {PATH} to be unique.' } */);

mongoose.model('services',Services);


module.exports = {Services};
