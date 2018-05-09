var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

const {ObjectID} = require('mongodb');

var {authenticate} = require('../authenticate');
var Customer=mongoose.model('Customer');
var Appointment = mongoose.model('Appointment');
var Enquiry=mongoose.model('enquiry');
var Walkins = mongoose.model('Walkins');
var moment = require('moment');
var {SubAuthenticate} = require('../subAuthenticate');
var Customer=mongoose.model('Customer');


var async = require('async');

// var Call_logs=mongoose.model('Call_logs');


router.get('/v1/appointments', authenticate, (req, res) => {
    Appointment.find({
      customerId: req.user._id
    }).then((appointment) => {
      console.log("**** Appointment ***\n\n");
      appointment.appointmentTime=moment(appointment.appointmentTime).unix();
      if(appointment[0]==undefined||appointment[0]==null){
        res.send({'statusCode':2,'message':'No data Availbale'});
      }
      else{
        res.send({'statusCode':0,'type':'appointment','data':appointment});
      }
    }, (e) => {
      res.status(400).send(e);
    });
  });
  
  router.get('/v1/todaysAppointments', authenticate, (req, res) => {
    var start = moment().startOf('day').unix(); // set to 12:00 am today
    var end = moment().endOf('day').unix(); // set to 23:59 pm today
    Appointment.find({
      $and :[ { appointmentTime: {$gte: start, $lt: end }},{ customerId: req.user._id }]
      }).then((appointment) => {
        console.log("TOdays Appointment \n\n\n");
        console.log(appointment);
        if(appointment.length>=1){
          res.send({'statusCode':0,'type':'appointment','data':appointment});
        }
        else{
          res.send({'statusCode':2,'message':'Sorry no appointment available today'});
        }
    }, (e) => {
      res.status(400).send(e);
    });
  });

  

  router.get('/v1/todaysReports', SubAuthenticate, (req, res) => {
    var start = moment().startOf('day').unix(); // set to 12:00 am today
    var end = moment().endOf('day').unix(); // set to 23:59 pm today

    var startDate = moment().startOf('day'); // set to 12:00 am today
    var endDate = moment().endOf('day'); // set to 23:59 pm today
    
    Appointment.find({
      $and :[ { appointmentTime: {$gte: start, $lt: end }},{ subscriberId: req.subscriber._id }]
      }).then((appointment) => {
        console.log("Todays Appointment \n\n\n");
        console.log(appointment);

        Walkins.find({
          $and :[ { timeStamp: {$gte: start, $lt: end }},{ subscriberId:  req.subscriber._id }]
          }).then((walkins) => {
              var totalWalkins=walkins.length;
              console.log(totalWalkins);

            Customer.find({
              $and :[ { createdTime: {$gte: startDate, $lt: endDate }},{ subscriberId:  req.subscriber._id }]
              }).then((customer) => {
                console.log(customer);
                var data={
                  'totalWalkins':totalWalkins,
                  'appointment':appointment,
                  'customer':customer
                }
                res.send(data);
              }, (e) => {
                res.status(400).send(e);
              });


          }, (e) => {
            res.status(400).send(e);
          });


        // if(appointment.length>=1){
        //   res.send({appointment});
        // }
        // else{
        //   res.send({'message':'Sorry no appointment available today'});
        // }

    }, (e) => {
      res.status(400).send(e);
    });
  });



  router.get('/v1/todaysReportsForOperator', authenticate , (req, res) => {
    var start = moment().startOf('day').unix(); // set to 12:00 am today
    var end = moment().endOf('day').unix(); // set to 23:59 pm today
    var startDate = moment().startOf('day'); // set to 12:00 am today
    var endDate = moment().endOf('day'); // set to 23:59 pm today
    
    Appointment.find({
      $and :[ { appointmentTime: {$gte: start, $lt: end }},{ customerId: req.user._id }]
      }).then((appointment) => {
        console.log("Todays Appointment \n\n\n");
        console.log(appointment);

        Walkins.find({
          $and :[ { timeStamp: {$gte: start, $lt: end }},{ customerId:  req.user._id }]
          }).then((walkins) => {
              var totalWalkins=walkins.length;
              console.log(totalWalkins);

            Customer.find({
              $and :[ { createdTime: {$gte: startDate, $lt: endDate }},{ _creator:  req.user._id }]
              }).then((customer) => {
                console.log(customer);
                var data={
                  'totalWalkins':totalWalkins,
                  'appointment':appointment,
                  'customer':customer
                }
                res.send(data);
              }, (e) => {
                res.status(400).send(e);
              });


          }, (e) => {
            res.status(400).send(e);
          });


        // if(appointment.length>=1){
        //   res.send({appointment});
        // }
        // else{
        //   res.send({'message':'Sorry no appointment available today'});
        // }

    }, (e) => {
      res.status(400).send(e);
    });
  });





  router.get('/v1/reports/:fromDate/:toDate', SubAuthenticate, (req, res) => {
    // var start = new Date(req.params.fromDate * 1000).toISOString(); // set to 12:00 am today
    // var end = new Date(req.params.toDate * 1000).toISOString(); // set to 23:59 pm today

    var start = moment.unix(req.params.fromDate); 
    var end = moment.unix(req.params.toDate);

    console.log("inside report dates");
    console.log(start);
    console.log(end);
    var startDate = moment().startOf('day'); // set to 12:00 am today
    var endDate = moment().endOf('day'); // set to 23:59 pm today
    
    Appointment.find({
      $and :[ { appointmentTime: {$gte: req.params.fromDate, $lt: req.params.toDate }},{ subscriberId: req.subscriber._id }]
      }).then((appointment) => {
        console.log("***** Appointment Between Dates ******\n\n\n");
        // console.log(appointment);

        Walkins.find({
          $and :[ { timeStamp: {$gte: req.params.fromDate, $lt: req.params.toDate }},{ subscriberId:  req.subscriber._id }]
          }).then((walkins) => {
              var totalWalkins=walkins.length;
              // console.log(totalWalkins);

            Customer.find({
              $and :[ { createdTime: {$gte: start, $lt: end }},{ subscriberId:  req.subscriber._id }]
              }).then((customer) => {
                // console.log(customer);
                var data={
                  'totalWalkins':totalWalkins,
                  'appointment':appointment,
                  'customer':customer
                }
                console.log(data);
                res.send(data);
              }, (e) => {
                res.status(400).send(e);
              });


          }, (e) => {
            res.status(400).send(e);
          });


        // if(appointment.length>=1){
        //   res.send({appointment});
        // }
        // else{
        //   res.send({'message':'Sorry no appointment available today'});
        // }

    }, (e) => {
      res.status(400).send(e);
    });
  });



  router.get('/v1/reportsForOperators/:fromDate/:toDate', authenticate, (req, res) => {
    // var start = new Date(req.params.fromDate * 1000).toISOString(); // set to 12:00 am today
    // var end = new Date(req.params.toDate * 1000).toISOString(); // set to 23:59 pm today

    var start = moment.unix(req.params.fromDate); 
    var end = moment.unix(req.params.toDate);

    console.log("inside report dates");
    console.log(start);
    console.log(end);
    var startDate = moment().startOf('day'); // set to 12:00 am today
    var endDate = moment().endOf('day'); // set to 23:59 pm today
    
    Appointment.find({
      $and :[ { appointmentTime: {$gte: req.params.fromDate, $lt: req.params.toDate }},{ customerId: req.user._id }]
      }).then((appointment) => {
        console.log("***** Appointment Between Dates ******\n\n\n");
        // console.log(appointment);

        Walkins.find({
          $and :[ { timeStamp: {$gte: req.params.fromDate, $lt: req.params.toDate }},{ customerId:  req.user._id }]
          }).then((walkins) => {
              var totalWalkins=walkins.length;
              // console.log(totalWalkins);

            Customer.find({
              $and :[ { createdTime: {$gte: start, $lt: end }},{ _creator:  req.user._id }]
              }).then((customer) => {
                // console.log(customer);
                var data={
                  'totalWalkins':totalWalkins,
                  'appointment':appointment,
                  'customer':customer
                }
                console.log(data);
                res.send(data);
              }, (e) => {
                res.status(400).send(e);
              });


          }, (e) => {
            res.status(400).send(e);
          });


        // if(appointment.length>=1){
        //   res.send({appointment});
        // }
        // else{
        //   res.send({'message':'Sorry no appointment available today'});
        // }

    }, (e) => {
      res.status(400).send(e);
    });
  });


  // router.get('/v1/reports/daily', authenticate, (req, res) => {
  //   var start = moment().startOf('day'); // set to 12:00 am today
  //   var end = moment().endOf('day'); // set to 23:59 pm today
  //   Appointment.find({
  //     $and :[ { appointmentTime: {$gte: start, $lt: end }},{ customerId: req.user._id }]
  //     }).then((appointment) => {
  //       console.log("TOdays Appointment \n\n\n");
  //       console.log(appointment);
  //       if(appointment.length>=1){
  //         res.send({appointment});
  //       }
  //       else{
  //         res.send({'message':'Sorry no appointment available today'});
          
  //       }
  //   }, (e) => {
  //     res.status(400).send(e);
  //   });
  // });

  router.get('/v1/futuresAppointments', authenticate, (req, res) => {
    var start = moment().startOf('day').unix(); // set to 12:00 am today
    var end = moment().endOf('day').unix(); // set to 23:59 pm today
    Appointment.find({
      $and :[ { appointmentTime: {$gte: start }},{ customerId: req.user._id }]
      }).then((appointment) => {
        console.log("TOdays Appointment \n\n\n");
        console.log(appointment);
        if(appointment.length>=1){
          // res.send({appointment});
          res.send({'statusCode':0,"type":"appointment","data":appointment});
        }
        else{
          res.send({'statusCode':2,'message':'Sorry no Future appointment available '});
        }
    }, (e) => {
      res.status(400).send(e);
    });
  });

  router.get('/v1/pastAppointments', authenticate, (req, res) => {
    var start = moment().startOf('day').unix(); // set to 12:00 am today
    var end = moment().endOf('day').unix(); // set to 23:59 pm today
    Appointment.find({
      $and :[ { appointmentTime: {$lt: start }},{ customerId: req.user._id }]
      }).then((appointment) => {
        console.log("TOdays Appointment \n\n\n");
        console.log(appointment);
        if(appointment.length>=1){
          // res.send({appointment});
          res.send({'statusCode':0,"type":"appointment","data":appointment});
        }
        else{
          res.send({'statusCode':2,'message':'Sorry no Past appointment available '});
        }
    }, (e) => {
      res.status(400).send(e);
    });
  });




  router.put('/v1/appointments/:id', authenticate, (req, res) => {
    console.log(" ***** Update Appointment ******\n\n");
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send({'Message':'please enter proper ID'});
    }
    console.log(id);
    var body = req.body;
    console.log(body);
    // body.appointmentTime=moment.unix(body.appointmentTime);
    body.dob=moment.unix(body.dob);
    Appointment.findOneAndUpdate({ _id: id}, {$set: body}, {new: true}).then((appiontment) => {
      console.log(appiontment);
      if (!appiontment) {
        return res.status(404).send();
      }
      // res.send({appiontment});
      res.send({'statusCode':0,'type':'appointment','message':'appointment updated sucessfully','data':appiontment});
    }).catch((e) => {
      // console.log(e);
      res.status(400).send();
    })
  });

  
  router.get('/v1/lastInteractions/:id', authenticate, (req, res) => {
    console.log(req.param.id);
    var id = req.params.id;
    console.log(typeof(id))
    // if (!(typeof(id)==='number')) {
    //   return res.status(404).send({'Message':'please enter valid Phone Number'});
    // }

    console.log(id);

    Appointment.findOne({$and :[ {phoneNumber:id },{ customerId: req.user._id }]
    }).sort({createdTime: -1}).then((appointment) => {
      console.log(appointment);
      console.log("***** lastInteraction Query *****\n\n");
      Enquiry.findOne({$and :[ {number:id },{ customerId: req.user._id }]
      }).sort({createdTime: -1}).exec(function(err, enquiry) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      // });
        else{
          Walkins.findOne({$and :[ {customerPhoneNumber:id },{ customerId: req.user._id }]
          }).sort({createdTime: -1}).exec(function(err, walkins) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }else{
              console.log("Appointment");
              if(appointment!=null && enquiry!=null && walkins!=null){
                console.log(walkins);
                console.log(enquiry);
                if(appointment.createdTime>enquiry.createdTime){
                  console.log("appointement is latest");
                  if(appointment.createdTime>walkins.createdTime){
                    res.send({'statusCode':0,"type":"appointment","data":appointment});
                  }
                  else{
                    res.send({'statusCode':0,"type":"walkins","data":walkins});
                  }
                }
                else{
                  if(enquiry.createdTime>walkins.createdTime){
                    res.send({'statusCode':0,"type":"enquiry","data":enquiry});
                  }
                  else{
                    res.send({'statusCode':0,"type":"walkins","data":walkins});
                  }
                }
              }
              else if(appointment!=null && enquiry!=null && walkins==null){
                if(appointment.createdTime>enquiry.createdTime){
                    res.send({'statusCode':0,"type":"appointment","data":appointment});
                }
                else{
                  res.send({'statusCode':0,"type":"enquiry","data":enquiry});
                }
              }
              else if(appointment!=null && enquiry==null && walkins!=null){
                if(appointment.createdTime>walkins.createdTime){
                  res.send({'statusCode':0,"type":"appointment","data":appointment});
                }
                else{
                  res.send({'statusCode':0,"type":"walkins","data":walkins});
                }
              }
              else if(appointment==null && enquiry!=null && walkins!=null){
                if(enquiry.createdTime>walkins.createdTime){
                  res.send({'statusCode':0,"type":"enquiry","data":enquiry});
                }
                else{
                  res.send({'statusCode':0,"type":"walkins","data":walkins});
                }
              }
              else if(appointment==null && enquiry!=null && walkins!=null){
                if(enquiry.createdTime>walkins.createdTime){
                  res.send({'statusCode':0,"type":"enquiry","data":enquiry});
                }
                else{
                  res.send({'statusCode':0,"type":"walkins","data":walkins});
                }
              }
              else if(appointment!=null && enquiry==null && walkins==null){
                res.send({'statusCode':0,"type":"appointment","data":appointment});
              }

              else if(appointment==null && enquiry==null && walkins!=null){
                // res.send({"type":"appointment","data":appointment});
                res.send({'statusCode':0,"type":"walkins","data":walkins});
                
              }
              else if(appointment!=null && enquiry==null && walkins==null){
                res.send({'statusCode':0,"type":"appointment","data":appointment});
              }
              else{
                res.send({'statusCode':0,'message':"Customer details not available"});
              }
            }
          });
          console.log(" interaction Enquiry \n");
          console.log(appointment);
          console.log(enquiry);
        }
      });
      // res.send({appointment});
    }, (e) => {
      res.status(400).send(e);
    });
  });
  

  


  router.post('/v1/appointments', authenticate, (req, res) => {
    console.log("****** Appointment Post ****\n\n");
    console.log(req.body);
    if(typeof(req.body)==='object'){
      var appiontment = new Appointment({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        dob: /* moment.unix( */req.body.dob,
        address: req.body.address,
        notes: req.body.notes,
        appointmentTime: /* moment.unix( */req.body.appointmentTime,
        interactionType: req.body.interactionType,
        customerId: req.user._id,
        subscriberId:req.user.subscriberId
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
                dob: /* moment.unix( */req.body.dob,
                address: req.body.address,
                _creator: req.user._id,
                subscriberId:req.user.subscriberId
              });
              console.log(customer);
              customer.save().then((customer) => {
                  console.log("Customer Saved");
                  res.send({'statusCode':0,'type':'appointment','data':doc});
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
                  res.send({'statusCode':0,'type':'appointment','message':'appointment added sucessfully','data':doc});
                }
              });
            }
          }
        });
      }, (e) => {
        res.status(400).send(e);
      });
    }
    else{
      // res.status(200).send({'Message':'please send  in proper formate '});
      res.send({'statusCode':1,'message':'Invalid input'});
      
    }
  });
  


module.exports = router;
