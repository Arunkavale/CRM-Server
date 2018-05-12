var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
const _ = require('lodash');

var {SubAuthenticate} = require('../subAuthenticate');
var Subscriber=mongoose.model('Subscriber');
var moment = require('moment');



router.post('/v1/subscribers', (req, res) => {
    var body = req.body;
    // body.dob=moment.unix(req.body.dob);
    
    var subscriber = new Subscriber(body);
    subscriber.save().then(() => {
      return subscriber.generateAuthToken();
    }).then((token) => {
      // console.log(user)
      let sucess={
        'statusCode':0,
        'message':'Subscriber Added Sucessfully'
      }
      res.header('subsc-auth', token).send(sucess);
    }).catch((e) => {
      // if(e.code==11000){
      //   res.status(400).send({'statusCode':2,'message':'Subscriber already available with same company name'});
      // }else{
        res.status(400).send({'statusCode':1,'Error':e.message});
      // }
    })
  });
  
  
  
  router.get('/v1/subscribers/me', SubAuthenticate, (req, res) => {
    // res.send(req.subscriber);
    res.status(200).send({'statusCode':0,'type':'subscribers',"data":req.subscriber});
    
  });
  
  
  router.post('/v1/subscribers/login', (req, res) => {
    console.log("**** Subscriber Post *****\n\n");
    console.log(req.body)
    var body = _.pick(req.body, ['mobileNumber', 'password']);
    Subscriber.findByCredentials(body.mobileNumber, body.password).then((subscriber) => {
      return subscriber.generateAuthToken().then((token) => {
        res.header('subsc-auth', token).send({'statusCode':0,
        'message':'Subscriber Logged In Sucessfully',
        'data':subscriber});
      });
    }).catch((e) => {
      res.status(200).send({'statusCode':2,"message":"invalid Subscriber"});
    });
  });

module.exports = router;
  
  