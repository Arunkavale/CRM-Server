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
          // body.id =1
          var services = new Services({
            Services:body,
            _creator :req.subscriber._id
          });
          services.save().then((doc) => {
            res.send({'statusCode':0,'message':'services Added sucessfully','data':doc.Services});
          }, (e) => {
            res.status(400).send({ 'statusCode':1,
            'Error':e.message});
          });
        }
        else{
          console.log("inside services else");
          // body.id=services.Services.length+1;
          services.Services.push(body);
          services.save().then((doc) => {
            // res.send(doc.Services);
            res.send({'statusCode':0,'message':'services Added sucessfully','data':doc.Services});
            
          }, (e) => {
            res.status(400).send({ 'statusCode':1,
            'Error':e.message});
          });
        }
      }, (e) => {
        res.status(400).send({ 'statusCode':1,
        'Error':e.message});
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
    }).then((data) => {
      // console.logser

      var ServiceData={
        '_id':data[0]._id,
        'statusCode':0,'message':'services',
        'data':data[0].Services
      }
      // var data={
      //   'statusCode':0,'message':'services','data':services[0].Services
      // };
      // data.data._id=services[0]._id;
      res.send( /* {'statusCode':0,'message':'services','data':ServiceData} */ServiceData );
      // res.send(services[0]);
    }, (e) => {
      res.status(400).send({ 'statusCode':1,
      'Error':e.message});
    });
  });


  // router.delete('/v1/services/:id', (req, res) => {
  //   var id1 = req.params.id;
  
  //   if (!ObjectID.isValid(id1)) {
  //     return res.status(404).send();
  //   }
  //   Services.findByIdAndRemove(id1).then((todo) => {
  //     if (!todo) {
  //       return res.status(404).send();
  //     }
  //     res.send({todo});
  //   }).catch((e) => {
  //     res.status(400).send();
  //   });
  // });
  // router.get('/v1/services2', SubAuthenticate, (req, res) => {
  //   console.log("****** Services Get *****\n\n ");
  //   Services.find({
  //     _creator: req.subscriber.subscriberId
  //   }).then((services) => {
  //     // console.logser
  //     res.send({'statusCode':0,'message':'services','data':services[0].Services});
  //     // res.send(services[0]);
  //   }, (e) => {
  //     res.status(400).send({ 'statusCode':1,
  //     'Error':e.message});
  //   });
  // });

  router.put('/v1/services', SubAuthenticate, (req, res) => {
    console.log(" ***** Update Service ******\n\n");
    var id = req.params.id;
    var body = req.body;
    Services.findOne({ _creator: req.subscriber._id}).then((services) => {
      if (!services) {
        return res.status(404).send();
      }
      // body._id=new ObjectID();
      
      console.log("inside Service save");
      // console.log(services.Services.length);
      // console.log(services)
      // for(var i=0;i<services.Services.length;i++){
        // console.log(services.Services[i]._id);
        // console.log(id);
        // if(services.Services[i].id==id){
          console.log("inside Service get if condition");
          // console.log(services);
          services.Services=body;
          // services.Services[i].id=i+1;
          // console.log(services.Services)
          var myQuery = {
            _creator: req.subscriber._id
          };
          var newData = {
            $set: {
              Services:services.Services,
            }
          };
          console.log("   **** inside Servces *****\n\n\n");
          console.log(services);
          console.log(myQuery);
          console.log(newData);
          Services.update(myQuery,newData).then((doc) => {
            console.log("service saved");
            // res.send(doc);
            res.send({'statusCode':0,'message':'Services updated sucessfully'});
            // break;
          }, (e) => {
            res.status(400).send({ 'statusCode':1,
            'Error':e.message});
          });
          // break;
        // }
        // else if(services.Services[i].id!=id){
        //   res.send({'Message':'sevrice not found'});
        // }
      // }
  
      // res.send({services});
    }).catch((e) => {
      res.status(400).send({ 'statusCode':1,
      'Error':e.message});
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
      res.send({'statusCode':0,'message':'services','data':todayServices});
      // res.send({todayServices});
    }).catch((e) => {
      res.status(400).send({ 'statusCode':1,
      'Error':e.message});
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
