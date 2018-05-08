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
            
            for( i=0;i<data.length;i++){
                console.log(data[i]);
                if(rmUnattendedCall[i].callType=='Missed'){
                    console.log("inside incoming and outgoing");
                    var unattendedCalls = new UnattendedCalls({
                        number: rmUnattendedCall[i].customerNumber,
                        missedcalltime: /* moment.unix( */rmUnattendedCall[i].timeOfCall,
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
                var calllogs = new Call_logs({
                    customerNumber: req.body[i].customerNumber,
                    customerName: req.body[i].customerName,
                    operatorId: req.body[i].operatorId,
                    datetime: new Date().getTime(),
                    callType: req.body[i].callType,
                    timeOfCall: /* moment.unix( */req.body[i].timeOfCall,
                    callDuration: req.body[i].callDuration,
                    recordingFile: req.body[i].recordingFile,
                    purpose: req.body[i].purpose,
                    _creator: req.user._id,
                    subscriberId:req.user.subscriberId
                });
                if(data[i].callType!=="Missed" && !req.body[i].hasOwnProperty("purpose")){
                    // res.send({'Message':'Perpose is required'});
                        res.send({'statusCode':1,'message':'Invalid input (Purpose is required)'});
                    break;
                }else{
                    calllogs.save().then((doc) => {
                        // console.log(doc);
                        console.log("**** call logs Unattended call **** \n\n");
                        // console.log(doc);
                        // var rmUnattendedCall=req.body;
                        
                        // console.log(rmUnattendedCall.length);
                        // for(var j=0;j<rmUnattendedCall.length;j++){
                        //     if(rmUnattendedCall[j].callType==='Incoming'||rmUnattendedCall[j].callType==='Outgoing'){
                        //         console.log("inside incoming and outgoing");

                        //         UnattendedCalls.remove({
                        //             'number': rmUnattendedCall[j].customerNumber
                        //         }).exec(function (err, removedData) {
                        //             if (err) {
                        //                 console.log("inside Error");
                        //                 message: errorHandler.getErrorMessage(err)
                        //                 return res.status(400).send({
                        //             });
                        //             }
                        //             else{
                        //                 console.log(removedData);
                        //             }
                        //         });
                        //     }
                        // }


                       

                        Customer.find({customerNumber : doc.customerNumber}).exec(function (err, customer) {
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
                                    res.status(400).send(e);
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
                        res.status(400).send(e);
                    });
                }
            }
    }
    else{
        // res.send({'Message':'Request Formate is wrong'});
         res.send({'statusCode':1,'message':'Invalid input '});
        }
    });
  
    router.get('/v1/getRecordings/:fromDate/:toDate', SubAuthenticate, (req, res) => {
        var fromDate=moment.unix(req.params.fromDate);
        var toDate=moment.unix(req.params.toDate);
        console.log(fromDate);
        console.log(toDate);
        Call_logs.find({
            $and :[ { createdTime: {$gte: fromDate, $lt: toDate }},{ subscriberId: req.subscriber._id }]
        }).then((calllogs) => {
            if(calllogs[0]==undefined||calllogs[0]==null||calllogs[0]==''){
                res.send({'statusCode':2,'message':'No data Availbale'});
            }
            else{
                res.send({'statusCode':0,'type':'calllogs','data':calllogs});
            }
        }, (e) => {
          res.status(400).send(e);
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
          res.status(400).send(e);
        });
      });

      module.exports = router;

