var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var {SubAuthenticate} = require('../subAuthenticate');
var Services=mongoose.model('services');




router.post('/createServices', SubAuthenticate, (req, res) => {
    console.log("****** Services Post *****\n\n ");
    console.log(req.body);
    
    var services = new Services({
      categoryName: req.body.categoryName,
      services: {
        serviceName:req.body.services.serviceName,
        price:req.body.services.price   
      },
      _creator: req.subscriber._id
    });
    services.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
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



module.exports = router;
