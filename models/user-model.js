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
var UserSchema = new mongoose.Schema({
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
  // userName: {
  //   type: String,
  //   require: true,
  //   minlength: 6,
  //   unique:true,
  //   required: [true, 'UserName is required']
  // },
  password: {
    type: String,
    required: [true,'Password is required'],
    minlength: [8,'Password should be more than 8 charater']
    // minlength: [,'Password should be more than 8 charater'],
  },
  dob: {
    type: Number,
    required: [true,'Date of birth is required']
    // minlength: 8
  },
  address: {
    type: String,
    required: [true,'Address is required']
    // minlength: 8
  },
  email: {
    type: String,
    required: [true,'email address is required'],
    trim: true,
    minlength: 5,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid Email address'
    }
  },
  // customerId:{
  //   type: String,
  //   require: true,
  //   minlength: 1
    
  // },
  // operatorId: {
  //   type: Number,
  //   required: [true,'Operator ID is required']
  // },
  subscriberId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // enquiryTime: {
  //   type:Date,
  //   required:true
  // },
  // OrganisationName: {
  //   type: String,
  //   required: true,
  //   trim: true,
  //   minlength: 2,
  // },
  phone: {
    type: Number,
    minlength: 10,
    validate: {
      validator: function(v) {
        return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/.test(v);
      },
      message: '{VALUE} is not a valid phone number!'
    },
    required: [true, 'User phone number required'],
    unique: true
  },
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


UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email','firstName','lastName','phone','operatorId','subscriberId']);
};

 
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  user.tokens.push({access, token});
  return user.save().then(() => {
    return token;
  });
};


UserSchema.methods.removeToken = function (token) {
  var user = this;
  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};


UserSchema.statics.findByToken = function (token) {
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


UserSchema.statics.findByCredentials = function (phone, password) {
  var User = this;

  return User.findOne({phone}).then((user) => {
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
UserSchema.pre('save', function (next) {
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

var User = mongoose.model('User', UserSchema);

module.exports = {User}
