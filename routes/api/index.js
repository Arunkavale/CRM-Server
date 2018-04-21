var router = require('express').Router();

console.log("inside api route");
// router.use('/', require('./users'));
router.use('', require('./callLogs'));
router.use('', require('./user'));
router.use('', require('./walkins'));
router.use('', require('./services'));
router.use('', require('./enquiry'));
router.use('', require('./subscriber'));
router.use('', require('./unattended'));
router.use('', require('./appointment'));
router.use('', require('./customer'));


// router.use('/articles', require('./articles'));
// router.use('/tags', require('./tags'));

router.use(function(err, req, res, next){
  if(err.name === 'ValidationError'){
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key){
        errors[key] = err.errors[key].message;

        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;