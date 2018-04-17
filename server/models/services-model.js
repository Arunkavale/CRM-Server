var mongoose = require('mongoose');

/**
 * 
 * Sevices Model
 * 
 */ 
var Services = mongoose.model('services', {
    categoryName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  services: [{
    serviceName:String,
		price:Number
  }],
  
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Services};
