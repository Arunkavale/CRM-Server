    var router = require('express').Router();
    var mongoose = require('mongoose');
    var User = mongoose.model('User');
    const _ = require('lodash');
    

    var {authenticate} = require('../authenticate');
    // var Call_logs=mongoose.model('Call_logs');
    


    router.get('/users/me', authenticate, (req, res) => {
        res.send(req.user);
    });
  

    router.post('/users', (req, res) => {
        console.log("**** User Post *****\n\n");
        console.log(req.body);
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

    router.post('/users/login', (req, res) => {
        var body = _.pick(req.body, ['phone', 'password']);
    
        User.findByCredentials(body.phone, body.password).then((user) => {
            return user.generateAuthToken().then((token) => {
                res.header('user-auth', token).send(user);
        });
        }).catch((e) => {
            res.status(200).send({ message: 'User is invalid'});
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
    
  
  
  
  