var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Appointment = mongoose.model('Appointment');

var {authenticate} = require('../authenticate');
var Customer=mongoose.model('Customer');

// var Call_logs=mongoose.model('Call_logs');


router.get('/getAppointment', authenticate, (req, res) => {
    Appointment.find({
      customerId: req.user._id
    }).then((appointment) => {
      res.send({appointment});
    }, (e) => {
      res.status(400).send(e);
    });
  });
  


  router.post('/appointment', authenticate, (req, res) => {
    console.log("****** Appointment Post ****\n\n");
    console.log(req.body);
    var appiontment = new Appointment({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      dob: req.body.dob,
      address: req.body.address,
      notes: req.body.notes,
      appointmentTime:req.body.appointmentTime,
      interactionType: req.body.interactionType,
      customerId: req.user._id
    });
    appiontment.save().then((doc) => {



      var customer = new Customer({
        customerNumber: req.body.phoneNumber,
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



     
    }, (e) => {
      res.status(400).send(e);
    });
  });
  


module.exports = router;
