var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var {authenticate} = require('../authenticate');
var Enquiry=mongoose.model('enquiry');
var Customer=mongoose.model('Customer');

var moment = require('moment');



router.post('/v1/enquirys', authenticate, (req, res) => {
    var enquiry = new Enquiry({
      name: req.body.name,
      number: req.body.number,
      email: req.body.email,
      dob: /* moment.unix( */req.body.dob,
      address: req.body.address,
      notes: req.body.notes,
      interactionType: req.body.interactionType,
      enquiryTime: /* moment.unix( */req.body.enquiryTime,
      customerId: req.user._id,
      subscriberId:req.user.subscriberId
      
    });
    console.log("******// Configuration //******");
    // console.log(walkins);
    enquiry.save().then((doc) => {
      Customer.find({$and :[ { customerNumber: req.body.customerNumber},{ _creator: req.user._id }]}).exec(function (err, customer) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          console.log(customer);
          if(customer[0]==undefined||customer[0]==null||customer[0]==''){
            console.log("customer not present");
            var customer = new Customer({
              customerNumber: req.body.number,
              customerName: req.body.name,
              email: req.body.email,
              dob: /* moment.unix( */req.body.dob,
              address: req.body.address,
              _creator: req.user._id,
              subscriberId:req.user.subscriberId
            });
            console.log(customer);
            customer.save().then((customer) => {
                console.log("Customer Saved");
              // res.send(saved); 
              // res.send(doc);
              res.send({'statusCode':0,'type':'enquiry','message':'enquiry Added sucessfully','data':doc});
              
              
            }, (e) => {
              res.status(400).send(e);
            });
          }
          else{
            console.log("customer present");
            // res.send(doc);


            var myQuery = {
              'customerNumber': req.body.number
            };
            var newData = {
              $set: {
                customerName: req.body.name,
                email: req.body.email,
                dob: /* moment.unix( */req.body.dob,
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
                // res.json(doc);
                res.send({'statusCode':0,'type':'enquiry','message':'enquiry Added sucessfully','data':doc});
                
              }
            });
          }
        }
      });

      // var saved=[{ "status": "success" }]
      // res.send(saved);
    }, (e) => {
      res.status(400).send(e);
    });
  });
  


module.exports = router;
