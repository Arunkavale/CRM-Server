var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
const _ = require('lodash');
var {SubAuthenticate} = require('../subAuthenticate');
var Appointment = mongoose.model('Appointment');
var {authenticate} = require('../authenticate');

var Services=mongoose.model('services');
var moment = require('moment');
const {ObjectID} = require('mongodb');



router.post('/v1/services', SubAuthenticate, (req, res) => {
    console.log("****** Services Post *****\n\n ");
    var body=req.body;
      Services.findOne({
        _creator: req.subscriber._id
      }).then((services) => {
        console.log(services);
        if(services === undefined || services === null  ){
          body.id =1
          var services = new Services({
            Services:body,
            _creator :req.subscriber._id
          });
          services.save().then((doc) => {
            res.send({'statusCode':0,'type':'services','message':'services Added sucessfully','data':doc.Services});
          }, (e) => {
            res.status(400).send(e);
          });
        }
        else{
          console.log("inside services else");
          body.id=services.Services.length+1;
          services.Services.push(body);
          services.save().then((doc) => {
            // res.send(doc.Services);
            res.send({'statusCode':0,'type':'services','message':'services Added sucessfully','data':doc.Services});
            
          }, (e) => {
            res.status(400).send(e);
          });
        }
      }, (e) => {
        res.status(400).send(e);
      });


      
    // }
    // else{
    //   res.send({"message":"data is invalid"});
    // }
   
  });
  
  
  router.get('/v1/services', authenticate, (req, res) => {
    console.log("****** Services Get *****\n\n ");
    Services.find({
      _creator: req.user.subscriberId
    }).then((services) => {
      // console.logser
      res.send({'statusCode':0,'type':'services','data':services[0]});
      // res.send(services[0]);
    }, (e) => {
      res.status(400).send(e);
    });
  });


  router.put('/v1/services/:id', SubAuthenticate, (req, res) => {
    console.log(" ***** Update Service ******\n\n");
    var id = req.params.id;
    var body = req.body;
    Services.findOne({ _creator: req.subscriber._id}).then((services) => {
      if (!services) {
        return res.status(404).send();
      }
      // body._id=new ObjectID();
      
      console.log("inside Service save");
      console.log(services.Services.length);
      console.log(services)
      for(var i=0;i<services.Services.length;i++){
        // console.log(services.Services[i]._id);
        console.log(id);
        if(services.Services[i].id==id){
          console.log("inside Service get if condition");
          console.log(services);
          services.Services[i]=body;
          services.Services[i].id=i+1;
          console.log(services.Services)
          var myQuery = {
            _creator: req.subscriber._id
          };
          var newData = {
            $set: {
              Services:services.Services,
              
            }
          };
          
          console.log(myQuery);
          console.log(newData);
          Services.update(myQuery,newData).then((doc) => {
            console.log("service saved");
            // res.send(doc);
            res.send({'statusCode':0,'type':'services','message':'Services updated sucessfully'});
            // break;
          }, (e) => {
            res.status(400).send(e);
          });
          break;
        }
        // else if(services.Services[i].id!=id){
        //   res.send({'Message':'sevrice not found'});
        // }
      }
  
      // res.send({services});
    }).catch((e) => {
      res.status(400).send();
    })
  });

  router.get('/v1/serviceAvailableTodays', SubAuthenticate, (req, res) => {
    console.log(" ***** Update Service ******\n\n");
    // var id = req;
    var start = moment().startOf('day'); // set to 12:00 am today
    var end = moment().endOf('day');
    var body = req.body;
    // console.log(body);
    Services.find({
      $and :[ { createdTime: {$gte: start, $lt: end }},{ _creator: req.subscriber._id }]
    }).then((todayServices) => {
      res.send({'statusCode':0,'type':'services','data':todayServices});
      // res.send({todayServices});
    }).catch((e) => {
      res.status(400).send();
    })
  });
  

  // router.put('/serviceAvailedToday/:id', SubAuthenticate, (req, res) => {
  //   console.log(" ***** Update Service ******\n\n");
  //   var id = req.params.id;
  //   var body = req.body;
  //   console.log(body);

  
  
  //   Services.findOneAndUpdate({ _creator: id}, {$set: body}, {new: true}).then((services) => {
  //     if (!services) {
  //       return res.status(404).send();
  //     }
  
  //     res.send({services});
  //   }).catch((e) => {
  //     res.status(400).send();
  //   })
  // });


module.exports = router;
