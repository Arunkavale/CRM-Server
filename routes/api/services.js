var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

var {authenticate} = require('../authenticate');
var Services=mongoose.model('services');




router.post('/createServices', authenticate, (req, res) => {
    console.log("****** Services Post *****\n\n ");
    console.log(req.body);
    
    var services = new Services({
      categoryName: req.body.categoryName,
      services: {
        serviceName:req.body.serviceName,
        price:req.body.price   
      },
      _creator: req.user._id
    });
    services.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  });
  
  
  router.get('/getService', authenticate, (req, res) => {
    console.log("****** Services Get *****\n\n ");
      
    Services.find({
      _creator: req.user._id
    }).then((services) => {
      res.send({services});
    }, (e) => {
      res.status(400).send(e);
    });
  });



module.exports = router;
