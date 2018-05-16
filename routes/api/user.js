    var router = require('express').Router();
    var mongoose = require('mongoose');
    var User = mongoose.model('User');
    const _ = require('lodash');
    var moment = require('moment');
        
    var {SubAuthenticate} = require('../subAuthenticate');
    var Subscriber=mongoose.model('Subscriber');

    var {authenticate} = require('../authenticate');
    // var Call_logs=mongoose.model('Call_logs');
    


    router.get('/v1/users/me', authenticate, (req, res) => {
        res.send({'statusCode':1,'data':req.user});
    });
  

    router.get('/v1/operators', SubAuthenticate, (req, res) => {
        User.find( {
            subscriberId: req.subscriber._id}
        ).then((operators) => {
            res.send({'statusCode':0,'type':'Operators','data':operators});
          }, (e) => {
            res.status(400).send(e);
          });
        // res.send(req.user);
    });

    router.post('/v1/users',SubAuthenticate, (req, res) => {
        console.log("\n\n\t\t\t\t\t#####****    User Post    *****#####\n\n");
        console.log(req.body);
        console.log("\n\n");
        var body = req.body;
        // body.dob=moment.unix(body.dob);
        body.subscriberId=req.subscriber._id;
        var user = new  User(body);
        user.save().then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            res./* header('user-auth', token). */send({ 'statusCode':0,
            'message':'User Added Sucessfully'});
        }).catch((e) => {
           
            var keysOfObject=Object.keys(e.errors);
            console.log(keysOfObject)
            console.log(e);
            // console.log(errorObject);
            console.log();
            // var error=JSON.parse(errorObject);
            // console.log(e.errors.phone.message);
                res.status(400).send({ 'statusCode':1,
                'message':e['errors'][keysOfObject[0]].message});
              
        })
    });

    router.post('/v1/users/login', (req, res) => {
        var body = _.pick(req.body, ['phone', 'password']);
        User.findByCredentials(body.phone, body.password).then((user) => {
            return user.generateAuthToken().then((token) => {
                res.header('user-auth', token).send({'statusCode':0,
                'message':'User Logged In Sucessfully',
                'data':user});
        });
        }).catch((e) => {
            res.status(200).send({  "statusCode": 2,
            "message": "User is invalid"});
        });
    });


    router.delete('/v1/users/me/token', authenticate, (req, res) => {
        req.user.removeToken(req.token).then(() => {
          res.status(200).send();
        }, () => {
          res.status(400).send();
        });
      });
      
    module.exports = router;
    
  
  
  
  