const auth = require('express-basic-auth');

module.exports = () => {
  const credentials = {};
  credentials[process.env.AUTH_USER] = process.env.AUTH_PASS;

  const authorize = auth({
    users: credentials,
    challenge: true,
  });

  return authorize;
};
