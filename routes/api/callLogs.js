    var router = require('express').Router();
    var mongoose = require('mongoose');
    var User = mongoose.model('User');

    var {authenticate} = require('../authenticate');
    var Call_logs=mongoose.model('Call_logs');
    
    // var customer=require('./customer');
    var Customer=mongoose.model('Customer');
    


    router.post('/calllogs', authenticate, (req, res) => {
        console.log("inside calllogs Post request")
        var dob,email,user=req.user._id;
        
        var data=req.body;
        console.log(data.length);
        for(var i=0;i<data.length;i++){
            console.log(data[i]);

            var calllogs = new Call_logs({
                customerNumber: req.body[i].customerNumber,
                customerName: req.body[i].customerName,
                operatorId: req.body[i].operatorId,
                datetime: new Date(),
                callType: req.body[i].callType,
                timeOfCall: req.body[i].timeOfCall,
                callDuration: req.body[i].callDuration,
                recordingFile: req.body[i].recordingFile,
                purpose: req.body[i].purpose,
                _creator: req.user._id
            });
            console.log("******// Call logs //******");
            // console.log(calllogs);
            calllogs.save().then((doc) => {
                console.log(doc);
                console.log("**** call logs **** \n\n");
                console.log(doc);
                Customer.find({customerNumber : doc.customerNumber}).exec(function (err, customer) {
                    if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                    } else {
                    console.log(customer);
                    if(customer[0]==undefined||customer[0]==null||customer[0]==''){
                        console.log("customer not present");
                        var customer = new Customer({
                        customerNumber: doc.customerNumber,
                        customerName: doc.customerName,
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
                        res.send(doc);
                    }
                    }
                 });
            }, (e) => {
                res.status(400).send(e);
            });
        }
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

