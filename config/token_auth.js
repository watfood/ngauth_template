var jwt = require('jsonwebtoken');

var User = require('../models/user');

module.exports = {
  create:       create,
  authenticate: authenticate
};

// This function will create a JWT and return it to the user in the
// response. It acts as Express middleware.
function create(req, res, next) {
  if (!req.body.email || !req.body.password) {
    return res.status(422).send('Missing required fields');
  }
  User
    .findOne({email: req.body.email}).exec()
    .then(function(user) {
      if (!user || !user.verifyPasswordSync(req.body.password)) {
        res.sendStatus(403);
      } else {
        var token = generate({
            email: user.email,
            name:  user.name,
            use:   'public_api'
        });
        res.json({
          message: 'Successfully generated token',
          token:   token
        });
      }
    });
}

// This function will authenticate a given request based on a JWT
// found in the request. It acts as Express middleware, and adds the
// decoded token to req.decoded.
function authenticate(req, res, next) {
  var token = validate(req);
  if (!token) {
    return res.sendStatus(401);
  } else {
    verify(token, next, function(decoded) {
      req.decoded = decoded;
      next();
    });
  }
}

// This function will generate a JWT given a paylod object.
function generate(payload) {
  return jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    { expiresIn: 10000 }
  );
}

// This function will validate a token that is on a request, and
// return it if it does.
function validate(req) {
  var authHeader = req.get('Authorization') ? req.get('Authorization') : req.get('Authorisation');
  var token;

  if (authHeader) {
    // Check the Authorization header for the given pattern, and
    // set the token to the 2nd match group if it exists.
    var match = authHeader.match(/(bearer|token) (.*)/i);
    token = match ? match[2] : match;
  }

  // If no token was found in the header, check the query string.
  if (!token) {
    token = req.query.token;
  }

  return token;
}

// This function will verify that a given token is correct.
function verify(token, next, cb) {
  jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
    if (err && err.name === 'TokenExpiredError') {
      next({
        status:  401,
        message: 'Authorization failed (invalid_token): token expired.'
      });
    } else if (err) {
      next({
        status:  401,
        message: 'Authorization failed (invalid_token): token malformed.'
      });
    } else {
      cb(decoded);
    }
  });
}
