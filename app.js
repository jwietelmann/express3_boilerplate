
/**
 * Module dependencies.
 */

var config = require('./config')
  , express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , jadeBrowser = require('jade-browser')
  , socketIo = require('socket.io')
  , passportSocketIo = require('passport.socketio')
  , mongoose = require('mongoose')
  , models = require('./models')
  , User = models.User
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , MongoStore = require('connect-mongo')(express)
  , sessionStore = new MongoStore({ url: config.mongodb })
;

// set up passport authentication
if(config.enableEmailLogin) {
  passport.use(new LocalStrategy(
    {
      usernameField: 'email'
    },
    function(email, password, done) {
      process.nextTick(function() {
        User.authEmail(email, password, done);
      });
    }
  ));
}
if(config.twitter) {
  var TwitterStrategy = require('passport-twitter').Strategy;
  passport.use(new TwitterStrategy(
    config.twitter,
    function(token, tokenSecret, profile, done) {
      process.nextTick(function() {
        User.authTwitter(token, tokenSecret, profile, done);
      });
    }
  ));
}
if(config.facebook) {
  var FacebookStrategy = require('passport-facebook').Strategy;
  passport.use(new FacebookStrategy(
    config.facebook,
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        User.authFacebook(accessToken, refreshToken, profile, done);
      });
    }
  ));
}
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// connect the database
mongoose.connect(config.mongodb);

// create app, server, and web sockets
var app = express()
  , server = http.createServer(app)
  , io = socketIo.listen(server)
;

// Make socket.io a little quieter
io.set('log level', 1);
// Give socket.io access to the passport user from Express
io.set('authorization', passportSocketIo.authorize({
  passport: passport,
  sessionKey: 'connect.sid',
  sessionStore: sessionStore,
  sessionSecret: config.sessionSecret,
  success: function(data, accept) {
    accept(null, true);
  },
  fail: function(data, accept) { // keeps socket.io from bombing when user isn't logged in
    accept(null, true);
  }
}));

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  // export jade templates to reuse on client side
  // This includes a kind of terrible cache-buster hack
  // It generates a new cache-busting query string for the script tag every time the server starts
  // This should probably only happen every time there's a change to the templates.js file
  var jadeTemplatesPath = '/js/templates.js';
  app.use(jadeBrowser(jadeTemplatesPath, ['*.jade', '*/*.jade'], { root: __dirname + '/views', minify: true }));
  var jadeTemplatesCacheBuster = (new Date()).getTime();
  var jadeTemplatesSrc = jadeTemplatesPath + '?' + jadeTemplatesCacheBuster;
  global.jadeTemplates = function() { return '<script src="' + jadeTemplatesSrc + '" type="text/javascript"></script>'; }

  // use the connect assets middleware for Snockets sugar
  app.use(require('connect-assets')());

  app.use(express.favicon());
  app.use(express.logger(config.loggerFormat));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.sessionSecret));
  app.use(express.session({ store: sessionStore }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));

  if(config.useErrorHandler) app.use(express.errorHandler());
});

// API routes
// Do not call res.send(), res.json(), etc. in API route functions
// Instead, within each API route, set res.jsonData to the JSON data, then call next()
// This will allow us to write UI route functions that piggyback on the API functions
//
// Example API function for /api/me:
/*
  exports.show = function(req, res, next) {
    res.jsonData = req.user;
    next();
  };
*/
app.get('/api/me', routes.api.me.show);
app.get('/api/users/:id', routes.api.users.show);
// this catch-all route will send JSON for every API route
app.all('/api/*', function(req, res) { res.json(res.jsonData); });

// UI routes
// Within each UI route function, call the corresponding API function.
// Grab the API response data from res.jsonData and render as needed.
//
// Example UI function for /me:
/*
  var me = require('../api/me');
  exports.show = function(req, res) {
    me.show(req, res, function() {
      res.render('me/index', { title: 'Profile', user: res.jsonData });
    });
  };
*/
app.get('/', routes.ui.index.list);
app.post('/auth/register', routes.ui.auth.register);
app.post('/auth/email', routes.ui.auth.email);
if(config.twitter) {
  app.get('/auth/twitter', routes.ui.auth.twitter);
  app.get('/auth/twitter/callback', routes.ui.auth.twitterCallback);
}
if(config.facebook) {
  app.get('/auth/facebook', routes.ui.auth.facebook);
  app.get('/auth/facebook/callback', routes.ui.auth.facebookCallback);
}
app.get('/auth/finish', routes.ui.auth.finish);
app.get('/auth/signOut', routes.ui.auth.signOut);
app.get('/me', routes.ui.me.show);
app.put('/me', routes.ui.me.update);
app.get('/users/:id', routes.ui.users.show);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
