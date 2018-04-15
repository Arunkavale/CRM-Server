const express = require('express');
const bodyParser = require('body-parser');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
  });
  
  module.exports = {app};
  