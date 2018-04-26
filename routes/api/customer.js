// import { constants } from 'os';

var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var {authenticate} = require('../authenticate');
var Customer=mongoose.model('Customer');
var moment = require('moment');


// exports.addCustomer=function (customerNumber,customerName,dob,email,user){
//     console.log("***** Add Customer **** \n\n");

//     var customer = new Customer({
//         customerNumber: customerNumber,
//         customerName: customerName,
//         email: email,
//         dob: dob,
//         customerId: user
//       });
//       console.log(customer);
//       customer.save().then((doc) => {
//           console.log("Customer Saved")
//         res.send(saved);
//       }, (e) => {
//         res.status(400).send(e);
//       });
// }


  router.get('/getCustomerByNumber/:customerNumber', authenticate, (req, res) => {
    console.log("***** Get Customer by Number *****\n\n");
    var customerNumber = req.params.customerNumber;
    console.log(customerNumber);
    Customer.findOne({
        customerNumber: customerNumber,
      _creator: req.user._id
    }).then((customerByNumber) => {
      if (!customerByNumber) {
        return res.status(404).send();
      }
      res.send({customerByNumber});
    }).catch((e) => {
      res.status(400).send();
    });
  });



  router.post('/createCustomer', authenticate, (req, res) => {
    console.log("****** Customer Post *****\n\n ");
    console.log(req.body);
    
    var customer = new Customer({
      customerNumber: req.body.customerNumber,
      customerName: req.body.customerName,
      address: req.body.address,
      email: req.body.email,
      dob: moment.unix(req.body.dob),
      _creator: req.user._id
    });
    customer.save().then((customer) => {
      res.send(customer);
    }, (e) => {
      res.status(400).send(e);
    });
  });
  

  router.get('/getCustomerByName/:customerName', authenticate, (req, res) => {
    console.log("***** Get Customer by name *****\n\n");
    var customerName = req.params.customerName;
    console.log(customerName);
    Customer.findOne({
      customerName: customerName,
      _creator: req.user._id
    }).then((customerByName) => {
      if (!customerByName) {
        return res.status(404).send();
      }
      res.send({customerByName});
    }).catch((e) => {
      res.status(400).send();
    });
  });


router.get('/getCustomer', authenticate, (req, res) => {
    console.log("****** Customer Get *****\n\n ");
      
    Customer.find({
      _creator: req.user._id
    }).then((customer) => {
      res.send({customer});
    }, (e) => {
      res.status(400).send(e);
    });
  });




module.exports = router;
