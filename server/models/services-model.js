var mongoose = require('mongoose');

/**
 * 
 * Sevices Model
 * 
 */ 
var Services = mongoose.model('services', {
    category_name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  services: {
    type: Array,
    required: true,
    minlength: 1,
    trim: true
  },
  
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Services};
