var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
const _ = require('lodash');

var {SubAuthenticate} = require('../subAuthenticate');
var Subscriber=mongoose.model('Subscriber');



router.post('/subscriber', (req, res) => {
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
  
  
  
  router.get('/subscriber/me', SubAuthenticate, (req, res) => {
    res.send(req.subscriber);
  });
  
  
  
  
  
  
  router.post('/subscriber/login', (req, res) => {
    console.log("**** Subscriber Post *****\n\n");
    console.log(req.body)
    var body = _.pick(req.body, ['mobileNumber', 'password']);
  
    Subscriber.findByCredentials(body.mobileNumber, body.password).then((subscriber) => {
      return subscriber.generateAuthToken().then((token) => {
        res.header('subsc-auth', token).send(subscriber);
      });
    }).catch((e) => {
      res.status(200).send({"message":"invalid Subscriber"});
    });
  });

module.exports = router;
  
  