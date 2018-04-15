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
  firstname: {
    type: String,
    require: true,
    minlength: 1,
    required: [true, 'firstname is required']
  },
  lastname: {
    type: String,
    require: true,
    minlength: 1,
    required: [true, 'lastname is required']
  },
  company_name: {
    type: String,
    require: true,
    minlength: 6,
    unique:true,
    required: [true, 'UserName is required']
  },
  password: {
    type: String,
    require: true,
    minlength: 8
  },
  dob: {
    type: Date,
    require: true
    // minlength: 8
  },
  address: {
    type: String,
    require: true
    // minlength: 8
  },
  city: {
    type: String,
    require: true
    // minlength: 8
  },
  email: {
    type: String,
    required: true,
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
    require: true
    // minlength: 8
  },
  country: {
    type: String,
    require: true
    // minlength: 8
  },
  pincode: {
    type: String,
    require: true
    // minlength: 8
  },
  mobile_number: {
    type: String,
    require: true
    // minlength: 8
  },
  Industry: {
    type: String,
    require: true
    // minlength: 8
  },
  package: {
    type: String,
    require: true
    // minlength: 8
  },
 
  susbscription_until:{
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
    type: Date,
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
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'mobile_number']);
};

 
subscriberSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  user.tokens.push({access, token});
  return user.save().then(() => {
    return token;
  });
};


subscriberSchema.methods.removeToken = function (token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};


subscriberSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};


subscriberSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
     // Compare the password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
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
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = {Subscriber}
