var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
const _ = require('lodash');
var {SubAuthenticate} = require('../subAuthenticate');
var Services=mongoose.model('services');




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
          var services = new Services(body);
          services._creator = req.subscriber._id
          services.save().then((doc) => {
            res.send(doc);
          }, (e) => {
            res.status(400).send(e);
          });
        }
        else{
          res.send({"message" : "services already available for this subscriber"});
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
      res.send({services});
    }, (e) => {
      res.status(400).send(e);
    });
  });


  router.put('/updateService/:id', SubAuthenticate, (req, res) => {
    console.log(" ***** Update Service ******\n\n");
    var id = req.params.id;
    var body = req.body;
    console.log(body);

  
  
    Services.findOneAndUpdate({ _creator: id}, {$set: body}, {new: true}).then((services) => {
      if (!services) {
        return res.status(404).send();
      }
  
      res.send({services});
    }).catch((e) => {
      res.status(400).send();
    })
  });
  

  router.put('/serviceAvailedToday/:id', SubAuthenticate, (req, res) => {
    console.log(" ***** Update Service ******\n\n");
    var id = req.params.id;
    var body = req.body;
    console.log(body);

  
  
    Services.findOneAndUpdate({ _creator: id}, {$set: body}, {new: true}).then((services) => {
      if (!services) {
        return res.status(404).send();
      }
  
      res.send({services});
    }).catch((e) => {
      res.status(400).send();
    })
  });


module.exports = router;
