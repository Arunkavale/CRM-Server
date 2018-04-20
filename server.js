require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Configuration} = require('./models/configuration-model');
var {User} = require('./models/user-model');
var {Services} = require('./models/services-model');

var {Subscriber} = require('./models/subscriber-model');
var {Walkins} = require('./models/walkins-model');
var {Appointment} = require('./models/appiontment-model');
var {Enquiry} = require('./models/Enquiry-model');
var {UnattendedCalls} = require('./models/unattended-model');

var {authenticate} = require('./routes/authenticate');

var {SubAuthenticate} = require('./routes/subAuthenticate');
require('./models/call-logs_model');
var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use(require('./routes'));


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
