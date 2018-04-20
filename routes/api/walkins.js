var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Walkins = mongoose.model('Walkins');

var {authenticate} = require('../authenticate');
// var Call_logs=mongoose.model('Call_logs');



router.post('/walkins', authenticate, (req, res) => {

    console.log("***** Walkins Post *****\n\n");
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
   
    walkins.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  });
  
  router.get('/getWalkins', authenticate, (req, res) => {
    Walkins.find({
      customerId: req.user._id
    }).then((walkins) => {
      res.send({walkins});
    }, (e) => {
      res.status(400).send(e);
    });
  });
  


module.exports = router;
