const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


/**
 * 
 * User Model
 * 
 */
var subscriberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    minlength: 1,
    required: [true, 'firstname is required']
  },
  lastName: {
    type: String,
    require: true,
    minlength: 1,
    required: [true, 'lastname is required']
  },
  companyName: {
    type: String,
    require: true,
    minlength: [2,"Comapny name should be more than 2 character"],
    unique:'Company Name Already Exist',
    required: [true, 'Company is required']
  },
  password: {
    type: String,
    required: [true,'Password is required'],
    minlength: [8,'Password Should be more than 8 character']
  },
  dob: {
    type: Number,
    required: [true,'Please Enter date of Birth']
    // minlength: 8
  },
  address: {
    type: String,
    required: [true,'please Enter Address']
    // minlength: 8
  },
  city: {
    type: String,
    required: [true,'City is Required']
    // minlength: 8
  },
  email: {
    type: String,
    required: [true,'Email Address is Required'],
    trim: true,
    minlength: 5,
    unique: false,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid Email address'
    }
  },
  state: {
    type: String,
    required: [true,'State is Required']
    // minlength: 8
  },
  country: {
    type: String,
    required: [true,'Country is required']
    // minlength: 8
  },
  pincode: {
    type: String,
    required: [true,'Pincode is required']
    // minlength: 8
  },
  mobileNumber: {
    type: Number,
    required: [true,'Mobile number is Required'],
    minlength: [10,'Mobile number length should be more than 10 character'],
    maxlength: [13,'Mobile number length should be Less than 13 character'],
  },
  industry: {
    type: String,
    require: true
    // minlength: 8
  },
  package: {
    type: String,
    require: true

    // minlength: 8
  },
 
  susbscriptionUntil:{
    type: String,
    require: true,
    minlength: 1
  },
  // industrie: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   minlength: 2,
  // },
  // OrganisationName: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   minlength: 2,
  // },
//   phone: {
//     type: Number,
//     minlength: 10,
//     validate: {
//       validator: function(v) {
//         return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(v);
//       },
//       message: '{VALUE} is not a valid phone number!'
//     },
//     required: [true, 'User phone number required'],
//     unique: true
//   },
  created: {
    type: Number,
    default: Date.now
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});


subscriberSchema.methods.toJSON = function () {
  var subscriber = this;
  var userObject = subscriber.toObject();
  return _.pick(userObject, ['_id','mobileNumber']);
};

 
subscriberSchema.methods.generateAuthToken = function () {
  var subscriber = this;
  var access = 'auth';
  var token = jwt.sign({_id: subscriber._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  subscriber.tokens.push({access, token});
  return subscriber.save().then(() => {
    return token;
  });
};


subscriberSchema.methods.removeToken = function (token) {
  var subscriber = this;
  return subscriber.update({
    $pull: {
      tokens: {token}
    }
  });
};


subscriberSchema.statics.findByToken = function (token) {
  var Subscriber = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }
  return Subscriber.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};


subscriberSchema.statics.findByCredentials = function (mobileNumber, password) {
  var Subscriber = this;

  return Subscriber.findOne({mobileNumber}).then((subscriber) => {
    if (!subscriber) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
     // Compare the password
      bcrypt.compare(password, subscriber.password, (err, res) => {
        if (res) {
          resolve(subscriber);
        } else {
          reject();
        }
      });
    });
  });
};

/**
 * 
 * Encrypt the user password using bcrypt.js nodejs library
 * 
 */
subscriberSchema.pre('save', function (next) {
  var subscriber = this;

  if (subscriber.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(subscriber.password, salt, (err, hash) => {
        subscriber.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = {Subscriber}
