const express = require('express');
var app = express();

const bodyParser = require('body-parser');

const port = process.env.PORT;

app.use(bodyParser.json());


module.exports.start=function start(){
    app.listen(port, () => {
        console.log(`Started up at port ${port}`);
    });
      
}

module.exports = {app};