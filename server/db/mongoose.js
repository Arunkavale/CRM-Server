var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
console.log(process.env);
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};
