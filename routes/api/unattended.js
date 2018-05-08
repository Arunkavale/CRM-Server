var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var {authenticate} = require('../authenticate');
var UnattendedCalls=mongoose.model('unattendedCalls');
var moment = require('moment');




router.post('/v1/unattendedCalls', authenticate, (req, res) => {
  console.log("***** Untattended Calls Post *****\n\n");
  console.log(req.body);
    var unattendedCalls = new UnattendedCalls({
      number: req.body.number,
      missedcalltime: /* moment.unix( */req.body.missedcalltime,
      createdTime: new Date().getTime(),
      customerId: req.user._id,
      subscriberId:req.user.subscriberId
    });
    unattendedCalls.save().then((doc) => {
      var saved=[{ "status": "success" }]
      // res.send(saved);
      res.send({'statusCode':0,'type':'unattendedCalls','message':'unattendedCalls Added sucessfully','data':doc});
    }, (e) => {
      res.status(400).send(e);
    });
  });
  
  
  router.get('/v1/unattendedCalls', authenticate, (req, res) => {
    console.log("******  Unatteded Calls Get ****\n\n");
    UnattendedCalls.find({
      customerId: req.user._id
    }).then((unattendedCalls) => {
      // res.send({unattendedCalls});
      res.send({'statusCode':0,'type':'unattendedCalls','data':unattendedCalls});
      
    }, (e) => {
      res.status(400).send(e);
    });
  });
  
  
  router.delete('/v1/unattendedCalls/:id', authenticate, (req, res) => {
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
        return res.status(404).send({'statusCode':2,'type':'unattendedCalls','message':'data not available '});
      }
      var deleted=[{ "status": "success" }]
      // res.send({deleted});
      res.send({'statusCode':0,'type':'unattendedCalls','message':'Deleted Sucessfully'});
    }).catch((e) => {
      res.status(400).send();
    });
  });
module.exports = router;
