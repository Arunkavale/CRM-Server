var {Services} = require('../models/services-model');
const mongoose = require('mongoose');

var Subscriber=mongoose.model('Subscriber');


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
      res.status(401).send({'statusCode':2,"message":"Please Login with Subscriber"});
    });
  };
  
  module.exports = {SubAuthenticate};