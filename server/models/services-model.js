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
    type:object,
    required:true
  }],
  
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Services};
