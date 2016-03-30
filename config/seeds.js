var mongoose = require('./database');

var User = require('../models/user');

User
  .remove({})
  .then(function() {
    console.log('All users removed…');

    return mongoose.connection.close();
  })
  .then(function() {
    process.exit(0);
  });
