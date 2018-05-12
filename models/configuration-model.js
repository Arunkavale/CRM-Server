var mongoose = require('mongoose');

/**
 * 
 * Configuration Model
 * 
 */ 
var Configuration = mongoose.model('configuration', {
  serviceName: {
    type: String,
    required: [true,'Service Name is required'],
    minlength: 1,
    trim: true
  },
  price: {
    type: Number,
    required: [true,'Price is required'],
    minlength: 1,
    trim: true
  },
  tax: {
    type: Number,
    required: [true,'Tax is required'],
    minlength: 1,
    trim: true
  },
  GST: {
    type: Number,
    required: [true,'GST is required'],
    minlength: 1,
    trim: true
  },
  totalPrice: {
    type: Number,
    required: [true,'Total price is required'],
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  subscriberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Configuration};
