    var router = require('express').Router();
    var mongoose = require('mongoose');
    var User = mongoose.model('User');

    var {authenticate} = require('../authenticate');
    var Call_logs=mongoose.model('Call_logs');
    var UnattendedCalls=mongoose.model('unattendedCalls');
    

    var moment = require('moment');
    
    // var customer=require('./customer');
    var Customer=mongoose.model('Customer');
    


    router.post('/calllogs', authenticate, (req, res) => {
        console.log("inside calllogs Post request")

        var dob,email,user=req.user._id;
        
        var data=req.body;

        console.log(typeof(req.body));

        console.log(data.length);

        // async.eachSeries(data, function updateObject (obj, done) {
          
            

        // }, function allDone (err) {
        //     // this will be called when all the updates are done or an error occurred during the iteration
        // });



        // if(req.body instanceof Array ){
        // }

        if(req.body instanceof Array ){
        
        for(var i=0;i<data.length;i++){
            console.log(data[i]);

            var calllogs = new Call_logs({
                customerNumber: req.body[i].customerNumber,
                customerName: req.body[i].customerName,
                operatorId: req.body[i].operatorId,
                datetime: new Date(),
                callType: req.body[i].callType,
                timeOfCall: moment.unix(req.body[i].timeOfCall),
                callDuration: req.body[i].callDuration,
                recordingFile: req.body[i].recordingFile,
                purpose: req.body[i].purpose,
                _creator: req.user._id
                
                
            });
            if(data[i].callType!=="Missed" && !req.body[i].hasOwnProperty("purpose")){
                res.send({'Message':'Perpose is required'});
                break;
                
            }else{

                
                calllogs.save().then((doc) => {
                    // console.log(doc);
                    console.log("**** call logs **** \n\n");
                    console.log(doc);
                    if(doc.callType==='Incoming'||doc.callType==='Outgoing'){
                        console.log("inside incoming and outgoing");
                        UnattendedCalls.remove({
                            'number': doc.customerNumber
                          }).exec(function (err, removedData) {
                            if (err) {
                              message: errorHandler.getErrorMessage(err)
                              return res.status(400).send({
                        
                              });
                            }
                            else{
                                console.log(removedData);
                            }
                        });
                    }
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
                res.send({'Message':'CallLogs Added Sucessfully'});
                  
                }, (e) => {
                    res.status(400).send(e);
                });

            }
            console.log(req.body[i].hasOwnProperty("customerNumber"))
            console.log("******// Call logs //******");
            console.log(calllogs);
           
        }
    }
    else{
        res.send({'Message':'Request Formate is wrong'});
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

