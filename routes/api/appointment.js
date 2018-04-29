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
  
  router.get('/getTodaysAppointment', authenticate, (req, res) => {

    var start = moment().startOf('day'); // set to 12:00 am today
    var end = moment().endOf('day'); // set to 23:59 pm today
    Appointment.find({
      $and :[ { appointmentTime: {$gte: start, $lt: end }},{ customerId: req.user._id }]
      }).then((appointment) => {
        console.log("TOdays Appointment \n\n\n");
        console.log(appointment);
        if(appointment.length>=1){
          res.send({appointment});
        }
        else{
          res.send({'message':'Sorry no appointment available today'});
          
        }
    }, (e) => {
      res.status(400).send(e);
    });
  });



  router.get('/getFuturesAppointment', authenticate, (req, res) => {

    var start = moment().startOf('day'); // set to 12:00 am today
    var end = moment().endOf('day'); // set to 23:59 pm today
    Appointment.find({
      $and :[ { appointmentTime: {$gte: start }},{ customerId: req.user._id }]
      }).then((appointment) => {
        console.log("TOdays Appointment \n\n\n");
        console.log(appointment);
        if(appointment.length>=1){
          res.send({appointment});
        }
        else{
          res.send({'message':'Sorry no Future appointment available '});
          
        }
    }, (e) => {
      res.status(400).send(e);
    });
  });



  router.put('/updateAppointment/:id', authenticate, (req, res) => {
    console.log(" ***** Update Appointment ******\n\n");
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send({'Message':'please enter proper ID'});
    }
    console.log(id);

    var body = req.body;
    console.log(body);
    body.appointmentTime=moment.unix(body.appointmentTime);
    body.dob=moment.unix(body.dob);
  
  
    Appointment.findOneAndUpdate({ _id: id}, {$set: body}, {new: true}).then((appiontment) => {
      console.log(appiontment);
      if (!appiontment) {
        return res.status(404).send();
      }
  
      res.send({appiontment});
    }).catch((e) => {
      console.log(e);
      res.status(400).send();
    })
  });

  
  router.get('/getLastInteraction/:id', authenticate, (req, res) => {
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
              if(appointment!=null||appointment!=undefined){
                if(appointment.createdTime>enquiry.createdTime){
                  console.log("appointement is latest");
                  if(appointment.createdTime>walkins.createdTime){
                    res.send({"type":"appointment","data":appointment});

                  }
                  else{
                    res.send({"type":"walkins","data":walkins});
                  }
                }
                else{
                  if(enquiry.createdTime>walkins.createdTime){
                    res.send({"type":"enquiry","data":enquiry});

                  }
                  else{
                    res.send({"type":"walkins","data":walkins});
                  }

                  console.log("Enquiry is latest");
                  // res.send({enquiry});
                }
              }else{
                res.send({'message':"Customer details not available"});
                
              }
            }
          });
          console.log(" interaction Enquiry \n");
          console.log(appointment);
          console.log(enquiry);

          
          // else{
          //   res.send({"message ":"customer data not found"});
          // }
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
    if(typeof(req.body)==='object'){

      var appiontment = new Appointment({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        dob: moment.unix(req.body.dob),
        address: req.body.address,
        notes: req.body.notes,
        appointmentTime: moment.unix(req.body.appointmentTime),
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
              console.log("customer present");
              // res.send(doc);
  
  
              var myQuery = {
                'customerNumber': req.body.phoneNumber
              };
              var newData = {
                $set: {
                  customerName: req.body.name,
                  email: req.body.email,
                  dob: moment.unix(req.body.dob),
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
    }
    else{
      res.status(200).send({'Message':'please send  in proper formate '});
    }
    
  });
  


module.exports = router;
