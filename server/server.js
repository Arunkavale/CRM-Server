require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Configuration} = require('./models/configuration-model');
var {User} = require('./models/user-model');
var {Services} = require('./models/services-model');

var {Subscriber} = require('./models/subscriber-model');
var {Walkins} = require('./models/walkins-model');
var {Appointment} = require('./models/appiontment-model');
var {Enquiry} = require('./models/Enquiry-model');
var {UnattendedCalls} = require('./models/unattended-model');



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




var SubAuthenticate = (req, res, next) => {
  var token = req.header('subsc-auth');

  Subscriber.findByToken(token).then((subscriber) => {
    if (!subscriber) {
      return Promise.reject();
    }

    req.subscriber = subscriber;
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



app.post('/walkins', authenticate, (req, res) => {

  console.log(req.body);
  
  var walkins = new Walkins({
    customerPhoneNumber: req.body.customerPhoneNumber,
    customerName: req.body.customerName,
    address: req.body.address,
    notes: req.body.notes,
    timeStamp: req.body.timeStamp,
    order: [{
      orderList:{
        serviceId1:req.body.serviceId1,
        serviceId3:req.body.serviceId3
      },
    grandTotal: req.body.grandTotal,
      
    }],
    customerId: req.user._id
  });
  console.log(walkins.order.orderList);
  console.log("******// Configuration //******");
  console.log(walkins);
  walkins.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});


app.post('/appointment', authenticate, (req, res) => {
  console.log(req.body);
  var appiontment = new Appointment({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    dob: req.body.dob,
    address: req.body.address,
    notes: req.body.notes,
    appointmentTime:req.body.appointmentTime,
    interactionType: req.body.interactionType,
    customerId: req.user._id
  });
  console.log("******// Configuration //******");
  // console.log(walkins);
  appiontment.save().then((doc) => {
    var saved=[{ "status": "success" }]
    res.send(saved);
  }, (e) => {
    res.status(400).send(e);
  });
});



app.post('/enquiry', authenticate, (req, res) => {
  var enquiry = new Enquiry({
    name: req.body.name,
    number: req.body.number,
    email: req.body.email,
    dob: req.body.dob,
    address: req.body.address,
    notes: req.body.notes,
    interactionType: req.body.interactionType,
    enquiryTime: req.body.enquiryTime,
    customerId: req.user._id
  });
  console.log("******// Configuration //******");
  // console.log(walkins);
  enquiry.save().then((doc) => {
    var saved=[{ "status": "success" }]
    res.send(saved);
  }, (e) => {
    res.status(400).send(e);
  });
});




app.post('/unattendedCalls', authenticate, (req, res) => {
  var unattendedCalls = new UnattendedCalls({
    number: req.body.number,
    missedcalltime: req.body.missedcalltime,
    createdTime: new Date(),
    customerId: req.user._id
  });
  console.log("******// Configuration //******");
  // console.log(walkins);
  unattendedCalls.save().then((doc) => {
    var saved=[{ "status": "success" }]
    res.send(saved);
  }, (e) => {
    res.status(400).send(e);
  });
});


app.get('/unattendedCalls', authenticate, (req, res) => {
  UnattendedCalls.find({
    customerId: req.user._id
  }).then((unattendedCalls) => {
    res.send({unattendedCalls});
  }, (e) => {
    res.status(400).send(e);
  });
});


app.delete('/unattendedCalls/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  UnattendedCalls.findOneAndRemove({
    _id: id,
    customerId: req.user._id
  }).then((unattendedCalls) => {
    if (!unattendedCalls) {
      return res.status(404).send();
    }
    var deleted=[{ "status": "success" }]

    res.send({deleted});
  }).catch((e) => {
    res.status(400).send();
  });
});




app.get('/get_Appointment', authenticate, (req, res) => {
  Appointment.find({
    customerId: req.user._id
  }).then((appointment) => {
    res.send({appointment});
  }, (e) => {
    res.status(400).send(e);
  });
});


app.get('/getWalkins', authenticate, (req, res) => {
  Walkins.find({
    customerId: req.user._id
  }).then((walkins) => {
    res.send({walkins});
  }, (e) => {
    res.status(400).send(e);
  });
});



app.post('/Create_services', authenticate, (req, res) => {

  console.log(req.body);
  
  var services = new Services({
    categoryName: req.body.categoryName,
    services: {
      serviceName:req.body.serviceName,
      price:req.body.price   
    },
    _creator: req.user._id
  });
  console.log("******// Configuration //******");
  // console.log(configuration);
  services.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});


app.get('/get_Service', authenticate, (req, res) => {
  Services.find({
    _creator: req.user._id
  }).then((services) => {
    res.send({services});
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
    customerNumber: req.body.customerNumber,
    customerName: req.body.customerName,
    operatorId: req.body.operatorId,
    datetime: new Date(),
    callType: req.body.callType,
    timeOfCall: req.body.timeOfCall,
    callDuration: req.body.callDuration,
    recordingFile: req.body.recordingFile,
    purpose: req.body.purpose,
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
  var body = req.body;
  if (!ObjectID.isValid(id)) {
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




app.post('/subscriber', (req, res) => {
  var body = req.body;
  var subscriber = new Subscriber(body);
   
  subscriber.save().then(() => {
    return subscriber.generateAuthToken();
  }).then((token) => {
    // console.log(user)
    let sucess={
      'status':"sucess"
    }
    res.header('subsc-auth', token).send(sucess);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


app.get('/subscriber/me', SubAuthenticate, (req, res) => {
  res.send(req.subscriber);
});

/**
 * 
 * Login User
 * 
 */
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['phone', 'password']);

  User.findByCredentials(body.phone, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('user-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send({ message: 'User is invalid'});
  });
});





app.post('/subscriber/login', (req, res) => {
  var body = _.pick(req.body, ['mobile_number', 'password']);

  Subscriber.findByCredentials(body.mobile_number, body.password).then((subscriber) => {
    return subscriber.generateAuthToken().then((token) => {
      res.header('user-auth', token).send(subscriber);
    });
  }).catch((e) => {
    res.status(404).send();
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
