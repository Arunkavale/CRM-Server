var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var {authenticate} = require('../authenticate');
var Enquiry=mongoose.model('enquiry');
var Customer=mongoose.model('Customer');




router.post('/enquiry', authenticate, (req, res) => {
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


      var customer = new Customer({
        customerNumber: req.body.number,
        customerName: req.body.name,
        email: req.body.email,
        dob: req.body.dob,
        address: req.body.address,
        _creator: req.user._id
      });
      console.log(customer);
      customer.save().then((customer) => {
          console.log("Customer Saved");
        // res.send(saved); 
        // res.send(doc);
        var saved=[{ "status": "success" }]
        res.send(saved);
        
      }, (e) => {
        res.status(400).send(e);
      });




      // var saved=[{ "status": "success" }]
      // res.send(saved);
    }, (e) => {
      res.status(400).send(e);
    });
  });
  


module.exports = router;
