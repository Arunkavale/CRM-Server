    var router = require('express').Router();
    var mongoose = require('mongoose');
    var User = mongoose.model('User');

    var {authenticate} = require('../authenticate');
    var Call_logs=mongoose.model('Call_logs');
    var UnattendedCalls=mongoose.model('unattendedCalls');
    var {SubAuthenticate} = require('../subAuthenticate');
    

    var moment = require('moment');
    
    // var customer=require('./customer');
    var Customer=mongoose.model('Customer');

    router.post('/v1/calllogs', authenticate, (req, res) => {
        console.log("inside calllogs Post request")
        var dob,email,user=req.user._id;
        var data=req.body;
        var rmUnattendedCall=req.body;
        var i=0;
        if(req.body instanceof Array ){



                Customer.find({
                    _creator: req.user._id,customerNumber : req.body[0].customerNumber
                  }).then((customer) => {
                    for( i=0;i<data.length;i++){
                        console.log(customer);
                        console.log(" ****** inside For loop *******")
                        console.log(data[i]);
                        if(rmUnattendedCall[0].callType=='Missed'){
                            console.log("inside incoming and outgoing");
                            var unattendedCalls = new UnattendedCalls({
                                number: rmUnattendedCall[0].customerNumber,
                                missedcalltime: /* moment.unix( */rmUnattendedCall[0].timeOfCall,
                                createdTime: new Date().getTime(),
                                customerId: req.user._id,
                                subscriberId:req.user.subscriberId
                              });
                              console.log(unattendedCalls);
                                unattendedCalls.save().then((doc) => {
                              }, (e) => {
                                res.status(400).send(e);
                              });
                        }

                        if(customer[0]!=null || customer[0]!=undefined){
                            console.log("**** inside customer if ******\n\n");
                            console.log(customer[0]);
                            console.log(req.body);
                            if(customer[0].customerNumber==req.body[i].customerNumber){
                                var calllogs = new Call_logs({
                                    customerNumber: req.body[0].customerNumber,
                                    customerName: customer[0].customerName,
                                    operatorId: req.body[0].operatorId,
                                    datetime: new Date().getTime(),
                                    callType: req.body[0].callType,
                                    timeOfCall: /* moment.unix( */req.body[0].timeOfCall,
                                    callDuration: req.body[0].callDuration,
                                    recordingFile: req.body[0].recordingFile,
                                    purpose: req.body[0].purpose,
                                    _creator: req.user._id,
                                    subscriberId:req.user.subscriberId
                                });
                            }
                            else{
                                var calllogs = new Call_logs({
                                    customerNumber: req.body[0].customerNumber,
                                    // customerName: customer[0].customerName,
                                    operatorId: req.body[0].operatorId,
                                    datetime: new Date().getTime(),
                                    callType: req.body[0].callType,
                                    timeOfCall: /* moment.unix( */req.body[0].timeOfCall,
                                    callDuration: req.body[0].callDuration,
                                    recordingFile: req.body[0].recordingFile,
                                    purpose: req.body[0].purpose,
                                    _creator: req.user._id,
                                    subscriberId:req.user.subscriberId
                                });
                            }

                        }
                        else{
                            var calllogs = new Call_logs({
                                customerNumber: req.body[0].customerNumber,
                                // customerName: customer[0].customerName,
                                operatorId: req.body[0].operatorId,
                                datetime: new Date().getTime(),
                                callType: req.body[0].callType,
                                timeOfCall: /* moment.unix( */req.body[0].timeOfCall,
                                callDuration: req.body[0].callDuration,
                                recordingFile: req.body[0].recordingFile,
                                purpose: req.body[0].purpose,
                                _creator: req.user._id,
                                subscriberId:req.user.subscriberId
                            });
                        }
                        

                        if(data[0].callType!=="Missed" && !req.body[0].hasOwnProperty("purpose")){
                            // res.send({'Message':'Perpose is required'});
                                res.send({'statusCode':1,'message':'Invalid input (Purpose is required)'});
                            break;
                        }else{
                            console.log(calllogs);
                            calllogs.save().then((doc) => {
                                // console.log(doc);
                                console.log("**** call logs Unattended call **** \n\n");
                                // console.log(doc);
                                var rmUnattendedCall=req.body;
                                console.log(rmUnattendedCall.length);
                                for(var j=0;j<rmUnattendedCall.length;j++){
                                    if(rmUnattendedCall[j].callType==='Incoming'||rmUnattendedCall[j].callType==='Outgoing'){
                                        console.log("inside incoming and outgoing");
                                        UnattendedCalls.remove({
                                            'number': rmUnattendedCall[j].customerNumber
                                        }).exec(function (err, removedData) {
                                            if (err) {
                                                console.log("inside Error");
                                                message: errorHandler.getErrorMessage(err)
                                                return res.status(400).send({err
                                            });
                                            }
                                            else{
                                                console.log(removedData);
                                            }
                                        });
                                    }
                                }

                                Customer.find({customerNumber : doc.customerNumber,_creator:req.req.user._id}).exec(function (err, customer) {
                                    if (err) {
                                    return res.status(400).send({
                                        message: errorHandler.getErrorMessage(err)
                                    });
                                    } else {
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
                                        }, (e) => {

                                            res.status(400).send({ 'statusCode':1,
                                            'Error':e.message});
                                        });
                                    }
                                    else{
                                        console.log("customer present");
                                        // if(i==data.length-1){
                                            // res.send(doc);
                                        // } 
                                        }
                                    }
                                });
                                res.send({'statusCode':1,'message':'CallLogs Added Sucessfully'});
                            }, (e) => {
                                var keysOfObject=Object.keys(e.errors);
                                res.status(400).send({ 'statusCode':1,
                                'message':e['errors'][keysOfObject[0]].message});
                                // res.status(400).send({ 'statusCode':1,
                                // 'Error':e.message});
                            });
                        }
                    }
                    res.send({'statusCode':1,'message':'CallLogs Added Sucessfully'});
                            // res.send({unattendedCalls});
                            // res.send({'statusCode':0,'type':'unattendedCalls','data':unattendedCalls});
                        }, (e) => {
                            res.status(400).send(e);
                        });
    }
    else{
        // res.send({'Message':'Request Formate is wrong'});
         res.send({'statusCode':1,'message':'Invalid input '});
        }
    });
  

    router.get('/v1/allRecordings/:fromDate/:toDate', SubAuthenticate, (req, res) => {
        var fromDate=moment.unix(req.params.fromDate);
        var toDate=moment.unix(req.params.toDate);
        console.log(fromDate);
        console.log(toDate);
        Call_logs.find({
            $and :[ { createdTime: {$gte: fromDate, $lte: toDate }},{ subscriberId: req.subscriber._id }]
        }).then((calllogs) => {
            if(calllogs[0]==undefined||calllogs[0]==null||calllogs[0]==''){
                res.send({'statusCode':2,'message':'No data Availbale'});
            }
            else{
                res.send({'statusCode':0,'type':'calllogs','data':calllogs});
            }
        }, (e) => {
          res.status(400).send({ 'statusCode':1,
          'Error':e.message});
        });
      });


      router.get('/v1/recordingsByOperators/:fromDate/:toDate/:operatorId', SubAuthenticate, (req, res) => {
        var fromDate=moment.unix(req.params.fromDate);
        var toDate=moment.unix(req.params.toDate);
        var operatorId=req.params.operatorId;
        console.log(fromDate);
        console.log(toDate);
        Call_logs.find({
            $and :[ { createdTime: {$gte: fromDate, $lte: toDate }},{ _creator: operatorId }]
        }).then((calllogs) => {
            if(calllogs[0]==undefined||calllogs[0]==null||calllogs[0]==''){
                res.send({'statusCode':2,'message':'No data Availbale'});
            }
            else{
                res.send({'statusCode':0,'type':'calllogs','data':calllogs});
            }
        }, (e) => {
          res.status(400).send({ 'statusCode':1,
          'Error':e.message});
        });
      });


    router.get('/v1/callLogs', authenticate, (req, res) => {
        Call_logs.find({
          _creator: req.user._id
        }).then((calllogs) => {
            if(calllogs[0]==undefined||calllogs[0]==null){
                res.send({'statusCode':2,'message':'No data Availbale'});
              }
              else{
                res.send({'statusCode':0,'type':'calllogs','data':calllogs});
              }
        }, (e) => {
          res.status(400).send({ 'statusCode':1,
          'Error':e.message});
        });
      });

      module.exports = router;

