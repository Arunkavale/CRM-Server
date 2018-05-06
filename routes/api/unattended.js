var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var {authenticate} = require('../authenticate');
var UnattendedCalls=mongoose.model('unattendedCalls');
var moment = require('moment');




router.post('/unattendedCalls', authenticate, (req, res) => {
  console.log("***** Untattended Calls Post *****\n\n");
  console.log(req.body);
    var unattendedCalls = new UnattendedCalls({
      number: req.body.number,
      missedcalltime: moment.unix(req.body.missedcalltime),
      createdTime: new Date(),
      customerId: req.user._id,
      subscriberId:req.user.subscriberId
    });
    unattendedCalls.save().then((doc) => {
      var saved=[{ "status": "success" }]
      res.send(saved);
    }, (e) => {
      res.status(400).send(e);
    });
  });
  
  
  router.get('/unattendedCalls', authenticate, (req, res) => {
    console.log("******  Unatteded Calls Get ****\n\n");
    UnattendedCalls.find({
      customerId: req.user._id
    }).then((unattendedCalls) => {
      res.send({unattendedCalls});
    }, (e) => {
      res.status(400).send(e);
    });
  });
  
  
  router.delete('/unattendedCalls/:id', authenticate, (req, res) => {
    console.log("****** Unatteded Calls Delete *****\n\n");
    
    console.log(req.param.id);
    var id = req.params.id;

    console.log(id);
    // if (!ObjectID.isValid(id)) {
    //   return res.status(404).send();
    // }
  
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
  

module.exports = router;
