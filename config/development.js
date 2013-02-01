exports.loggerFormat = 'dev';
exports.useErrorHandler = true;
exports.mongodb = 'mongodb://localhost/boilerplate';
exports.sessionSecret = 'your secret here';

exports.enableGuestLogin = true;
exports.enableEmailLogin = true;
exports.twitter = {
  consumerKey: 'my consumer key',
  consumerSecret: 'my consumer secret'
};
exports.facebook = {
  clientID: 'my client id',
  clientSecret: 'my client secret',
  callbackURL: 'http://127.0.0.1:3000/auth/facebook/callback'
};

exports.socketIo = {
  useLongPolling: true // Set to 'true' for Heroku deployment, 'false' for platforms that support WebSockets
};
