var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
const _ = require('lodash');
var {SubAuthenticate} = require('../subAuthenticate');
var Services=mongoose.model('services');
var moment = require('moment');
const {ObjectID} = require('mongodb');



router.post('/createServices', SubAuthenticate, (req, res) => {
    console.log("****** Services Post *****\n\n ");
    // console.log(req.body);
    
    var body=req.body;

    
    // console.log(services)
    // if(body.has("categoryName")&&body.has("services")){

      Services.findOne({
        _creator: req.subscriber._id
      }).then((services) => {
        console.log(services);
        if(services === undefined || services === null  ){
          // body._id=new ObjectID();
          body.id =1
          
          var services = new Services({
            Services:body,
            // Services._id:new ObjectID(),
            
            _creator :req.subscriber._id

          });
          services.save().then((doc) => {
            res.send(doc.Services);
          }, (e) => {
            res.status(400).send(e);
          });
        }
        else{
          console.log("inside services else");
          body.id=services.Services.length+1;
          services.Services.push(body);
          services.save().then((doc) => {
            res.send(doc.Services);
          }, (e) => {
            res.status(400).send(e);
          });

          // res.send({"message" : "services already available for this subscriber"});
        }
        // res.send({services});
      }, (e) => {
        res.status(400).send(e);
      });


      
    // }
    // else{
    //   res.send({"message":"data is invalid"});
    // }
   
  });
  
  
  router.get('/getService', SubAuthenticate, (req, res) => {
    console.log("****** Services Get *****\n\n ");
      
    Services.find({
      _creator: req.subscriber._id
    }).then((services) => {
      // console.logser
      res.send(services[0]);
    }, (e) => {
      res.status(400).send(e);
    });
  });


  router.put('/updateService/:id', SubAuthenticate, (req, res) => {
    console.log(" ***** Update Service ******\n\n");
    var id = req.params.id;
    var body = req.body;

    console.log(body);

  
    console.log(id);
  
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
          // ser
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
            res.send(doc);
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

  router.get('/getServiceAvailToday', SubAuthenticate, (req, res) => {
    console.log(" ***** Update Service ******\n\n");
    // var id = req;
    var start = moment().startOf('day'); // set to 12:00 am today
    var end = moment().endOf('day');
    var body = req.body;
    // console.log(body);

  
    Services.find({
      $and :[ { createdTime: {$gte: start, $lt: end }},{ _creator: req.subscriber._id }]
    }).then((todayServices) => {
      res.send({todayServices});
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
