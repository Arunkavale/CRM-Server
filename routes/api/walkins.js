var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Walkins = mongoose.model('Walkins');
var Customer=mongoose.model('Customer');
var moment = require('moment');
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
      timeStamp: moment.unix(req.body.timeStamp),
      createdDate:new Date(),
      order:req.body.order, /* [{
        orderList:{
          serviceId1:req.body.order[0].serviceId1,
          serviceId3:req.body.serviceId3
        },
      grandTotal: req.body.grandTotal,
        
      }], */
      customerId: req.user._id
    });
   
    walkins.save().then((doc) => {
      console.log("walkin save");
      var timeStamp=Date.parse(doc.timeStamp);
      console.log(timeStamp);
      doc.timeStamp=timeStamp;
      
      console.log(doc.timeStamp);
      console.log(doc);
      Customer.find({customerNumber : req.body.customerPhoneNumber}).exec(function (err, customer) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          console.log(customer);
          if(customer[0]==undefined||customer[0]==null||customer[0]==''){
            console.log("customer not present");
            var customer = new Customer({
              customerNumber: req.body.customerPhoneNumber,
              customerName: req.body.customerName,
              email: req.body.email,
              dob: moment.unix(req.body.dob),
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
            doc.timeStamp=timeStamp;
            console.log("customer present");
            console.log(doc);
            res.send(doc);

           
            
          }
        }
      });

      
      // res.send(doc);
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
  

  router.get('/getStats', authenticate, (req, res) => {
    var start = moment().startOf('day'); // set to 12:00 am today
    var end = moment().endOf('day'); // set to 23:59 pm today
    console.log("****** Get Stats  *****\n\n ");
      
    Walkins.find({
    $and :[ { createdDate: {$gte: start, $lt: end }},{ customerId: req.user._id }]
    }).then((customer) => {
      var noOfCustomer=customer.length,orders,grandTotal=0;

      console.log(customer.length);
      for(let i=0;i<customer.length;i++){
        // console.log(customer[i].order[0].grandTotal);
        // console.log(grandTotal);
        grandTotal=Number(customer[i].order[0].grandTotal)+Number(grandTotal);
      }
      console.log(grandTotal);
      var stats={
        numberOfCustomer:noOfCustomer,
        grandTotal:grandTotal,
      }
      res.send({/* customer, */stats});
    }, (e) => {
      res.status(400).send(e);
    });
  });
  
  

  router.get('/getStatsInTwoDays/:date1/:date2', authenticate, (req, res) => {
    console.log("***** get Stats in two dates");
    var startDate=req.params.date1;
    var endDate=req.params.date2;
    console.log(req.params);

    var start = moment.unix(startDate); // set to 12:00 am today
    var end = moment.unix(endDate); // set to 23:59 pm today
    console.log("****** Get Stats  *****\n\n ");
      
    Walkins.find({
    $and :[ { createdDate: {$gte: start, $lt: end }},{ customerId: req.user._id }]
    }).then((customer) => {
      var noOfCustomer=customer.length,orders,grandTotal=0;

      console.log(customer.length);
      for(let i=0;i<customer.length;i++){
        // console.log(customer[i].order[0].grandTotal);
        // console.log(grandTotal);
        grandTotal=Number(customer[i].order[0].grandTotal)+Number(grandTotal);
      }
      console.log(grandTotal);
      var stats={
        numberOfCustomer:noOfCustomer,
        grandTotal:grandTotal,
      }
      res.send({/* customer, */stats});
    }, (e) => {
      res.status(400).send(e);
    });
  });
  
  


module.exports = router;