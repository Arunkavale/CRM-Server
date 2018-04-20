    var router = require('express').Router();
    var mongoose = require('mongoose');
    var User = mongoose.model('User');

    var {authenticate} = require('../authenticate');
    var Call_logs=mongoose.model('Call_logs');
    


    router.post('/calllogs', authenticate, (req, res) => {
        console.log("inside calllogs Post request")
        var calllogs = new Call_logs({
            customerNumber: req.body.customerNumber,
            customerName: req.body.customerName,
            operatorId: req.body.operatorId,
            datetime: new Date(),
            callType: req.body.callType,
            timeOfCall: req.body.timeOfCall,
            callDuration: req.body.callDuration,
            recordingFile: req.body.recordingFile,
            purpose: req.body.purpose,
            _creator: req.user._id
        });
        console.log("******// Call logs //******");
        console.log(calllogs);
        calllogs.save().then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        });
    });
  


    router.get('/calllogs', authenticate, (req, res) => {
        Call_logs.find({
          _creator: req.user._id
        }).then((calllogs) => {
          res.send({calllogs});
        }, (e) => {
          res.status(400).send(e);
        });
      });

      module.exports = router;

