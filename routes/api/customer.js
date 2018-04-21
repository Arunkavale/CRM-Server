// import { constants } from 'os';

var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var {authenticate} = require('../authenticate');
var Customer=mongoose.model('Customer');

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
