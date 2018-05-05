    var router = require('express').Router();
    var mongoose = require('mongoose');
    var User = mongoose.model('User');
    const _ = require('lodash');
    var moment = require('moment');
        
    var {SubAuthenticate} = require('../subAuthenticate');
    var Subscriber=mongoose.model('Subscriber');

    var {authenticate} = require('../authenticate');
    // var Call_logs=mongoose.model('Call_logs');
    


    router.get('/users/me', authenticate, (req, res) => {
        res.send(req.user);
    });
  

    router.get('/users', SubAuthenticate, (req, res) => {

        User.find( {
            subscriberId: req.subscriber._id}
        ).then((operators) => {
            res.send({operators});
          }, (e) => {
            res.status(400).send(e);
          });
        // res.send(req.user);
    });

    router.post('/users',SubAuthenticate, (req, res) => {
        console.log("**** User Post *****\n\n");
        console.log(req.body);
        var body = req.body;
        body.dob=moment.unix(body.dob);
        body.subscriberId=req.subscriber._id;
        var user = new  User(body);
        user.save().then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            res./* header('user-auth', token). */send({'Message':"user Added Sucessfully"});
        }).catch((e) => {
            res.status(400).send(e);
        })
    });

    router.post('/users/login', (req, res) => {
        var body = _.pick(req.body, ['phone', 'password']);
    
        User.findByCredentials(body.phone, body.password).then((user) => {
            return user.generateAuthToken().then((token) => {
                res.header('user-auth', token).send(user);
        });
        }).catch((e) => {
            res.status(200).send({  "status": "error",
            "errorCode":1001,
            "message": "User is invalid"});
        });
    });


    router.delete('/users/me/token', authenticate, (req, res) => {
        req.user.removeToken(req.token).then(() => {
          res.status(200).send();
        }, () => {
          res.status(400).send();
        });
      });
      
    module.exports = router;
    
  
  
  
  