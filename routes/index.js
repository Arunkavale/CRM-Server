var router = require('express').Router();
console.log("inside route.js");
router.use('', require('./api'));

module.exports = router;