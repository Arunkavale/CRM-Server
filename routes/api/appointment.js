var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Appointment = mongoose.model('Appointment');

var {authenticate} = require('../authenticate');
var Customer=mongoose.model('Customer');
var Enquiry=mongoose.model('enquiry');


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
  

  
  router.get('/getLastInteraction', authenticate, (req, res) => {
    Appointment.findOne({
      customerId: req.user._id
    }).sort({createdTime: -1}).then((appointment) => {
      console.log("***** lastInteraction Query *****\n\n");
      Enquiry.findOne({customerId: req.user._id}).sort({createdTime: -1}).exec(function(err, enquiry) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        else{
          console.log(" interaction Enquiry \n");
          if(appointment.createdTime>enquiry.createdTime){
            console.log("appointement is latest");
            res.send({appointment});
          }
          else{
            console.log("Enquiry is latest");
            
            res.send({enquiry});
            
          }
        }
      });
      // res.send({appointment});
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

      Customer.find({customerNumber : req.body.phoneNumber}).exec(function (err, customer) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          console.log(customer);
          if(customer[0]==undefined||customer[0]==null||customer[0]==''){
            console.log("customer not present");
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
              res.send(doc);
              
            }, (e) => {
              res.status(400).send(e);
            });
          }
          else{
            console.log("customer present");
            // res.send(doc);


            var myQuery = {
              'customerNumber': req.body.phoneNumber
            };
            var newData = {
              $set: {
                customerName: req.body.name,
                email: req.body.email,
                dob: req.body.dob,
                address: req.body.address,
              }
            };
            
            console.log(customer);
            Customer.update(myQuery, newData).exec(function (err, data) {
              if (err) {
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {
                res.json(doc);
              }
            });
          }
        }
      });
    }, (e) => {
      res.status(400).send(e);
    });
  });
  


module.exports = router;
