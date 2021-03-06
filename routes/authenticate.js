var {User} = require('../models/user-model');

var authenticate = (req, res, next) => {
  var token = req.header('user-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send({"statusCode": 2,
    "message": "invalid user"});
  });
};

module.exports = {authenticate};
