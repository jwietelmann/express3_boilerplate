/**
 * Global modules we use everywhere
 */

var _ = global._ = require('underscore')
  , async = global.async = require('async')
  , config = global.config = require('./config')
;



/**
 * Other module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')

  // Database and models
  , mongoose = require('mongoose')
  , models = require('./models')
  , User = models.User

  // MongoDB-backed session management
  , MongoStore = require('connect-mongo')(express)
  , sessionStore = new MongoStore({ url: config.mongodb })

  // Passport auth middleware
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy

  // Socket.io stuff - delete if you don't plan to use socket.io
  , socketIo = require('socket.io')
  , passportSocketIo = require('passport.socketio')

  // Management of client-side assets (javascripts, CSS preprocessors, markup templates)
  , jadeBrowser = require('jade-browser')
  , connectAssets = require('connect-assets')

  // Route functions
  , routes = require('./routes');
;



/**
 * Passport auth setup
 */

// Tells passport how to store/load User models
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Allows users to log in as guest - most apps won't use this
if(config.enableGuestLogin) {
  passport.use('guest', new LocalStrategy(
    {
      usernameField: 'name',
    },
    // Doesn't actually use password, just records name
    function(name, password, done) {
      process.nextTick(function() {
        User.authGuest(name, done);
      });
    }
  ));
}

// Simple email-based user accounts
if(config.enableEmailLogin) {
  passport.use('email', new LocalStrategy(
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

// Twitter connect
if(config.twitter) {
  passport.use(new TwitterStrategy(
    config.twitter,
    function(token, tokenSecret, profile, done) {
      process.nextTick(function() {
        User.authTwitter(token, tokenSecret, profile, done);
      });
    }
  ));
}

// Facebook connect
if(config.facebook) {
  passport.use(new FacebookStrategy(
    config.facebook,
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        User.authFacebook(accessToken, refreshToken, profile, done);
      });
    }
  ));
}



/*
 * Express.js app setup/configuration
 */

// Create Express.js application and HTTP server for it to ride on
var app = express()
  , server = http.createServer(app)
;

// Configure the Express.js application
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  // Export jade templates to reuse on client side
  // This includes a kind of terrible cache-buster hack
  // It generates a new cache-busting query string for the script tag every time the server starts
  // This should probably only happen every time there's a change to the templates.js file
  var jadeTemplatesPath = '/js/templates.js';
  app.use(jadeBrowser(jadeTemplatesPath, ['*.jade', '*/*.jade'], { root: __dirname + '/views', minify: true }));
  var jadeTemplatesCacheBuster = (new Date()).getTime();
  var jadeTemplatesSrc = jadeTemplatesPath + '?' + jadeTemplatesCacheBuster;
  global.jadeTemplates = function() { return '<script src="' + jadeTemplatesSrc + '" type="text/javascript"></script>'; }

  // Use the connect assets middleware for serving JS/CSS
  app.use(connectAssets());

  app.use(express.favicon());
  app.use(express.logger(config.loggerFormat));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.sessionSecret));
  app.use(express.session({ store: sessionStore }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  if(config.useErrorHandler) app.use(express.errorHandler());
});



/**
 * Socket.io setup
 */

var io = socketIo.listen(server)

// Default socket.io is very noisy
io.set('log level', 1);

// Give socket.io access to the Passport user from Express
io.set('authorization', passportSocketIo.authorize({
  cookieParser: express.cookieParser,
  key: 'express.sid',
  secret: config.sessionSecret,
  store: sessionStore,
  success: function(data, accept) {
    accept(null, true);
  },
  // Keeps socket.io from bombing when user isn't logged in
  fail: function(data, accept) {
    accept(null, true);
  }
}));

// Heroku doesn't support WebSockets, so use long-polling for Heroku
if(config.socketIo && config.socketIo.useLongPolling) {
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10);
}



/**
 * Define Express.js route flow
 */

// Index
app.get('/', routes.ui.home);

// Authentication routes
if(config.enableGuestLogin) {
  app.post('/auth/guest', routes.ui.auth.guest);
}
if(config.enableEmailLogin) {
  app.post('/auth/registerEmail', routes.ui.auth.registerEmail);
  app.post('/auth/email', routes.ui.auth.email);
}
if(config.twitter) {
  app.get('/auth/twitter', routes.ui.auth.twitter);
  app.get('/auth/twitter/callback', routes.ui.auth.twitterCallback);
}
if(config.facebook) {
  app.get('/auth/facebook', routes.ui.auth.facebook);
  app.get('/auth/facebook/callback', routes.ui.auth.facebookCallback);
}
app.get('/auth/success', routes.ui.auth.success);
app.get('/auth/failure', routes.ui.auth.failure)
app.get('/auth/logout', routes.ui.auth.logout);



/**
 * Set your application loose on the world...
 */

mongoose.connect(config.mongodb);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
