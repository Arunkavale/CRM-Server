// import { constants } from 'os';

var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var {authenticate} = require('../authenticate');
var Customer=mongoose.model('Customer');
var moment = require('moment');
var Appointment = mongoose.model('Appointment');
var Enquiry=mongoose.model('enquiry');
var Walkins = mongoose.model('Walkins');


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


  router.get('/v1/customerByNumber/:customerNumber', authenticate, (req, res) => {
    console.log("***** Get Customer by Number *****\n\n");
    var customerNumber = req.params.customerNumber;
    // if (!(typeof(customerNumber)==='number')) {
    //   // res.send({'statusCode':2,'message':'No data Availbale'});
    //   return res.status(404).send({'statusCode':1,'message':' Invalid phone number'});
    // }
    console.log(customerNumber);
    Customer.findOne({
        customerNumber: customerNumber,
      _creator: req.user._id
    }).then((customerByNumber) => {
      if (!customerByNumber) {
        return res.status(404).send();
      }
      // res.send({customerByNumber});
      res.send({'statusCode':0,'type':'Customer','data':customerByNumber});
    }).catch((e) => {
      res.status(400).send(e);
    });
  });



  router.post('/v1/customers', authenticate, (req, res) => {
    console.log("****** Customer Post *****\n\n ");
    console.log(req.body);
    Customer.find(
      {$and :[ { customerNumber: req.body.customerNumber},{ subscriberId: req.user.subscriberId }]}
      ).then((customer) => {
        console.log("**** INSide Customer Create *****\n\n\n");
        console.log(customer);
        if(customer[0]==undefined || customer[0]==null){
          var customer = new Customer({
            customerNumber: req.body.customerNumber,
            customerName: req.body.customerName,
            address: req.body.address,
            email: req.body.email,
            dob: /* moment.unix( */req.body.dob,
            _creator: req.user._id,
            subscriberId:req.user.subscriberId
            
          });
          customer.save().then((customer) => {
            // res.send(customer);
            res.send({'statusCode':0,'type':'appointment','message':'Customer Added sucessfully','data':customer});
            
          }, (e) => {
            res.status(400).send(e);
          });
        }else{
          // res.send({'Message':"Customer is Present for this Operatore"});
          res.send({'statusCode':0,'message':'Customer is Present for this Operatore'});
          
        }
      });
    });



   
  

  router.get('/v1/customerByName/:customerName', authenticate, (req, res) => {
    console.log("***** Get Customer by name *****\n\n");
    var customerName = req.params.customerName;
    console.log(customerName);
    Customer.findOne({
      customerName: customerName,
      _creator: req.user._id
    }).then((customerByName) => {
      if (!customerByName) {
        return res.status(404).send({'statusCode':2,'message':'Customer not found'});
      }
      // res.send({customerByName});
      res.send({'statusCode':0,'type':'Customer','data':customerByName});
    }).catch((e) => {
      res.status(400).send(e);
    });
  });


  router.get('/v1/customerInteractions/:phoneNumber', authenticate, (req, res) => {
    console.log("***** Get Customer by name *****\n\n");
    var phoneNumber = req.params.phoneNumber;
    var data={};
    // console.log(customerName);
    Appointment.find({
      phoneNumber: phoneNumber,
      customerId: req.user._id
    }).then((appointment) => {
      console.log("\t\t\t\t*****   Appointments *******\n\n\n");
      console.log(appointment);
      // appointment={
      //   "type" : "Appointment",
      //     "Data" : appointment
      // }
      // data[0]=appointment;

      data.appointment=appointment;
      if (!appointment) {
        return res.status(404).send();
      }
      Walkins.find({
        customerPhoneNumber: phoneNumber,
        customerId: req.user._id
      }).then((walkins) => {
        data.walkins=walkins;
        // walkins={
        //   "type" : "Walkins",
        //   "Data" : walkins
        // }
        // data[1]=walkins;
      console.log("\t\t\t\t*****   Walkins  *******\n\n\n");
        console.log(walkins);
        if (!walkins) {
          return res.status(404).send();
        }
        Enquiry.find({
          number: phoneNumber,
          customerId: req.user._id
        }).then((enquiry) => {

          data.enquiry=enquiry;
          // enquiry={
          //   "type" : "Enquiry",
          //   "Data" : Enquiry,
          // }
          // data[2]=enquiry;
        console.log("\t\t\t\t*****   Enquiry  *******\n\n\n");
        console.log(enquiry);
          
          if (!enquiry) {
            return res.status(404).send();
          }
          // res.json(data);
          res.send({'statusCode':0,'type':'Enquiry,Appointment,Walkins','data':data});
          
        }).catch((e) => {
          console.log(e);
          res.status(400).send(e);
        });
        // res.send({customerByName});
      }).catch((e) => {
        console.log(e);
        res.status(400).send(e);
      });
      // res.send({customerByName});
    }).catch((e) => {
      console.log(e);
      
      res.status(400).send(e);
    });
  });


router.get('/v1/customers', authenticate, (req, res) => {
    console.log("****** Customer Get *****\n\n ");
      
    Customer.find({
      _creator: req.user._id
    }).then((customer) => {
      // res.send({customer});
      res.send({'statusCode':0,'type':'customers','data':customer});
      
    }, (e) => {
      res.status(400).send(e);
    });
  });




module.exports = router;
