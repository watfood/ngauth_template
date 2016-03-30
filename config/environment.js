var _ = require('lodash');

var localEnvVars = {
  TITLE:          'Auth App',
  SAFE_TITLE:     'auth-app',
  COOKIE_SECRET:  'notsosecretnowareyou',
  SESSION_SECRET: 'anotherfoolishsecret',
  TOKEN_SECRET:   'andafinalsecretsadasitis'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
