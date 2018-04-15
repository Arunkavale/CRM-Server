require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Configuration} = require('./models/configuration-model');
var {User} = require('./models/user-model');

var {Call_logs}=require('../Models/call-logs/models/call-logs_model');
var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());


/**
 * 
 * Authentication Middleware
 * 
 */

var authenticate = (req, res, next) => {
  var token = req.header('user-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

/**
 * 
 * Post Request for Configure the Services
 * 
 */
app.post('/configurations', authenticate, (req, res) => {

  console.log(req.body);
  
  var configuration = new Configuration({
    serviceName: req.body.serviceName,
    price: req.body.price,
    tax: req.body.tax,
    GST: req.body.GST,
    totalPrice: req.body.price+req.body.tax+req.body.GST,
    _creator: req.user._id
  });
  console.log("******// Configuration //******");
  console.log(configuration);
  configuration.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});


/**
 * 
 * Calllogs
 * 
 */


app.post('/calllogs', authenticate, (req, res) => {

  console.log(req.body);
  
  var calllogs = new Call_logs({
    customer_number: req.body.customer_number,
    customer_name: req.body.customer_name,
    operator_id: req.body.operator_id,
    datetime: new Date(),
    Call_type: req.body.Call_type,
    call_duration: req.body.call_duration,
    recording_file: req.body.recording_file,
    Purpose: req.body.Purpose,
    _creator: req.user._id
  });
  console.log("******// Call logs //******");
  console.log(calllogs);
  calllogs.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});



/**
 * 
 * check the all configured services by user
 */
app.get('/calllogs', authenticate, (req, res) => {
  Call_logs.find({
    _creator: req.user._id
  }).then((calllogs) => {
    res.send({calllogs});
  }, (e) => {
    res.status(400).send(e);
  });
});





/**
 * 
 * check the all configured services by user
 */
app.get('/configurations', authenticate, (req, res) => {
  Configuration.find({
    _creator: req.user._id
  }).then((configurations) => {
    res.send({configurations});
  }, (e) => {
    res.status(400).send(e);
  });
});

/**
 * 
 * Check Service by id
 * 
 */
app.get('/configurations/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Configuration.findOne({
    _id: id,
    _creator: req.user._id
  }).then((configuration) => {
    if (!configuration) {
      return res.status(404).send();
    }

    res.send({configuration});
  }).catch((e) => {
    res.status(400).send();
  });
});

/**
 * 
 * Delete Service By id
 * 
 */
app.delete('/configurations/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Configuration.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((configuration) => {
    if (!configuration) {
      return res.status(404).send();
    }

    res.send({configuration});
  }).catch((e) => {
    res.status(400).send();
  });
});

/**
 * 
 * Edit Servise useing ID
 * 
 */
app.patch('/configurations/:id', authenticate, (req, res) => {
  var id = req.params.id;
<<<<<<< HEAD
  var body =req.body;
=======
  var body = req.body;
>>>>>>> b4aec8d9917231c5363e3e57f3c9080b875508e7

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Configuration.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((configuration) => {
    if (!configuration) {
      return res.status(404).send();
    }

    res.send({configuration});
  }).catch((e) => {
    res.status(400).send();
  })
});

/**
 * 
 * Post Request for sign up user
 * 
 */
app.post('/users', (req, res) => {
  var body = req.body;
  var user = new User(body);
   
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('user-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

/**
 * 
 * Login User
 * 
 */
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('user-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

/**
 * 
 * Logout the user
 * 
 */
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
